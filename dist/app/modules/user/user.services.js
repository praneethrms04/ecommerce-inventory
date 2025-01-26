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
exports.userServices = void 0;
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ email: email });
});
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find({});
});
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findById(id);
});
const updateuserIntoDB = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, updatedData, {
        new: true,
    });
    return result;
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.User.findByIdAndDelete(id);
});
const createUser = (name, email, password, city, address, country, phone, role) => __awaiter(void 0, void 0, void 0, function* () {
    const hashpassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield user_model_1.User.create({
        name,
        email,
        password: hashpassword,
        city,
        address,
        country,
        phone,
        role,
    });
    return yield user.save();
});
const ValidatePassword = (password, hashpassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(password, hashpassword);
});
exports.userServices = {
    createUser,
    findUserByEmail,
    ValidatePassword,
    getAllUsersFromDB,
    findUserById,
    updateuserIntoDB,
    deleteUserFromDB,
};
