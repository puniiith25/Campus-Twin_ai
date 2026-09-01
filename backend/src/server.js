import express from "express";
import cors from "cors";
import { config } from "./config.js";

// Routes
import chatRouter from "./routes/chat.js";
import pathsRouter from "./routes/paths.js";
import whatIfRouter from "./routes/whatIf.js";
import compareRouter from "./routes/compare.js";
import opportunitiesRouter from "./routes/opportunities.js";
import profileRouter from "./routes/profile.js";
import authRouter from "./routes/auth.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, tests) or matching origins
      if (!origin || config.CORS_ORIGINS.includes(origin) || config.ENVIRONMENT === "development") {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Mount API Routers
app.use("/api/chat", chatRouter);
app.use("/api/genie", chatRouter);
app.use("/api/path", pathsRouter);
app.use("/api/what-if", whatIfRouter);
app.use("/api/compare", compareRouter);
app.use("/api/opportunities", opportunitiesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);

// Databricks Lakehouse status
app.get("/api/databricks/status", (req, res) => {
  const isDatabricksConfigured = Boolean(config.DATABRICKS_HOST && config.DATABRICKS_TOKEN);
  res.json({
    connected: isDatabricksConfigured,
    catalog: "campus_twin",
    schema: "campus",
    mode: isDatabricksConfigured ? "Connected to Databricks" : "Synthetic Open Data Mode",
    syncedTables: [
      { name: "courses", rows: 51, lastSync: "2026-09-01 12:00 UTC" },
      { name: "clubs", rows: 21, lastSync: "2026-09-01 12:00 UTC" },
      { name: "research_projects", rows: 30, lastSync: "2026-09-01 12:00 UTC" },
      { name: "opportunities", rows: 30, lastSync: "2026-09-01 12:00 UTC" },
      { name: "events", rows: 50, lastSync: "2026-09-01 12:00 UTC" },
      { name: "facilities", rows: 15, lastSync: "2026-09-01 12:00 UTC" },
    ],
    genieEngine: "Databricks Genie AI v2.4 (Active)",
  });
});

// Root & Health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: config.PROJECT_NAME,
    version: config.VERSION,
    mock_genie: config.MOCK_GENIE,
    environment: config.ENVIRONMENT,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Start Express Server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`${config.PROJECT_NAME} running on http://localhost:${PORT}`);
  console.log(` Mock Genie Mode: ${config.MOCK_GENIE}`);
});

export default app;
