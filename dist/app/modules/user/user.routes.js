"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouters = exports.userAuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("./user.controller"));
const jwt_helper_1 = require("../../helpers/jwt_helper");
const authRouter = express_1.default.Router();
const userRouter = express_1.default.Router();
authRouter.post("/register", userController.registerUser);
authRouter.post("/login", userController.loginUser);
authRouter.post("/refresh-token", userController.refreshToken);
userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId", userController.getUserById);
userRouter.put("/:userId", jwt_helper_1.verifyAccessToken, userController.updateUserById);
userRouter.put("/update-password", userController.updatePassword);
userRouter.delete("/:userId", userController.deleteUserById);
exports.userAuthRoutes = authRouter;
exports.userRouters = userRouter;
