# Databricks Genie Space Configuration Guide

## Table Inclusion Checklist
Ensure the following tables in catalog `campus_twin` and schema `campus` are added to your Databricks Genie Space:

- [x] `campus.courses`
- [x] `campus.clubs`
- [x] `campus.events`
- [x] `campus.research_projects`
- [x] `campus.opportunities`
- [x] `campus.facilities`
- [x] `campus.skills`
- [x] `campus.city_events`
- [x] `campus.relationships`

## Key Table Relationships to Describe in Genie Metadata
- `courses.course_id` -> `relationships.source_id` (source_type = 'COURSE')
- `skills.skill_id` -> `relationships.target_id` (target_type = 'SKILL')
- `research_projects.lab` -> `facilities.facility_id`
- `clubs.club_id` -> `events.related_clubs`

## Sample SQL Expressions for Custom Instructions
```sql
-- Weekly commitment aggregation query template
SELECT source_type, title, hours_per_week, skills 
FROM (
  SELECT 'COURSE' AS source_type, course_name AS title, hours_per_week, skills FROM campus.courses
  UNION ALL
  SELECT 'RESEARCH' AS source_type, title, hours_per_week, skills FROM campus.research_projects
  UNION ALL
  SELECT 'CLUB' AS source_type, club_name AS title, hours_per_week, skills FROM campus.clubs
)
WHERE hours_per_week <= :time_limit;
```
