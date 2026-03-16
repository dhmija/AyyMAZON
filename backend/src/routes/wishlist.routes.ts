import { Router as ExpressRouter } from "express";
import * as wishlistController from "../controllers/wishlist.controller";
import { requireUser } from "../middleware/requireUser";

const router = ExpressRouter();

router.use(requireUser);

router.get("/", wishlistController.getWishlist);
router.post("/items", wishlistController.addItemToWishlist);
router.delete("/items/:productId", wishlistController.removeItemFromWishlist);

export default router;
