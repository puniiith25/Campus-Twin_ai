import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  PROJECT_NAME: "Campus Twin Backend (Express)",
  VERSION: "1.0.0",
  PORT: process.env.PORT || 8000,
  ENVIRONMENT: process.env.ENVIRONMENT || "development",
  MOCK_GENIE: (process.env.MOCK_GENIE || "true").toLowerCase() === "true",

  DATABRICKS_HOST: (process.env.DATABRICKS_HOST || "").replace(/\/+$/, ""),
  DATABRICKS_TOKEN: process.env.DATABRICKS_TOKEN || "",
  DATABRICKS_WAREHOUSE_ID: process.env.DATABRICKS_WAREHOUSE_ID || "",
  GENIE_SPACE_ID: process.env.GENIE_SPACE_ID || "",
  GENIE_AGENT_ID: process.env.GENIE_AGENT_ID || "",

  CORS_ORIGINS: (process.env.CORS_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
};
