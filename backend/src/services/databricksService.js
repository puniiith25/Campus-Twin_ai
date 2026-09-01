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
  }

  /**
   * Executes SQL on Databricks SQL Warehouse or falls back to local CSV querying if in mock mode.
   */
  async executeSql(sqlQuery) {
    if (config.MOCK_GENIE || !this.host || !this.token) {
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
   * Reads local synthetic CSV datasets for offline mock mode.
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
