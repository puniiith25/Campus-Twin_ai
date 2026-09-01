import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";
import { config } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabricksService {
  constructor() {
    this.host = config.DATABRICKS_HOST;
    this.token = config.DATABRICKS_TOKEN;
    this.warehouseId = config.DATABRICKS_WAREHOUSE_ID;
    this.dataDir = path.resolve(__dirname, "../../../data");
    this.schemaPrefix = "campus_twin.campus";
    this.tableCache = new Map();
  }

  /**
   * Executes SQL on Databricks SQL Warehouse or falls back to local CSV querying if offline/mock.
   */
  async executeSql(sqlQuery) {
    if (config.MOCK_GENIE || !this.host || !this.token || !this.warehouseId) {
      return this._queryLocalCsv(sqlQuery);
    }

    const url = `${this.host}/api/2.0/sql/statements`;
    const payload = {
      warehouse_id: this.warehouseId,
      statement: sqlQuery,
      wait_timeout: "30s",
    };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      const manifest = data.manifest?.schema?.columns || [];
      const cols = manifest.map((c) => c.name);
      const dataArray = data.result?.data_array || [];

      return dataArray.map((row) => {
        const obj = {};
        cols.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
    } catch (err) {
      console.warn("Databricks SQL execution fallback to local CSVs:", err.message);
      return this._queryLocalCsv(sqlQuery);
    }
  }

  /**
   * Stores a student profile into Databricks tables (and in-memory / local fallback).
   */
  async storeStudentProfile(profile) {
    const studentId = profile.user_id || profile.student_id || "usr_demo_01";
    const name = (profile.preferredName || profile.name || "Student").replace(/'/g, "''");
    const dept = (profile.fieldOfStudy || profile.department || "Computer Science").replace(/'/g, "''");
    const year = parseInt(profile.year) || 3;
    const sem = parseInt(profile.semester) || 5;
    const cgpa = parseFloat(profile.cgpa || 8.2);
    const weeklyHours = parseFloat(profile.weeklyAvailableHours || profile.weeklyHours || 6.0);
    const careerGoal = (Array.isArray(profile.careerGoals) ? profile.careerGoals[0] : profile.goal || profile.careerGoal || "AI Engineer").replace(/'/g, "''");
    const skillsJson = JSON.stringify(profile.skills || []).replace(/'/g, "''");
    const interestsJson = JSON.stringify(profile.interests || []).replace(/'/g, "''");
    const now = new Date().toISOString();

    const insertSql = `
      MERGE INTO ${this.schemaPrefix}.student_profiles AS target
      USING (SELECT '${studentId}' AS student_id) AS source
      ON target.student_id = source.student_id
      WHEN MATCHED THEN
        UPDATE SET 
          name = '${name}',
          department = '${dept}',
          year = ${year},
          semester = ${sem},
          cgpa = ${cgpa},
          weekly_hours = ${weeklyHours},
          career_goal = '${careerGoal}',
          skills_json = '${skillsJson}',
          interests_json = '${interestsJson}',
          updated_at = '${now}'
      WHEN NOT MATCHED THEN
        INSERT (student_id, name, department, year, semester, cgpa, weekly_hours, career_goal, skills_json, interests_json, created_at, updated_at)
        VALUES ('${studentId}', '${name}', '${dept}', ${year}, ${sem}, ${cgpa}, ${weeklyHours}, '${careerGoal}', '${skillsJson}', '${interestsJson}', '${now}', '${now}');
    `;

    try {
      if (this.host && this.token && this.warehouseId && !config.MOCK_GENIE) {
        await this.executeSql(insertSql);
      }
    } catch (e) {
      console.warn("Could not persist student profile directly to Databricks SQL:", e.message);
    }

    return { success: true, student_id: studentId };
  }

  /**
   * Logs a student interaction or What-If simulation into Databricks Lakehouse.
   */
  async logStudentAction(studentId, actionType, actionPayload) {
    const payloadEscaped = JSON.stringify(actionPayload || {}).replace(/'/g, "''");
    const now = new Date().toISOString();
    const insertLogSql = `
      INSERT INTO ${this.schemaPrefix}.student_activity_logs (student_id, action_type, payload, created_at)
      VALUES ('${studentId}', '${actionType}', '${payloadEscaped}', '${now}');
    `;

    try {
      if (this.host && this.token && this.warehouseId && !config.MOCK_GENIE) {
        await this.executeSql(insertLogSql);
      }
    } catch (e) {
      // Non-blocking log write
    }
  }

  /**
   * Reads local CSV datasets for offline mock mode.
   */
  async _queryLocalCsv(queryHint) {
    let tableName = "courses";
    const qLower = (queryHint || "").toLowerCase();

    if (qLower.includes("clubs")) {
      tableName = "clubs";
    } else if (qLower.includes("events") || qLower.includes("city_events")) {
      tableName = "events";
    } else if (qLower.includes("research")) {
      tableName = "research_projects";
    } else if (qLower.includes("opportunities")) {
      tableName = "opportunities";
    } else if (qLower.includes("facilities")) {
      tableName = "facilities";
    } else if (qLower.includes("skills")) {
      tableName = "skills";
    } else if (qLower.includes("faculty")) {
      tableName = "faculty";
    }

    const filePath = path.join(this.dataDir, `${tableName}.csv`);
    if (!fs.existsSync(filePath)) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
  }
}

export const databricksService = new DatabricksService();
