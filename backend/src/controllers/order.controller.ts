import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service";
import { sendSuccess, sendCreated, sendSuccessWithMeta } from "../utils/response";

type RequestWithUserId = Request & { userId: string };

export const orderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as RequestWithUserId).userId;
      const order = await orderService.create(userId);
      sendCreated(res, order);
    } catch (e) {
      next(e);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as RequestWithUserId).userId;
      const order = await orderService.findById(id, userId);
      sendSuccess(res, order);
    } catch (e) {
      next(e);
    }
  },

  async getByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as RequestWithUserId).userId;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const result = await orderService.findByUserId(userId, { page, limit });
      sendSuccessWithMeta(res, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (e) {
      next(e);
    }
  },
};
