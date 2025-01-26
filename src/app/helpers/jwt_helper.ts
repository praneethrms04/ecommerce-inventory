import jwt, { JwtPayload } from "jsonwebtoken";
import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
	payload?: string | JwtPayload;
}

export const signAccessToken = (userId: string) => {
	return new Promise((resolve, reject) => {
		const payload = {};
		const secret = process.env.ACCESS_TOKEN_SECRET as string;
		const options = {
			expiresIn: "3d",
			issuer: "praneeth.com",
			audience: userId,
		};
		jwt.sign(payload, secret, options, (error, token) => {
			if (error) {
				console.log(error.message);
				reject(createError.InternalServerError());
			}

			resolve(token);
		});
	});
};

export const verifyAccessToken = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.headers["authorization"]) {
			throw createError.Unauthorized();
		}
		const authHeaders = req.headers["authorization"];
		const bearerToken = authHeaders.split(" ");
		const token = bearerToken[1];
		const secret = process.env.ACCESS_TOKEN_SECRET as string;
		const payload = jwt.verify(token, secret) as JwtPayload;
		req.payload = payload;
		next();
	} catch (error) {
		next(error);
	}
};

export const signRefreshToken = (userId: string) => {
	return new Promise((resolve, reject) => {
		const payload = {};
		const secretkey = process.env.REFRESH_TOKEN_SECRET as string;
		const options = {
			expiresIn: "30d",
			issuer: "praneeth.com",
			audience: userId,
		};
		jwt.sign(payload, secretkey, options, (err, token) => {
			if (err) {
				console.log(err.message);
				throw createError.InternalServerError();
			}
			resolve(token);
		});
	});
};

export const verifyRefreshToken = (refreshToken: string) => {
	const secretKey = process.env.REFRESH_TOKEN_SECRET as string;
	return new Promise((resolve, reject) => {
		jwt.verify(refreshToken, secretKey, (err, payload) => {
			if (err) {
				return reject(createError.Unauthorized());
			}
			const userId = (payload as jwt.JwtPayload).aud;
			resolve(userId);
		});
	});
};
