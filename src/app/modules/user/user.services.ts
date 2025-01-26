import { TUpdatedUserData, TUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const findUserByEmail = async (email: string) => {
	return await User.findOne({ email: email });
};

const getAllUsersFromDB = async () => {
	return await User.find({});
};

const findUserById = async (id: string) => {
	return await User.findById(id);
};

const updateuserIntoDB = async (id: string, updatedData: TUpdatedUserData) => {
	const result = await User.findByIdAndUpdate(id, updatedData, {
		new: true,
	});
	return result;
};

const deleteUserFromDB = async (id: string) => {
	return User.findByIdAndDelete(id);
};

const createUser = async (
	name: string,
	email: string,
	password: string,
	city: string,
	address: string,
	country: string,
	phone: string,
	role: string
) => {
	const hashpassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		name,
		email,
		password: hashpassword,
		city,
		address,
		country,
		phone,
		role,
	});
	return await user.save();
};

const ValidatePassword = async (password: string, hashpassword: string) => {
	return await bcrypt.compare(password, hashpassword);
};

export const userServices = {
	createUser,
	findUserByEmail,
	ValidatePassword,
	getAllUsersFromDB,
	findUserById,
	updateuserIntoDB,
	deleteUserFromDB,
};
