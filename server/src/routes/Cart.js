import { Router } from "express";
import CartsController from "../controllers/Cart";

const cartsRouter = Router();
const cartsController = new CartsController();

cartsRouter.get("/", cartsController.getAllCarts);
cartsRouter.get("/:id", cartsController.getCartDetail);
cartsRouter.get("/user/:id", cartsController.getCartUser);
cartsRouter.post("/", cartsController.createCart);
cartsRouter.put("/:id", cartsController.updateCart);
cartsRouter.put("/user/:userId/product/:productId", cartsController.updateCartQuantity); // New route for updating quantity
cartsRouter.delete("/:id", cartsController.deleteCart);
cartsRouter.delete("/user/:userId/product/:id", cartsController.deleteProductCart);

export default cartsRouter;
