"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.signRefreshToken = exports.verifyAccessToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "3d",
            issuer: "praneeth.com",
            audience: userId,
        };
        jsonwebtoken_1.default.sign(payload, secret, options, (error, token) => {
            if (error) {
                console.log(error.message);
                reject(http_errors_1.default.InternalServerError());
            }
            resolve(token);
        });
    });
};
exports.signAccessToken = signAccessToken;
const verifyAccessToken = (req, res, next) => {
    try {
        if (!req.headers["authorization"]) {
            throw http_errors_1.default.Unauthorized();
        }
        const authHeaders = req.headers["authorization"];
        const bearerToken = authHeaders.split(" ");
        const token = bearerToken[1];
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.payload = payload;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyAccessToken = verifyAccessToken;
const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secretkey = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: "30d",
            issuer: "praneeth.com",
            audience: userId,
        };
        jsonwebtoken_1.default.sign(payload, secretkey, options, (err, token) => {
            if (err) {
                console.log(err.message);
                throw http_errors_1.default.InternalServerError();
            }
            resolve(token);
        });
    });
};
exports.signRefreshToken = signRefreshToken;
const verifyRefreshToken = (refreshToken) => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(refreshToken, secretKey, (err, payload) => {
            if (err) {
                return reject(http_errors_1.default.Unauthorized());
            }
            const userId = payload.aud;
            resolve(userId);
        });
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
