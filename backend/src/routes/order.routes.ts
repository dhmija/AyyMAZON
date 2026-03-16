import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { requireUser } from "../middleware/requireUser";
import { validateQuery } from "../middleware/validate";
import { z } from "zod";

const router = Router();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

// GET /orders/user must be before GET /orders/:id
router.post("/", requireUser, orderController.create);
router.get("/user", requireUser, validateQuery(paginationSchema), orderController.getByUser);
router.get("/:id", requireUser, orderController.getById);

export const orderRouter = router;
