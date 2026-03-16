import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";
import { sendSuccess, sendSuccessWithMeta } from "../utils/response";

export const productController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const result = await productService.findAll({ page, limit });
      sendSuccessWithMeta(res, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (e) {
      next(e);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.findById(id);
      sendSuccess(res, product);
    } catch (e) {
      next(e);
    }
  },

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = (req.query.q ?? req.query.query ?? "") as string;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const result = await productService.search(q, { page, limit });
      sendSuccessWithMeta(res, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (e) {
      next(e);
    }
  },

  async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const result = await productService.findByCategorySlug(category, { page, limit });
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
