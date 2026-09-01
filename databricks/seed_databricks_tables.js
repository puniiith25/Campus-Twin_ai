#!/usr/bin/env node
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
if (!process.env.DATABRICKS_HOST) {
  dotenv.config({ path: path.join(__dirname, "../backend/.env") });
}

const DATABRICKS_HOST = (process.env.DATABRICKS_HOST || "").replace(/\/+$/, "");
const DATABRICKS_TOKEN = process.env.DATABRICKS_TOKEN || "";
const WAREHOUSE_ID = process.env.DATABRICKS_WAREHOUSE_ID || "";
const DATA_DIR = path.resolve(__dirname, "../data");

if (!DATABRICKS_HOST || !DATABRICKS_TOKEN || !WAREHOUSE_ID) {
  console.error("❌ Missing DATABRICKS_HOST, DATABRICKS_TOKEN, or DATABRICKS_WAREHOUSE_ID in .env");
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${DATABRICKS_TOKEN}`,
  "Content-Type": "application/json",
};

async function executeSql(statement) {
  const url = `${DATABRICKS_HOST}/api/2.0/sql/statements`;
  const payload = {
    warehouse_id: WAREHOUSE_ID,
    statement,
    wait_timeout: "50s",
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  }

  const data = await resp.json();
  const state = data.status?.state;
  if (state === "FAILED") {
    throw new Error(`SQL FAILED: ${data.status?.error?.message}`);
  }
  return data;
}

function escapeSqlVal(val) {
  if (val === undefined || val === null || val === "") return "NULL";
  const cleaned = String(val).replace(/'/g, "''");
  return `'${cleaned}'`;
}

function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function seedTable(schemaPrefix, tableName, csvFilename) {
  const csvPath = path.join(DATA_DIR, csvFilename);
  if (!fs.existsSync(csvPath)) {
    console.log(`⚠️ Skipping ${tableName}: ${csvFilename} not found.`);
    return;
  }

  const fullTable = `${schemaPrefix}.${tableName}`;
  const rows = await readCsv(csvPath);
  if (rows.length === 0) return;

  const cols = Object.keys(rows[0]);
  console.log(`⏳ Seeding ${rows.length} records into ${fullTable}...`);

  // Truncate existing
  await executeSql(`TRUNCATE TABLE ${fullTable};`).catch(() => {});

  const chunkSize = 15;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const valueTuples = chunk.map(
      (r) => `(${cols.map((c) => escapeSqlVal(r[c])).join(", ")})`
    );
    const insertSql = `INSERT INTO ${fullTable} (${cols.join(", ")}) VALUES\n${valueTuples.join(",\n")};`;
    await executeSql(insertSql);
  }

  console.log(`✅ ${fullTable} successfully seeded!`);
}

async function main() {
  console.log("==================================================");
  console.log("   Campus Twin — Databricks Seeder (Node.js)");
  console.log("==================================================");
  console.log(`Host: ${DATABRICKS_HOST}`);
  console.log(`Warehouse ID: ${WAREHOUSE_ID}`);

  const SCHEMA_PREFIX = "campus_twin.campus";

  console.log("\n1. Ensuring catalog & schema exists...");
  await executeSql("CREATE CATALOG IF NOT EXISTS campus_twin;");
  await executeSql(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA_PREFIX};`);
  console.log("✅ Catalog & Schema validated.");

  const tables = [
    ["courses", "courses.csv"],
    ["clubs", "clubs.csv"],
    ["events", "events.csv"],
    ["research_projects", "research_projects.csv"],
    ["opportunities", "opportunities.csv"],
    ["facilities", "facilities.csv"],
    ["skills", "skills.csv"],
    ["faculty", "faculty.csv"],
  ];

  for (const [tName, cFile] of tables) {
    await seedTable(SCHEMA_PREFIX, tName, cFile);
  }

  console.log("\n🎉 All Databricks tables seeded successfully!");
}

main().catch((err) => {
  console.error("❌ Seeder Error:", err.message);
  process.exit(1);
});
