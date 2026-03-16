import express from "express";
import cors from "cors";
import { apiRouter } from "../routes";
import { errorHandler } from "../middleware/errorHandler";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use(errorHandler);
export default app;
