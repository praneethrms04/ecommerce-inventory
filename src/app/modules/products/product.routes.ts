import express from "express";
import { productControllers } from "./product.controller";
const router = express.Router();

router.post("/create-product", productControllers.createProduct);
router.get("/", productControllers.getAllProducts);
router.get("/:productId", productControllers.getProductById);
router.put("/:productId", productControllers.updateProductById);
router.delete("/:productId", productControllers.deleteProductById);

export const productRouter = router;
