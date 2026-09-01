# Campus Twin 3–5 Minute Hackathon Judge Demo Script

## Demo Strategy: The "Golden Scenario"

### Step 1: Landing Page Hook (0:00 - 0:45)
1. Open `http://localhost:3000`.
2. Present the tagline: *"Explore Your Campus. Discover Your Path."*
3. Highlight the problem: *"Campus opportunities exist across clubs, research, events, and courses, but students don't know how they connect into possible futures."*
4. Introduce the differentiator: *"Campus Twin uses Databricks Genie as the intelligence layer to query connected datasets and generate personalized candidate paths."*

### Step 2: Golden Scenario Goal Input (0:45 - 1:30)
1. Enter into the goal bar:
   > *"I want to become an AI engineer. I already know Python and I have 6 hours per week."*
2. Click **Explore My Path**.
3. Point out how Databricks Genie processes:
   - Goal: AI Engineer
   - Prerequisite skill: Python (Intermediate)
   - Constraint: 6 hours / week limit
4. Show the two generated paths:
   - **Path A — Career / Industry Focus**: AI Course → PyTorch Workshop → AI Club → Hackathon (6h/wk)
   - **Path B — Research / Academic Focus**: AI Course → PyTorch Workshop → Vision Research → Lab (6h/wk)

### Step 3: The "What-If" Wow Moment (1:30 - 3:00)
1. Click **Launch What-If Explorer** or click *"What if I replace this?"* on the AI Club node.
2. Run the query: *"What if I replace AI Club with research?"*
3. Watch the animated transformation:
   - AI Club component removed
   - Autonomous Navigation & Vision Research (`RES_01`) substituted
   - Recalculated total weekly commitment: Exact 6.0 hours/week (Fits limit)
   - Visual Diff: Research exposure increases +50% (from 40% to 90%), Faculty interaction increases +51% (from 45% to 96%), Peer networking rebalances to 65%.
4. Show the second What-If scenario:
   - Change slider: *"What if I only have 4 hours per week?"*
   - Path dynamically adapts down to 4 hours/week while maintaining 85% goal alignment.

### Step 4: Multi-Metric Path Comparison & Radar (3:00 - 4:00)
1. Navigate to **Compare** (`/compare`).
2. Show the Recharts Radar Chart comparing Path A vs Path B across 6 criteria.
3. Show the Explainable Recommendation Banner: *"Path B is recommended because it aligns with your preference for research while respecting your 6h time constraint."*

### Step 5: Databricks Technology Conclusion (4:00 - 4:30)
1. Show the Databricks Unity Catalog schema: `campus_twin.campus` with 8 Delta tables and 190 graph relationship edges.
2. Emphasize server-side credential protection and zero PII usage.
