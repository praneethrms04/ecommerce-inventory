"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productControllers = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const product_validation_1 = __importDefault(require("./product.validation"));
const product_model_1 = require("./product.model");
const product_services_1 = require("./product.services");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @desc Creates a new product
 * @route POST api/v1/products/create-product
 * @access public
 * @param {*} req
 * @param {*} res
 */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zodParser = product_validation_1.default.parse(req.body);
        const result = yield product_services_1.productServices.createAProductIntoDB(zodParser);
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err,
        });
    }
});
/**
 * @desc Get all Products
 * @route GET api/v1/products
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find({});
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @desc Get Single Product using productid
 * @route GET api/v1/products/:productid
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield product_services_1.productServices.getSingleProductFromDB(productId);
        if (!result) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(400, "Invalid Product id"));
            return;
        }
        next(error);
    }
});
/**
 * @desc Update a product using the product id
 * @route PUT api/v1/products/:productid
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  updated Product object
 */
const updateProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield product_services_1.productServices.updateProductIntoDB(productId, req.body);
        if (!result) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        res.status(200).json({
            success: true,
            message: "Product Updated successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(400, "Invalid Product id"));
            return;
        }
        next(error);
    }
});
/**
 * @desc Delete a product using the product id
 * @route DELETE api/v1/products/:productid
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  delete product from DB
 */
const deleteProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield product_services_1.productServices.deleteProductFromDB(productId);
        if (!result) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: null,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(400, "Invalid Product id"));
            return;
        }
        next(error);
    }
});
exports.productControllers = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
};
