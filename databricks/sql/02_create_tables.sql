-- 02_create_tables.sql
-- DDL for Campus Twin Delta Tables in Unity Catalog

USE CATALOG campus_twin;
USE SCHEMA campus;

-- 1. COURSES
CREATE TABLE IF NOT EXISTS campus.courses (
  course_id STRING NOT NULL,
  course_name STRING NOT NULL,
  department STRING,
  description STRING,
  credits INT,
  difficulty STRING,
  skills STRING,
  prerequisites STRING,
  hours_per_week INT,
  semester STRING,
  level STRING,
  faculty_id STRING
) USING DELTA
COMMENT 'Academic course offerings with prerequisites and weekly commitments';

-- 2. CLUBS
CREATE TABLE IF NOT EXISTS campus.clubs (
  club_id STRING NOT NULL,
  club_name STRING NOT NULL,
  category STRING,
  description STRING,
  interests STRING,
  skills STRING,
  hours_per_week INT,
  meeting_day STRING,
  meeting_time STRING,
  membership_level STRING,
  related_events STRING
) USING DELTA
COMMENT 'Student clubs and extracurricular organizations';

-- 3. EVENTS
CREATE TABLE IF NOT EXISTS campus.events (
  event_id STRING NOT NULL,
  event_name STRING NOT NULL,
  event_type STRING,
  description STRING,
  date STRING,
  duration_hours INT,
  location STRING,
  organizer STRING,
  skills STRING,
  related_clubs STRING,
  related_courses STRING,
  registration_required STRING
) USING DELTA
COMMENT 'Campus events, workshops, hackathons, and conferences';

-- 4. RESEARCH PROJECTS
CREATE TABLE IF NOT EXISTS campus.research_projects (
  research_id STRING NOT NULL,
  title STRING NOT NULL,
  description STRING,
  domain STRING,
  faculty STRING,
  department STRING,
  skills STRING,
  prerequisites STRING,
  difficulty STRING,
  hours_per_week INT,
  duration STRING,
  lab STRING,
  availability STRING,
  related_courses STRING
) USING DELTA
COMMENT 'Faculty-led research positions and lab opportunities';

-- 5. OPPORTUNITIES
CREATE TABLE IF NOT EXISTS campus.opportunities (
  opportunity_id STRING NOT NULL,
  title STRING NOT NULL,
  type STRING,
  organization STRING,
  description STRING,
  skills STRING,
  eligibility STRING,
  prerequisites STRING,
  hours_per_week INT,
  duration STRING,
  deadline STRING,
  location STRING,
  career_domains STRING
) USING DELTA
COMMENT 'Internships, fellowships, grants, and external competitions';

-- 6. FACILITIES
CREATE TABLE IF NOT EXISTS campus.facilities (
  facility_id STRING NOT NULL,
  name STRING NOT NULL,
  type STRING,
  description STRING,
  location STRING,
  available_hours STRING,
  equipment STRING,
  skills_supported STRING,
  related_courses STRING,
  related_clubs STRING,
  related_research STRING
) USING DELTA
COMMENT 'Labs, makerspaces, libraries, and specialized campus facilities';

-- 7. SKILLS
CREATE TABLE IF NOT EXISTS campus.skills (
  skill_id STRING NOT NULL,
  skill_name STRING NOT NULL,
  category STRING,
  description STRING,
  beginner_description STRING,
  intermediate_description STRING,
  advanced_description STRING
) USING DELTA
COMMENT 'Canonical skill taxonomy and descriptions';

-- 8. CITY EVENTS
CREATE TABLE IF NOT EXISTS campus.city_events (
  city_event_id STRING NOT NULL,
  name STRING NOT NULL,
  type STRING,
  description STRING,
  date STRING,
  location STRING,
  skills STRING,
  organization STRING,
  distance_from_campus DOUBLE,
  registration_url STRING
) USING DELTA
COMMENT 'Off-campus tech events, meetups, and local innovation showcases';
