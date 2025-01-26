import express from "express";
import * as userController from "./user.controller";
import { verifyAccessToken } from "../../helpers/jwt_helper";
const authRouter = express.Router();
const userRouter = express.Router();

authRouter.post("/register", userController.registerUser);
authRouter.post("/login", userController.loginUser);
authRouter.post("/refresh-token", userController.refreshToken);
authRouter.post("/logout", verifyAccessToken, userController.logOutUser);

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId",verifyAccessToken, userController.getUserById);
userRouter.put("/:userId", verifyAccessToken, userController.updateUserById);
userRouter.post(
	"/update-password",
	verifyAccessToken,
	userController.updatePassword
);
userRouter.delete("/:userId", userController.deleteUserById);

export const userAuthRoutes = authRouter;
export const userRouters = userRouter;
