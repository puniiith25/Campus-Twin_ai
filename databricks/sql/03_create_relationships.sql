-- 03_create_relationships.sql
-- Relationship Graph DDL for Databricks Unity Catalog

USE CATALOG campus_twin;
USE SCHEMA campus;

CREATE TABLE IF NOT EXISTS campus.relationships (
  relationship_id STRING NOT NULL,
  source_type STRING NOT NULL,
  source_id STRING NOT NULL,
  relationship_type STRING NOT NULL,
  target_type STRING NOT NULL,
  target_id STRING NOT NULL,
  weight DOUBLE
) USING DELTA
COMMENT 'Interconnected graph edges connecting courses, clubs, events, research, and skills.';
