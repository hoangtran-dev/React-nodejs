import { Router } from "express";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import cartsRouter from "./Cart";
import ordersRouter from "./orders";
import userRouter from "./userRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Home");
});

router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/carts", cartsRouter)
router.use("/orders", ordersRouter)
router.use("/users", userRouter)

export default router;
