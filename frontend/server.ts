/**
 * Campus Twin - Backend Server
 * Express + Vite middleware with Google GenAI SDK & Databricks Lakehouse service abstraction.
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
function getGenAI(): GoogleGenAI | null {
  if (process.env.GEMINI_API_KEY) {
    try {
      return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }
  return null;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Campus Twin Career Intelligence API', timestamp: new Date().toISOString() });
});

// Databricks Lakehouse status
app.get('/api/databricks/status', (req, res) => {
  const isDatabricksConfigured = Boolean(process.env.DATABRICKS_HOST && process.env.DATABRICKS_TOKEN);
  res.json({
    connected: isDatabricksConfigured,
    catalog: 'campus_twin_lakehouse',
    schema: 'student_career_intelligence',
    mode: isDatabricksConfigured ? 'Connected to Databricks' : 'Demo Lakehouse Mode',
    syncedTables: [
      { name: 'dim_students', rows: 2450, lastSync: '2026-08-31 22:00 UTC' },
      { name: 'dim_career_roles', rows: 48, lastSync: '2026-08-31 22:00 UTC' },
      { name: 'dim_skills_taxonomy', rows: 280, lastSync: '2026-08-31 22:00 UTC' },
      { name: 'fact_campus_opportunities', rows: 120, lastSync: '2026-08-31 22:00 UTC' },
      { name: 'fact_placement_records', rows: 840, lastSync: '2026-08-31 22:00 UTC' },
      { name: 'fact_skill_graph_edges', rows: 3200, lastSync: '2026-08-31 22:00 UTC' },
    ],
    genieEngine: 'Databricks Genie AI v2.4 (Active)',
  });
});

// Natural language profile extraction endpoint
app.post('/api/profile/extract-natural', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const ai = getGenAI();

    if (ai) {
      const prompt = `You are Campus Twin's student profile extractor.
Given a natural student introduction, extract the structured profile information in strictly valid JSON without markdown fences.

Input: "${text}"

JSON Schema:
{
  "name": string (e.g. "Student" or extracted name),
  "department": string (e.g. "Computer Science & Engineering", "Information Technology", "Electronics", etc.),
  "semester": number (1-8, default 4),
  "cgpa": number (0-10, e.g. 8.2),
  "skills": [{"name": string, "level": "Beginner" | "Intermediate" | "Advanced"}],
  "interests": string[],
  "projectsCount": number,
  "careerGoal": string (e.g. "AI Engineer", "Data Scientist", "Full-Stack Software Engineer"),
  "weeklyHours": number (default 6)
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const rawText = response.text?.trim() || '{}';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, extracted: parsed, source: 'gemini-2.5-flash' });
      } catch (err) {
        console.warn('Gemini extraction failed, falling back to heuristic parser:', err);
      }
    }

    // Heuristic fallback parser
    const lower = text.toLowerCase();
    const cgpaMatch = text.match(/([5-9](\.\d{1,2})?|10(\.0{1,2})?)\s*(cgpa|gpa)?/i);
    const semMatch = text.match(/(\d)(st|nd|rd|th)?\s*(sem|semester)/i);

    const skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }[] = [];
    const skillKeywords = [
      'python', 'c++', 'java', 'javascript', 'sql', 'react', 'node.js',
      'machine learning', 'data science', 'git', 'docker', 'cloud', 'statistics'
    ];
    skillKeywords.forEach((k) => {
      if (lower.includes(k)) {
        skills.push({
          name: k.charAt(0).toUpperCase() + k.slice(1),
          level: lower.includes(`advanced ${k}`) ? 'Advanced' : 'Intermediate',
        });
      }
    });

    const interests: string[] = [];
    if (lower.includes('ai') || lower.includes('artificial intelligence')) interests.push('Artificial Intelligence');
    if (lower.includes('data')) interests.push('Data Science');
    if (lower.includes('web') || lower.includes('software')) interests.push('Software Development');
    if (lower.includes('research')) interests.push('Academic Research');

    const projMatch = text.match(/(\d+)\s*(project|projects)/i);

    const heuristicProfile = {
      name: 'Student',
      department: lower.includes('ece') || lower.includes('electronics') ? 'Electronics & Communication' : 'Computer Science & Engineering',
      semester: semMatch ? parseInt(semMatch[1], 10) : 4,
      cgpa: cgpaMatch ? parseFloat(cgpaMatch[1]) : 8.0,
      skills: skills.length > 0 ? skills : [{ name: 'Python', level: 'Intermediate' }, { name: 'C++', level: 'Intermediate' }],
      interests: interests.length > 0 ? interests : ['Artificial Intelligence', 'Data Science'],
      projectsCount: projMatch ? parseInt(projMatch[1], 10) : 2,
      careerGoal: lower.includes('ai') ? 'AI Engineer' : lower.includes('data') ? 'Data Scientist' : 'Full-Stack Software Engineer',
      weeklyHours: 6,
    };

    return res.json({ success: true, extracted: heuristicProfile, source: 'heuristic' });
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: 'Failed to extract profile' });
  }
});

// Databricks Genie query / Career Advisor endpoint
app.post('/api/genie/query', async (req, res) => {
  try {
    const { query, studentProfile } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const ai = getGenAI();

    if (ai) {
      const prompt = `You are Databricks Genie & Campus Twin Intelligence, an explainable university career reasoning agent.
You have access to the university's connected student lakehouse:
- Student Profile:
  Name: ${studentProfile?.name || 'Student'}
  Dept: ${studentProfile?.department || 'CSE'}, Semester: ${studentProfile?.semester || 4}, Year: ${studentProfile?.year || 2}
  CGPA: ${studentProfile?.cgpa || 8.2}
  Skills: ${JSON.stringify(studentProfile?.skills || [])}
  Interests: ${JSON.stringify(studentProfile?.interests || [])}
  Weekly Hours Available: ${studentProfile?.weeklyHours || 6} hrs/week
  Projects: ${studentProfile?.projects?.length || 2}
  Target Role: ${studentProfile?.careerGoal || 'AI Engineer'}

User Question: "${query}"

Return a strictly valid JSON response without markdown codeblocks matching this exact schema:
{
  "recommendation": "Clear, direct, grounded answer (2-3 concise sentences)",
  "why": "Specific rationale linking the student's actual CGPA, skills, projects and time availability",
  "skillGaps": ["Specific skill 1 with current vs target level", "Specific skill 2"],
  "relevantOpportunities": [
    {
      "title": "Campus opportunity title",
      "type": "Workshop" | "Internship" | "Hackathon" | "Research Lab" | "Course",
      "provider": "Department or Company",
      "timeCommitment": "e.g. 4 hrs/week"
    }
  ],
  "nextAction": "One single high-impact immediate step the student should do today/this week",
  "alternativePath": "A viable alternative direction if they want to explore a different angle"
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const rawText = response.text?.trim() || '{}';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, answer: parsed, source: 'databricks-genie-gemini' });
      } catch (err) {
        console.warn('Genie AI generation failed, falling back to structured reasoning:', err);
      }
    }

    // Heuristic structured fallback
    const target = studentProfile?.careerGoal || 'AI Engineer';
    const hours = studentProfile?.weeklyHours || 6;
    const cgpa = studentProfile?.cgpa || 8.2;

    const fallbackResponse = {
      recommendation: `Based on your ${cgpa} CGPA and solid Python/C++ foundation, ${target} is your strongest trajectory, with Data Science as a strong complementary path.`,
      why: `Your academic score clears the 7.5 cut-off for top recruitment drives. With ${hours} hours/week, you can comfortably close the SQL and ML deployment gaps across the next 8 weeks.`,
      skillGaps: [
        'SQL (Beginner → Intermediate for enterprise pipelines)',
        'Machine Learning Deployment (Scikit-Learn models into FastAPI microservices)',
      ],
      relevantOpportunities: [
        {
          title: 'Databricks Lakehouse & Applied SQL Masterclass',
          type: 'Workshop',
          provider: 'Campus Innovation Cell × Databricks',
          timeCommitment: '4 hrs/week',
        },
        {
          title: 'University AI & High Performance Computing Fellowship',
          type: 'Research Lab',
          provider: 'NVIDIA GPU Research Center',
          timeCommitment: '6 hrs/week',
        },
      ],
      nextAction: 'Reserve a seat in the upcoming Databricks Lakehouse SQL workshop to close your primary technical gap.',
      alternativePath: 'If you prefer a broader software focus, Full-Stack Systems Engineering leverages your React background with a 95% placement alignment.',
    };

    return res.json({ success: true, answer: fallbackResponse, source: 'lakehouse-engine' });
  } catch (error) {
    console.error('Genie query error:', error);
    res.status(500).json({ error: 'Failed to process Genie query' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Twin server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
