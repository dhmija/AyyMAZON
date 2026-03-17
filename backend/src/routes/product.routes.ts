import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { validateQuery } from "../middleware/validate";
import { z } from "zod";

const router = Router();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const searchQuerySchema = paginationSchema.extend({
  q: z.string().optional(),
  query: z.string().optional(),
  category: z.string().optional(),
});

// Order matters: specific paths before /:id
router.get("/search", validateQuery(searchQuerySchema), productController.search);
router.get(
  "/category/:category",
  validateQuery(paginationSchema),
  productController.getByCategory
);
router.get("/", validateQuery(paginationSchema), productController.list);
router.get("/:id", productController.getById);

export const productRouter = router;
