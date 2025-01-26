"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const product_routes_1 = require("./app/modules/products/product.routes");
const order_routes_1 = require("./app/modules/orders/order.routes");
const user_routes_1 = require("./app/modules/user/user.routes");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json()); // middleware
app.use(express_1.default.urlencoded({ extended: true })); //middleware for urlencoded
app.use((0, cors_1.default)());
app.use("/api/v1/products", product_routes_1.productRouter);
app.use("/api/v1/orders", order_routes_1.orderRoutes);
app.use("/api/v1/auth", user_routes_1.userAuthRoutes);
app.use("/api/v1/users", user_routes_1.userRouters);
app.use((req, res, next) => {
    next(http_errors_1.default.NotFound("This route does not exist"));
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        success: false,
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});
app.get("/", (req, res) => {
    res.send("Ecommerce Inventory Server is Running..");
});
exports.default = app;
