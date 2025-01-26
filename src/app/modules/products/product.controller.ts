import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import productValidationSchema from "./product.validation";
import { Product } from "./product.model";
import { productServices } from "./product.services";
import mongoose from "mongoose";

/**
 * @desc Creates a new product
 * @route POST api/v1/products/create-product
 * @access public
 * @param {*} req
 * @param {*} res
 */

const createProduct = async (req: Request, res: Response) => {
	try {
		const zodParser = productValidationSchema.parse(req.body);
		const result = await productServices.createAProductIntoDB(zodParser);

		res.status(201).json({
			success: true,
			message: "Product created successfully",
			data: result,
		});
	} catch (err: any) {
		res.status(400).json({
			success: false,
			message: err.message || "Something went wrong",
			error: err,
		});
	}
};

/**
 * @desc Get all Products
 * @route GET api/v1/products
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const products = await Product.find({});
		res.status(200).json({
			success: true,
			message: "Products fetched successfully",
			data: products,
		});
	} catch (error: any) {
		next(error);
	}
};

/**
 * @desc Get Single Product using productid
 * @route GET api/v1/products/:productid
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const getProductById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { productId } = req.params;
		const result = await productServices.getSingleProductFromDB(productId);
		if (!result) {
			throw createError(404, "Product not found");
		}
		res.status(200).json({
			success: true,
			message: "Product fetched successfully",
			data: result,
		});
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			next(createError(400, "Invalid Product id"));
			return;
		}
		next(error);
	}
};

/**
 * @desc Update a product using the product id
 * @route PUT api/v1/products/:productid
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  updated Product object
 */

const updateProductById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { productId } = req.params;
		const result = await productServices.updateProductIntoDB(
			productId,
			req.body
		);
		if (!result) {
			throw createError(404, "Product not found");
		}
		res.status(200).json({
			success: true,
			message: "Product Updated successfully",
			data: result,
		});
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			next(createError(400, "Invalid Product id"));
			return;
		}
		next(error);
	}
};

/**
 * @desc Delete a product using the product id
 * @route DELETE api/v1/products/:productid
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  delete product from DB
 */

const deleteProductById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { productId } = req.params;
		const result = await productServices.deleteProductFromDB(productId);
		if (!result) {
			throw createError(404, "Product not found");
		}
		res.status(200).json({
			success: true,
			message: "Product deleted successfully",
			data: null,
		});
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			next(createError(400, "Invalid Product id"));
			return;
		}
		next(error);
	}
};

export const productControllers = {
	createProduct,
	getAllProducts,
	getProductById,
	updateProductById,
	deleteProductById,
};
