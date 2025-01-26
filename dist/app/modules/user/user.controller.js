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
exports.updatePassword = exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getAllUsers = exports.refreshToken = exports.loginUser = exports.registerUser = void 0;
const user_services_1 = require("./user.services");
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_helper_1 = require("../../helpers/jwt_helper");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @desc Create a new User account
 * @route POST api/v1/auth/register
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, city, address, country, phone, role } = req.body;
        const existingUser = yield user_services_1.userServices.findUserByEmail(email);
        if (existingUser) {
            throw http_errors_1.default.Conflict(`${email} already exists`);
        }
        const userRole = role || "user";
        const result = yield user_services_1.userServices.createUser(name, email, password, city, address, country, phone, userRole);
        res.json({
            success: true,
            message: "user registered successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
/**
 * @desc Login User
 * @route POST api/v1/auth/login
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_services_1.userServices.findUserByEmail(email);
        if (!user) {
            throw http_errors_1.default.NotFound("Email does not exist");
        }
        //validPassword
        const isValidPassword = yield user_services_1.userServices.ValidatePassword(password, user.password);
        if (!isValidPassword) {
            throw http_errors_1.default.Unauthorized("Password is not valid");
        }
        const accessToken = yield (0, jwt_helper_1.signAccessToken)(user.id);
        const refreshToken = yield (0, jwt_helper_1.signRefreshToken)(user.id);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
/**
 * @desc Refresh token
 * @route POST api/v1/auth/refresh-token
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw http_errors_1.default.BadRequest();
        const userId = yield (0, jwt_helper_1.verifyRefreshToken)(refreshToken);
        const accesstoken = yield (0, jwt_helper_1.signAccessToken)(userId);
        const refreshtoken = yield (0, jwt_helper_1.signRefreshToken)(userId);
        res.send({ accessToken: accesstoken, refreshToken: refreshtoken });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
/**
 * @desc get All Users in the DB
 * @route GET api/v1/users
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_services_1.userServices.getAllUsersFromDB();
        res.status(200).json({
            success: true,
            message: "Users successfully retrieved",
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
/**
 * @desc get single User By Id
 * @route GET api/v1/users/:userId
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_services_1.userServices.findUserById(req.params.userId);
        if (!user) {
            throw http_errors_1.default.NotFound("User not found");
        }
        user.password = undefined;
        res.status(200).json({
            success: true,
            message: "Users successfully retrieved",
            data: user,
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
exports.getUserById = getUserById;
/**
 * @desc Update User By Id
 * @route PUT api/v1/users/:userId
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userData = req.body;
        const result = yield user_services_1.userServices.updateuserIntoDB(userId, userData);
        if (!result) {
            throw http_errors_1.default.NotFound("user not found");
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(400, "Invalid user id"));
        }
        next(error);
    }
});
exports.updateUserById = updateUserById;
/**
 * @desc Delete User By Id
 * @route PUT api/v1/users/:userId
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield user_services_1.userServices.deleteUserFromDB(userId);
        if (!result) {
            throw http_errors_1.default.NotFound("User not found");
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(400, "Invalid user id"));
            return;
        }
        next(error);
    }
});
exports.deleteUserById = deleteUserById;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("user update password");
        res.json({
            success: true,
            message: "Password updated"
        });
    }
    catch (error) {
        console.log(error);
        // next(error);
    }
});
exports.updatePassword = updatePassword;
