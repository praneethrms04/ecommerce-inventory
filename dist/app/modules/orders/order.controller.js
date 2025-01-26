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
exports.orderController = void 0;
const order_validation_1 = __importDefault(require("./order.validation"));
const http_errors_1 = __importDefault(require("http-errors"));
const product_model_1 = require("../products/product.model");
const order_services_1 = require("./order.services");
/**
 * @desc Create a order
 * @route POST api/v1/orders/create
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  create a new order
 */
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //zod validation
        const zodValidation = order_validation_1.default.safeParse(req.body);
        if (typeof zodValidation.error !== "undefined" &&
            zodValidation.error.name === "ZodError") {
            const errorLists = zodValidation.error.issues.map((err) => err.message);
            throw (0, http_errors_1.default)(400, `${errorLists}`);
        }
        if (zodValidation.success) {
            const product = yield product_model_1.Product.findById(zodValidation.data.productId);
            if (product &&
                product.inventory.quantity < zodValidation.data.quantity) {
                throw (0, http_errors_1.default)(400, "Insufficient quantity available in this inventory");
            }
            if (product) {
                // we have total 70 products
                //product.inventory.quantity = 60
                product.inventory.quantity =
                    product.inventory.quantity - zodValidation.data.quantity;
                product.inventory.inStock =
                    product.inventory.quantity === 0 ? false : true;
                const newOrder = yield order_services_1.OrderServices.createANewOrder(zodValidation.data);
                yield product.save();
                return res.status(200).json({
                    success: true,
                    message: "Order placed successfully",
                    data: newOrder,
                });
            }
        }
    }
    catch (error) {
        if (error.name === "ValidationError") {
            return next((0, http_errors_1.default)(422, error.message));
        }
        next(error);
    }
});
/**
 * @desc Get orders by query email
 * @route POST api/v1/orders/email?${email}
 * @access public
 * @param req
 * @param res
 * @param next
 * @returns  An array of orders
 */
const handleGetAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    try {
        const orders = yield order_services_1.OrderServices.getAllOrdersFromDB(email);
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
    }
    catch (error) {
        next(error);
    }
});
exports.orderController = {
    createOrder,
    handleGetAllOrders,
};
