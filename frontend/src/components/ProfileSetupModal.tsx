/**
 * Campus Twin - Profile Setup Modal
 * Multi-step guided progressive setup or Natural Language AI extraction with confirmation review.
 */

import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Sparkles,
  MessageSquareText,
  User,
  GraduationCap,
  Wrench,
  Heart,
  Briefcase,
  Target,
  Clock,
} from 'lucide-react';
import { StudentProfile, StudentSkill, SkillProficiency } from '../types';
import { SKILLS_CATALOG, INTERESTS_CATALOG } from '../data/campusIntelligenceData';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileBuilt: (profile: StudentProfile) => void;
  initialPrompt?: string;
}

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business & Data Analytics',
  'Design & Human-Computer Interaction',
  'Other / Interdisciplinary',
];

const CAREER_TARGET_OPTIONS = [
  'AI Engineer',
  'Data Scientist',
  'Full-Stack Software Engineer',
  'Cloud & DevOps Engineer',
  'AI Research Scientist / Fellow',
  'Associate Product Manager (APM)',
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onClose,
  onProfileBuilt,
  initialPrompt,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'guided' | 'natural'>(initialPrompt ? 'natural' : 'guided');
  const [currentStep, setCurrentStep] = useState(1);

  // Profile Form State
  const [name, setName] = useState('Ananya Rao');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(4);
  const [cgpa, setCgpa] = useState<number>(8.2);
  const [sgpa, setSgpa] = useState<number>(8.4);
  const [academicStrengths, setAcademicStrengths] = useState<string[]>([
    'Data Structures & Algorithms',
    'Database Systems',
  ]);

  const [skills, setSkills] = useState<StudentSkill[]>([
    { name: 'Python', level: 'Intermediate' },
    { name: 'C++', level: 'Intermediate' },
    { name: 'SQL', level: 'Beginner' },
    { name: 'React', level: 'Intermediate' },
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [interests, setInterests] = useState<string[]>([
    'Artificial Intelligence',
    'Data Science',
    'Academic Research',
  ]);
  const [customInterestInput, setCustomInterestInput] = useState('');

  // Experience (optional)
  const [projects, setProjects] = useState<{ title: string; tech: string; description: string }[]>([
    {
      title: 'Student Academic Performance Predictor',
      tech: 'Python, Scikit-Learn, Streamlit',
      description: 'Regression model predicting marks based on study hours and previous trends.',
    },
  ]);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const [hackathons, setHackathons] = useState<string[]>(['Smart Campus Hackathon 2025']);
  const [newHackathonInput, setNewHackathonInput] = useState('');

  const [internships, setInternships] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([
    'DeepLearning.AI: Neural Networks and Deep Learning',
  ]);

  // Goal & Time
  const [targetType, setTargetType] = useState<'specific' | 'exploring'>('specific');
  const [careerGoal, setCareerGoal] = useState('AI Engineer');
  const [weeklyHours, setWeeklyHours] = useState<number>(6);

  // Natural mode state
  const [naturalText, setNaturalText] = useState(initialPrompt || '');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedReview, setExtractedReview] = useState<any | null>(null);

  const steps = [
    { num: 1, label: 'About You', icon: User },
    { num: 2, label: 'Academics', icon: GraduationCap },
    { num: 3, label: 'Skills', icon: Wrench },
    { num: 4, label: 'Interests', icon: Heart },
    { num: 5, label: 'Experience', icon: Briefcase },
    { num: 6, label: 'Career Goal', icon: Target },
    { num: 7, label: 'Time', icon: Clock },
  ];

  // Helper for skill toggle
  const toggleSkill = (skillName: string) => {
    const existing = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (existing) {
      setSkills(skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setSkills([...skills, { name: skillName, level: 'Intermediate' }]);
    }
  };

  const updateSkillLevel = (skillName: string, level: SkillProficiency) => {
    setSkills(
      skills.map((s) => (s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s))
    );
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim()) {
      if (!skills.some((s) => s.name.toLowerCase() === customSkillInput.trim().toLowerCase())) {
        setSkills([...skills, { name: customSkillInput.trim(), level: 'Intermediate' }]);
      }
      setCustomSkillInput('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (customInterestInput.trim()) {
      if (!interests.includes(customInterestInput.trim())) {
        setInterests([...interests, customInterestInput.trim()]);
      }
      setCustomInterestInput('');
    }
  };

  const addProject = () => {
    if (newProjTitle.trim()) {
      setProjects([
        ...projects,
        {
          title: newProjTitle.trim(),
          tech: newProjTech.trim() || 'Python, React',
          description: newProjDesc.trim() || 'Custom academic/hackathon project.',
        },
      ]);
      setNewProjTitle('');
      setNewProjTech('');
      setNewProjDesc('');
    }
  };

  const handleExtractFromNatural = async () => {
    if (!naturalText.trim()) return;
    setIsExtracting(true);
    try {
      const res = await fetch('/api/profile/extract-natural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: naturalText }),
      });
      const data = await res.json();
      if (data.success && data.extracted) {
        setExtractedReview(data.extracted);
        // Pre-fill fields
        if (data.extracted.name && data.extracted.name !== 'Student') setName(data.extracted.name);
        if (data.extracted.department) setDepartment(data.extracted.department);
        if (data.extracted.semester) setSemester(data.extracted.semester);
        if (data.extracted.cgpa) setCgpa(data.extracted.cgpa);
        if (data.extracted.skills && Array.isArray(data.extracted.skills)) setSkills(data.extracted.skills);
        if (data.extracted.interests && Array.isArray(data.extracted.interests)) setInterests(data.extracted.interests);
        if (data.extracted.careerGoal) setCareerGoal(data.extracted.careerGoal);
        if (data.extracted.weeklyHours) setWeeklyHours(data.extracted.weeklyHours);
      }
    } catch (e) {
      console.warn('Extraction failed, using fallback review', e);
      setExtractedReview({
        name: 'Student',
        department: 'Computer Science & Engineering',
        semester: 4,
        cgpa: 8.2,
        skills: [{ name: 'Python', level: 'Intermediate' }, { name: 'C++', level: 'Intermediate' }],
        interests: ['Artificial Intelligence'],
        projectsCount: 2,
        careerGoal: 'AI Engineer',
        weeklyHours: 6,
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFinalBuild = () => {
    const finalProfile: StudentProfile = {
      id: `student_${Date.now()}`,
      name: name || 'Student',
      department,
      semester,
      year: Math.ceil(semester / 2),
      cgpa: Number(cgpa) || 8.0,
      sgpa: Number(sgpa) || Number(cgpa) || 8.0,
      academicStrengths,
      skills: skills.length > 0 ? skills : [{ name: 'Python', level: 'Intermediate' }],
      interests: interests.length > 0 ? interests : ['Artificial Intelligence', 'Software Development'],
      projects: projects.map((p, idx) => ({
        id: `p_${idx}`,
        title: p.title,
        description: p.description,
        tech: p.tech.split(',').map((t) => t.trim()),
      })),
      internships: internships.map((i, idx) => ({
        id: `i_${idx}`,
        role: i,
        company: 'Campus Partner',
        duration: '2 months',
        domain: 'Engineering',
      })),
      hackathons: hackathons.map((h, idx) => ({
        id: `h_${idx}`,
        name: h,
        project: 'Campus Prototype',
      })),
      certifications,
      researchExperience: [],
      clubs: ['Campus Tech Community'],
      careerGoal: targetType === 'exploring' ? 'AI Engineer' : careerGoal,
      targetType,
      targetRoles: targetType === 'exploring' ? ['AI Engineer', 'Data Scientist', 'Full-Stack Software Engineer'] : [careerGoal],
      weeklyHours: Number(weeklyHours) || 6,
      primaryFocus: 'career',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onProfileBuilt(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F33]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#EEF3F2] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Mode Toggle */}
        <div className="bg-[#0B1F33] text-white px-6 py-4 flex items-center justify-between border-b border-[#102A43]">
          <div>
            <h2 className="font-display font-bold text-lg text-white">
              Create Your Campus Career Twin
            </h2>
            <p className="text-xs text-[#7B8794]">
              {mode === 'guided'
                ? `Step ${currentStep} of ${steps.length}: ${steps[currentStep - 1].label}`
                : 'Natural Language Profile Parser'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setMode(mode === 'guided' ? 'natural' : 'guided');
                setExtractedReview(null);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#163859] text-[#167C80] border border-[#167C80]/30 font-medium transition-colors"
            >
              {mode === 'guided' ? 'Switch to Natural Chat' : 'Switch to Step-by-Step'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#7B8794] hover:text-white hover:bg-[#102A43] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guided Progress Indicator */}
        {mode === 'guided' && (
          <div className="bg-[#EEF3F2] px-6 py-2.5 border-b border-[#D1D9E0]/60 flex items-center justify-between overflow-x-auto no-scrollbar">
            {steps.map((s) => {
              const isDone = s.num < currentStep;
              const isCurrent = s.num === currentStep;
              return (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`flex items-center space-x-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#167C80] text-white shadow-2xs'
                      : isDone
                      ? 'text-[#1F8A70] hover:bg-white/60'
                      : 'text-[#7B8794] hover:text-[#0B1F33]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
                    {isDone ? '✓' : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-[#17212B]">
          {/* NATURAL LANGUAGE EXTRACTOR MODE */}
          {mode === 'natural' && (
            <div className="space-y-6">
              {!extractedReview ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#EEF3F2] border border-[#167C80]/20">
                    <h3 className="text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#167C80]" />
                      <span>Tell Campus Twin About Yourself</span>
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Describe your major, semester, CGPA, technical skills, projects, and target careers in your own words.
                    </p>
                  </div>

                  <textarea
                    rows={5}
                    value={naturalText}
                    onChange={(e) => setNaturalText(e.target.value)}
                    placeholder="e.g. I am a 4th semester Computer Science student with an 8.2 CGPA. I have intermediate knowledge in Python and C++, beginner SQL, and I've built a machine learning student performance predictor. I want to become an AI Engineer and have about 6 hours a week to learn."
                    className="w-full p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-sm text-[#17212B] placeholder-[#7B8794] focus:outline-none focus:ring-2 focus:ring-[#167C80]/30 focus:border-[#167C80]"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleExtractFromNatural}
                      disabled={isExtracting || !naturalText.trim()}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                    >
                      {isExtracting ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Extracting Profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Extract & Review Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Here's what I understood confirmation card */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#EEF3F2] border border-[#1F8A70]/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-sm text-[#0B1F33] flex items-center space-x-2">
                        <Check className="w-4 h-4 text-[#1F8A70]" />
                        <span>Here's what I understood:</span>
                      </h3>
                      <button
                        onClick={() => setExtractedReview(null)}
                        className="text-xs text-[#167C80] font-semibold hover:underline"
                      >
                        Re-type text
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-[#D1D9E0]/60">
                        <div className="text-[10px] text-[#7B8794]">Department</div>
                        <div className="font-semibold text-[#0B1F33] truncate">{department}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#D1D9E0]/60">
                        <div className="text-[10px] text-[#7B8794]">Semester & CGPA</div>
                        <div className="font-semibold text-[#0B1F33]">
                          Sem {semester} · {cgpa} CGPA
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#D1D9E0]/60">
                        <div className="text-[10px] text-[#7B8794]">Target Goal</div>
                        <div className="font-semibold text-[#167C80] truncate">{careerGoal}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#D1D9E0]/60 col-span-2">
                        <div className="text-[10px] text-[#7B8794]">Extracted Skills</div>
                        <div className="font-semibold text-[#0B1F33] truncate">
                          {skills.map((s) => `${s.name} (${s.level})`).join(', ')}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#D1D9E0]/60">
                        <div className="text-[10px] text-[#7B8794]">Availability</div>
                        <div className="font-semibold text-[#0B1F33]">{weeklyHours} hrs/week</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#52606D]">
                    Does this look right? You can make granular edits below or immediately build your Career Twin.
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setMode('guided')}
                      className="px-4 py-2 rounded-xl bg-white border border-[#D1D9E0] text-xs font-semibold text-[#0B1F33] hover:bg-[#F8FAF9]"
                    >
                      Fine-Tune In Guided Mode
                    </button>
                    <button
                      onClick={handleFinalBuild}
                      className="px-6 py-2.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                    >
                      <span>Build My Career Twin</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP-BY-STEP GUIDED MODE */}
          {mode === 'guided' && (
            <div>
              {/* STEP 1: ABOUT YOU */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      Let's start with the basics.
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Tell us who you are and what you are studying.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ananya Rao"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#167C80]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Course / Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#167C80]/30"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Current Semester
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <button
                            key={sem}
                            type="button"
                            onClick={() => setSemester(sem)}
                            className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                              semester === sem
                                ? 'bg-[#167C80] text-white border-[#167C80]'
                                : 'bg-[#F8FAF9] text-[#0B1F33] border-[#D1D9E0] hover:bg-[#EEF3F2]'
                            }`}
                          >
                            Sem {sem}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ACADEMICS */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      How are you doing academically?
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Campus placement cut-offs and research lab fellowships derive eligibility from your GPA.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Cumulative CGPA (0.0 – 10.0)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="10"
                        value={cgpa}
                        onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#167C80]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Latest SGPA (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="10"
                        value={sgpa}
                        onChange={(e) => setSgpa(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#167C80]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
                      Academic Strengths
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Data Structures & Algorithms',
                        'Discrete Mathematics',
                        'Database Systems',
                        'Operating Systems',
                        'Computer Networks',
                        'Statistics',
                        'Electronics',
                        'System Design',
                      ].map((strength) => {
                        const isSelected = academicStrengths.includes(strength);
                        return (
                          <button
                            key={strength}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setAcademicStrengths(academicStrengths.filter((s) => s !== strength));
                              } else {
                                setAcademicStrengths([...academicStrengths, strength]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              isSelected
                                ? 'bg-[#102A43] text-white border-[#102A43]'
                                : 'bg-[#F8FAF9] text-[#52606D] border-[#D1D9E0] hover:bg-[#EEF3F2]'
                            }`}
                          >
                            {strength}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SKILLS */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      What can you already do?
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Select your skills and set your current proficiency level.
                    </p>
                  </div>

                  {/* Skill Chips Catalog */}
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-[#EEF3F2] rounded-xl">
                    {SKILLS_CATALOG.map((skillName) => {
                      const selectedSkill = skills.find(
                        (s) => s.name.toLowerCase() === skillName.toLowerCase()
                      );
                      const isSelected = Boolean(selectedSkill);
                      return (
                        <button
                          key={skillName}
                          type="button"
                          onClick={() => toggleSkill(skillName)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all flex items-center space-x-1 ${
                            isSelected
                              ? 'bg-[#167C80] text-white border-[#167C80]'
                              : 'bg-[#F8FAF9] text-[#52606D] border-[#D1D9E0] hover:bg-[#EEF3F2]'
                          }`}
                        >
                          <span>{skillName}</span>
                          {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Skill Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder="Add custom skill (e.g. PyTorch, Rust, Solidity)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#F8FAF9] border border-[#D1D9E0] text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    />
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1F33] text-white text-xs font-medium"
                    >
                      Add
                    </button>
                  </div>

                  {/* Selected Skills with Proficiency Sliders */}
                  <div className="space-y-2 mt-3">
                    <label className="block text-xs font-semibold text-[#0B1F33]">
                      Your Selected Skills & Proficiency ({skills.length})
                    </label>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAF9] border border-[#EEF3F2] text-xs"
                        >
                          <span className="font-medium text-[#0B1F33]">{skill.name}</span>
                          <div className="flex items-center space-x-1">
                            {(['Beginner', 'Intermediate', 'Advanced'] as SkillProficiency[]).map(
                              (lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => updateSkillLevel(skill.name, lvl)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                                    skill.level === lvl
                                      ? 'bg-[#167C80] text-white'
                                      : 'bg-[#EEF3F2] text-[#52606D] hover:bg-[#D1D9E0]'
                                  }`}
                                >
                                  {lvl}
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              onClick={() => toggleSkill(skill.name)}
                              className="p-1 text-[#7B8794] hover:text-[#C53030]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: INTERESTS */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      What are you curious about?
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Interests help Campus Twin discover paths and research labs you'll actually enjoy.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {INTERESTS_CATALOG.map((interest) => {
                      const isSelected = interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-[#1F8A70] text-white border-[#1F8A70]'
                              : 'bg-[#F8FAF9] text-[#52606D] border-[#D1D9E0] hover:bg-[#EEF3F2]'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      value={customInterestInput}
                      onChange={(e) => setCustomInterestInput(e.target.value)}
                      placeholder="Add custom interest (e.g. Autonomous Driving, Bio-informatics)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                    />
                    <button
                      type="button"
                      onClick={addCustomInterest}
                      className="px-4 py-2 rounded-xl bg-[#0B1F33] text-white text-xs font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: EXPERIENCE */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      What have you already explored?
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Optional sections. You can skip everything if you are just getting started!
                    </p>
                  </div>

                  {/* Projects List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#0B1F33]">
                        Projects ({projects.length})
                      </label>
                    </div>

                    {projects.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0]/70 text-xs relative"
                      >
                        <button
                          type="button"
                          onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 text-[#7B8794] hover:text-[#C53030]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="font-semibold text-[#0B1F33]">{p.title}</div>
                        <div className="text-[11px] text-[#167C80] font-medium">{p.tech}</div>
                        <div className="text-[#52606D] text-[11px] mt-0.5">{p.description}</div>
                      </div>
                    ))}

                    <div className="p-3 rounded-xl bg-[#EEF3F2] border border-[#D1D9E0] space-y-2">
                      <div className="text-[11px] font-semibold text-[#0B1F33]">Add a project:</div>
                      <input
                        type="text"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="Project title (e.g. AI Resume Screener)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D9E0] text-xs"
                      />
                      <input
                        type="text"
                        value={newProjTech}
                        onChange={(e) => setNewProjTech(e.target.value)}
                        placeholder="Tech stack (e.g. Python, FastAPI, React)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D9E0] text-xs"
                      />
                      <button
                        type="button"
                        onClick={addProject}
                        disabled={!newProjTitle.trim()}
                        className="px-3 py-1 rounded-lg bg-[#167C80] text-white text-xs font-medium disabled:opacity-50"
                      >
                        Add Project
                      </button>
                    </div>
                  </div>

                  {/* Hackathons chip input */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                      Hackathons & Competitions
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {hackathons.map((h, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#EEF3F2] text-[#0B1F33] text-xs font-medium"
                        >
                          <span>{h}</span>
                          <button
                            type="button"
                            onClick={() => setHackathons(hackathons.filter((_, i) => i !== idx))}
                            className="ml-1.5 text-[#7B8794] hover:text-[#C53030]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newHackathonInput}
                        onChange={(e) => setNewHackathonInput(e.target.value)}
                        placeholder="e.g. Smart India Hackathon, MLH Global"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#F8FAF9] border border-[#D1D9E0] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newHackathonInput.trim()) {
                            setHackathons([...hackathons, newHackathonInput.trim()]);
                            setNewHackathonInput('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0B1F33] text-white text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: GOALS */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      Where would you like to go?
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Select a specific career ambition or let Campus Twin discover pathways for you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTargetType('specific')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        targetType === 'specific'
                          ? 'bg-[#EEF3F2] border-[#167C80] ring-1 ring-[#167C80]'
                          : 'bg-white border-[#D1D9E0] hover:bg-[#F8FAF9]'
                      }`}
                    >
                      <div className="font-semibold text-sm text-[#0B1F33] mb-1">
                        I know my target
                      </div>
                      <p className="text-xs text-[#52606D]">
                        Target specific industry roles like AI Engineer, Data Scientist, or SDE.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('exploring')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        targetType === 'exploring'
                          ? 'bg-[#EEF3F2] border-[#167C80] ring-1 ring-[#167C80]'
                          : 'bg-white border-[#D1D9E0] hover:bg-[#F8FAF9]'
                      }`}
                    >
                      <div className="font-semibold text-sm text-[#0B1F33] mb-1">
                        I'm not sure yet
                      </div>
                      <p className="text-xs text-[#52606D]">
                        Let Campus Twin calculate directions matching your skills and curiosity.
                      </p>
                    </button>
                  </div>

                  {targetType === 'specific' && (
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-semibold text-[#0B1F33]">
                        Select Primary Target Role
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CAREER_TARGET_OPTIONS.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setCareerGoal(role)}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                              careerGoal === role
                                ? 'bg-[#167C80] text-white border-[#167C80]'
                                : 'bg-[#F8FAF9] text-[#0B1F33] border-[#D1D9E0] hover:bg-[#EEF3F2]'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: TIME */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B1F33]">
                      How much time can you realistically invest each week?
                    </h3>
                    <p className="text-xs text-[#52606D]">
                      Recommendations and roadmaps must be feasible and effort-compatible with your schedule.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[2, 4, 6, 8, 10].map((hrs) => (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setWeeklyHours(hrs)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          weeklyHours === hrs
                            ? 'bg-[#167C80] text-white border-[#167C80] shadow-xs'
                            : 'bg-[#F8FAF9] text-[#0B1F33] border-[#D1D9E0] hover:bg-[#EEF3F2]'
                        }`}
                      >
                        <div className="text-xl font-bold font-display">{hrs} hrs</div>
                        <div className="text-[11px] opacity-80 mt-0.5">per week</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#EEF3F2] border border-[#D1D9E0] text-xs text-[#52606D]">
                    <div className="font-semibold text-[#0B1F33] mb-0.5">Why weekly time matters:</div>
                    Campus Twin configures your roadmap pacing so you never feel overwhelmed during midterms or assignment deadlines.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        {mode === 'guided' && (
          <div className="bg-[#F8FAF9] px-6 py-4 border-t border-[#EEF3F2] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#52606D] hover:text-[#0B1F33] disabled:opacity-40 disabled:hover:text-[#52606D]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-semibold shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinalBuild}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-bold shadow-sm"
              >
                <span>Build My Career Twin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
