# Databricks Genie Benchmark Questions

The following 14 benchmark questions are configured in Databricks Genie Space to evaluate text-to-SQL generation and relationship discovery accuracy:

1. **"What AI opportunities are available?"**
   - *Expected intent*: Query `courses`, `clubs`, `events`, `research_projects`, and `opportunities` filtered for AI / Machine Learning skills.

2. **"Which courses help me become an AI engineer?"**
   - *Expected intent*: Join `courses` with `skills` where skills include `Python`, `Machine Learning`, `Deep Learning`, or `Generative AI`.

3. **"I know Python. What should I learn next?"**
   - *Expected intent*: Identify prerequisite skill `Python` and return intermediate/advanced connected skills like `Machine Learning`, `FastAPI`, `Databricks Unity Catalog`, or `Deep Learning`.

4. **"I have 6 hours per week. What AI activities can I do?"**
   - *Expected intent*: Aggregate activities where sum of `hours_per_week` <= 6.

5. **"Which research projects are related to computer vision?"**
   - *Expected intent*: Filter `research_projects` where domain or skills include `Computer Vision`.

6. **"Which clubs help with machine learning?"**
   - *Expected intent*: Filter `clubs` where skills contain `Machine Learning` or `AI`.

7. **"Which events can help me build networking skills?"**
   - *Expected intent*: Filter `events` where event_type in (`Career Fair`, `Networking Event`, `Hackathon`) or skills include `Networking`.

8. **"Compare the AI Club and AI Research Project."**
   - *Expected intent*: Pull metrics for `CLUB_01` (AI Student Society) and `RES_01` (Autonomous Navigation Research) and contrast time, research vs networking value.

9. **"What opportunities lead toward an AI internship?"**
   - *Expected intent*: Find courses/projects that satisfy prerequisites for `OPP_01` (Databricks Summer AI Fellowship) or `OPP_02` (OpenAI Residency).

10. **"What if I replace the AI Club with research?"**
    - *Expected intent*: Calculate path modification replacing `CLUB_01` with `RES_01`, demonstrating trade-offs in research exposure vs networking.

11. **"What if I only have 4 hours per week?"**
    - *Expected intent*: Recalculate 6-hour path down to 4 hours while maximizing goal alignment score.

12. **"What if I want research instead of networking?"**
    - *Expected intent*: Re-weight scoring engine to prioritize research exposure (0.9 weight) over networking (0.2 weight).

13. **"What opportunities require Python?"**
    - *Expected intent*: Query opportunities and research projects where prerequisites or required skills contain `Python`.

14. **"What skills am I missing for this research project?"**
    - *Expected intent*: Perform skill gap analysis between student profile skills and research project required skills.
