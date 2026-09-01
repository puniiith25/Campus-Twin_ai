-- 01_create_schema.sql
-- Create Catalog and Schema for Campus Twin on Databricks Unity Catalog

CREATE CATALOG IF NOT EXISTS campus_twin;
USE CATALOG campus_twin;

CREATE SCHEMA IF NOT EXISTS campus
COMMENT 'Campus Twin unified campus dataset schema for courses, clubs, research, events, and opportunities.';

USE SCHEMA campus;
