import express from "express";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import morgan from "morgan";
import cors from "cors";
import { productRouter } from "./app/modules/products/product.routes";
import { orderRoutes } from "./app/modules/orders/order.routes";
import { userAuthRoutes, userRouters } from "./app/modules/user/user.routes";

const app = express();

app.use(morgan("dev"));
app.use(express.json()); // middleware
app.use(express.urlencoded({ extended: true })); //middleware for urlencoded
app.use(cors());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/auth", userAuthRoutes);
app.use("/api/v1/users", userRouters);

app.use((req, res, next) => {
	next(createError.NotFound("This route does not exist"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	res.status(err.status || 500);
	res.send({
		success: false,
		error: {
			status: err.status || 500,
			message: err.message,
		},
	});
});
app.get("/", (req: Request, res: Response) => {
	res.send("Ecommerce Inventory Server is Running..");
});

export default app;
