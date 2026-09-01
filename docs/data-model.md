# Campus Twin Data Model & Domain Schema

Campus Twin features 8 primary dataset domains connected via a graph edge table.

## 1. Primary Tables Summary
- `courses` (51 records): course_id, course_name, department, description, credits, difficulty, skills, prerequisites, hours_per_week, semester, level, faculty_id
- `clubs` (21 records): club_id, club_name, category, description, interests, skills, hours_per_week, meeting_day, meeting_time, membership_level, related_events
- `events` (50 records): event_id, event_name, event_type, description, date, duration_hours, location, organizer, skills, related_clubs, related_courses, registration_required
- `research_projects` (30 records): research_id, title, description, domain, faculty, department, skills, prerequisites, difficulty, hours_per_week, duration, lab, availability, related_courses
- `opportunities` (30 records): opportunity_id, title, type, organization, description, skills, eligibility, prerequisites, hours_per_week, duration, deadline, location, career_domains
- `facilities` (15 records): facility_id, name, type, description, location, available_hours, equipment, skills_supported, related_courses, related_clubs, related_research
- `skills` (50 records): skill_id, skill_name, category, description, beginner_description, intermediate_description, advanced_description
- `city_events` (30 records): city_event_id, name, type, description, date, location, skills, organization, distance_from_campus, registration_url

## 2. Graph Relationships Schema (`relationships`)
- `relationship_id`: Unique edge identifier (e.g. `REL_0001`)
- `source_type`: COURSE | CLUB | EVENT | RESEARCH | OPPORTUNITY
- `source_id`: Source entity ID (e.g. `AI101`)
- `relationship_type`: TEACHES | REQUIRES | DEVELOPS | ORGANIZES | LEADS_TO | HOSTED_AT | PREPARES_FOR | FOLLOWS_FROM
- `target_type`: SKILL | COURSE | CLUB | EVENT | FACILITY
- `target_id`: Target entity ID (e.g. `SKILL_01`)
- `weight`: Edge weight (0.0 to 1.0)
