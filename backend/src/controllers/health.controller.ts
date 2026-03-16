import { Request, Response } from "express";

export const healthController = {
  get(_req: Request, res: Response) {
    res.json({ status: "ok", service: "amazon-clone-api" });
  },
};
