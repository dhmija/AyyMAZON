import express from "express";
import cors from "cors";
import { apiRouter } from "../routes";
import { errorHandler } from "../middleware/errorHandler";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter((v): v is string => Boolean(v));

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use(errorHandler);
export default app;
