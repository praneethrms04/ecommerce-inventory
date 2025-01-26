import express from "express";
import { orderController } from "./order.controller";

const router = express.Router();

router.post("/create", orderController.createOrder);

router.get("/", orderController.handleGetAllOrders);

export const orderRoutes = router;
