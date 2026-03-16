import { Request, Response, NextFunction } from "express";
import { cartService } from "../services/cart.service";
import { sendSuccess, sendCreated } from "../utils/response";

type RequestWithUserId = Request & { userId: string };

export const cartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as RequestWithUserId).userId;
      const cart = await cartService.getOrCreateCart(userId);
      sendSuccess(res, cart);
    } catch (e) {
      next(e);
    }
  },

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as RequestWithUserId).userId;
      const { productId, quantity } = req.body;
      const cart = await cartService.addItem(userId, productId, quantity);
      sendCreated(res, cart);
    } catch (e) {
      next(e);
    }
  },

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as RequestWithUserId).userId;
      const { productId, quantity } = req.body;
      const cart = await cartService.updateItem(userId, productId, quantity);
      sendSuccess(res, cart);
    } catch (e) {
      next(e);
    }
  },

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as RequestWithUserId).userId;
      const { productId } = req.body;
      const cart = await cartService.removeItem(userId, productId);
      sendSuccess(res, cart);
    } catch (e) {
      next(e);
    }
  },
};
