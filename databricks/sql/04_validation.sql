-- 04_validation.sql
-- Database Data Integrity & Data Quality Validation Queries for Databricks

USE CATALOG campus_twin;
USE SCHEMA campus;

-- 1. Table record count checks
SELECT 'courses' AS dataset, COUNT(*) AS total_records FROM campus.courses
UNION ALL
SELECT 'clubs', COUNT(*) FROM campus.clubs
UNION ALL
SELECT 'events', COUNT(*) FROM campus.events
UNION ALL
SELECT 'research_projects', COUNT(*) FROM campus.research_projects
UNION ALL
SELECT 'opportunities', COUNT(*) FROM campus.opportunities
UNION ALL
SELECT 'facilities', COUNT(*) FROM campus.facilities
UNION ALL
SELECT 'skills', COUNT(*) FROM campus.skills
UNION ALL
SELECT 'city_events', COUNT(*) FROM campus.city_events
UNION ALL
SELECT 'relationships', COUNT(*) FROM campus.relationships;

-- 2. Validation check for courses without valid skill references
SELECT c.course_id, c.course_name, c.skills
FROM campus.courses c
WHERE c.skills IS NULL OR c.skills = '';

-- 3. Check weekly hours limits across research and courses
SELECT 'High Commitment Courses' AS check_type, course_id, course_name, hours_per_week
FROM campus.courses WHERE hours_per_week > 10
UNION ALL
SELECT 'High Commitment Research', research_id, title, hours_per_week
FROM campus.research_projects WHERE hours_per_week > 15;
