import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { requireUser } from "../middleware/requireUser";
import { validateBody } from "../middleware/validate";
import { z } from "zod";

const router = Router();

router.use(requireUser);

const addCartItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  quantity: z.number().int().min(1),
});

const updateCartItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  quantity: z.number().int().min(0),
});

const removeCartItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
});

router.post("/add", validateBody(addCartItemSchema), cartController.addItem);
router.get("/", cartController.getCart);
router.patch("/update", validateBody(updateCartItemSchema), cartController.updateItem);
router.delete("/remove", validateBody(removeCartItemSchema), cartController.removeItem);

export const cartRouter = router;
