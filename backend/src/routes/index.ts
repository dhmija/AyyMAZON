import { Router } from "express";
import { healthRouter } from "./health.routes";
import { productRouter } from "./product.routes";
import { cartRouter } from "./cart.routes";
import { orderRouter } from "./order.routes";
import wishlistRouter from "./wishlist.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/wishlist", wishlistRouter);
