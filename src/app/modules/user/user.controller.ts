import { NextFunction, Request, Response } from "express";
import userValidationSchema from "./user.validation";
import { userServices } from "./user.services";
import createError from "http-errors";
import {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} from "../../helpers/jwt_helper";
import mongoose from "mongoose";
import { TUpdatedUserData } from "./user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "./user.model";

/**
 * @desc Create a new User account
 * @route POST api/v1/auth/register
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, password, city, address, country, phone, role } =
			req.body;

		const existingUser = await userServices.findUserByEmail(email);

		if (existingUser) {
			throw createError.Conflict(`${email} already exists`);
		}
		const userRole = role || "user";
		const result = await userServices.createUser(
			name,
			email,
			password,
			city,
			address,
			country,
			phone,
			userRole
		);

		res.json({
			success: true,
			message: "user registered successfully",
			data: result,
		});
	} catch (error: any) {
		next(error);
	}
};

/**
 * @desc Login User
 * @route POST api/v1/auth/login
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const loginUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;
		const user = await userServices.findUserByEmail(email);
		if (!user) {
			throw createError.NotFound("Email does not exist");
		}
		//validPassword
		const isValidPassword = await userServices.ValidatePassword(
			password,
			user.password
		);
		if (!isValidPassword) {
			throw createError.Unauthorized("Password is not valid");
		}
		const accessToken = await signAccessToken(user.id);
		const refreshToken = await signRefreshToken(user.id);

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				user,
				accessToken,
				refreshToken,
			},
		});
	} catch (error: any) {
		next(error);
	}
};

/**
 * @desc Refresh token
 * @route POST api/v1/auth/refresh-token
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const refreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) throw createError.BadRequest();
		const userId = await verifyRefreshToken(refreshToken);
		const accesstoken = await signAccessToken(userId as string);
		const refreshtoken = await signRefreshToken(userId as string);
		res.send({ accessToken: accesstoken, refreshToken: refreshtoken });
	} catch (error: any) {
		next(error);
	}
};

/**
 * @desc get All Users in the DB
 * @route GET api/v1/users
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await userServices.getAllUsersFromDB();
		res.status(200).json({
			success: true,
			message: "Users successfully retrieved",
			data: users,
		});
	} catch (error: any) {
		next(error);
	}
};

/**
 * @desc get single User By Id
 * @route GET api/v1/users/:userId
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const getUserById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await userServices.findUserById(req.params.userId);
		if (!user) {
			throw createError.NotFound("User not found");
		}
		user.password = undefined as any;

		res.status(200).json({
			success: true,
			message: "Users successfully retrieved",
			data: user,
		});
	} catch (error: any) {
		if (error instanceof mongoose.Error.CastError) {
			next(createError(400, "Invalid Product id"));
			return;
		}
		next(error);
	}
};

/**
 * @desc Update User By Id
 * @route PUT api/v1/users/:userId
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const updateUserById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const userData = req.body as TUpdatedUserData;
		const result = await userServices.updateuserIntoDB(userId, userData);

		if (!result) {
			throw createError.NotFound("user not found");
		}

		res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: result,
		});
	} catch (error: any) {
		if (error instanceof mongoose.Error.CastError) {
			next(createError(400, "Invalid user id"));
		}

		next(error);
	}
};

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const deleteUserById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		const result = await userServices.deleteUserFromDB(userId);

		if (!result) {
			throw createError.NotFound("User not found");
		}
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
			data: result,
		});
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			next(createError(400, "Invalid user id"));
			return;
		}
		next(error);
	}
};

/**
 * @desc update password
 * @route GET api/v1/users/update-password
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const updatePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = (req as any).payload?.aud;
		const user = await userServices.findUserById(userId);
		if (!user) {
			throw createError.NotFound("user not found");
		}
		console.log(user.password);
		const { oldPassword, newPassword } = req.body;
		if (!oldPassword || !newPassword) {
			throw createError.BadRequest(
				"Old password and new password are required."
			);
		}
		const isMatch = await userServices.ValidatePassword(
			oldPassword,
			user.password
		);
		if (!isMatch)
			throw createError.Unauthorized("Old password is incorrect");
		const hashpassword = await bcrypt.hash(newPassword, 10);
		user.password = hashpassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			throw createError(400, "Invalid User Id");
		}
		next(error);
	}
};

/**
 * @desc LogOut the current user
 * @route GET api/v1/users/logout
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const logOutUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = (req as any).payload.aud;
		await User.findByIdAndUpdate(userId, { refreshToken: null });

		res.status(200).json({
			success: true,
			message: "User logged out successfully",
		});
	} catch (error) {
		next(error);
	}
};
