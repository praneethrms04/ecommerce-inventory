import { NextFunction, Request, Response } from "express";
import orderValidationSchema from "./order.validation";
import createError from "http-errors";
import { Product } from "../products/product.model";
import { OrderServices } from "./order.services";

/**
 * @desc Create a order
 * @route POST api/v1/orders/create
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  create a new order
 */

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		//zod validation
		const zodValidation = orderValidationSchema.safeParse(req.body);
		if (
			typeof zodValidation.error !== "undefined" &&
			zodValidation.error.name === "ZodError"
		) {
			const errorLists = zodValidation.error.issues.map(
				(err) => err.message
			);

			throw createError(400, `${errorLists}`);
		}
		if (zodValidation.success) {
			const product = await Product.findById(
				zodValidation.data.productId
			);
			if (
				product &&
				product.inventory.quantity < zodValidation.data.quantity
			) {
				throw createError(
					400,
					"Insufficient quantity available in this inventory"
				);
			}
			if (product) {
				// we have total 70 products
				//product.inventory.quantity = 60
				product.inventory.quantity =
					product.inventory.quantity - zodValidation.data.quantity;
				product.inventory.inStock =
					product.inventory.quantity === 0 ? false : true;
				const newOrder = await OrderServices.createANewOrder(
					zodValidation.data
				);

				await product.save();
				return res.status(200).json({
					success: true,
					message: "Order placed successfully",
					data: newOrder,
				});
			}
		}
	} catch (error: any) {
		if (error.name === "ValidationError") {
			return next(createError(422, error.message));
		}
		next(error);
	}
};

/**
 * @desc Get orders by query email
 * @route POST api/v1/orders/email?${email}
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  An array of orders
 */

const handleGetAllOrders = async (req: Request,res: Response,next: NextFunction) => {
	const email = req.query.email;
	try {
		const orders = await OrderServices.getAllOrdersFromDB(
			email as string | undefined
		);
		if (orders.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No orders found for this email",
				data: [],
			});
		}

		return res.status(200).json({
			success: true,
			message: "Orders fetched successfully",
			data: orders,
		});
	} catch (error: any) {
		next(error);
	}
};
export const orderController = {
	createOrder,
	handleGetAllOrders,
};
