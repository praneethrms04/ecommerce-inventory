import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>({
	name: {
		type: String,
		required: [true, "name is required"],
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: [true, "address is required"],
	},
	city: {
		type: String,
		required: [true, "city name is required"],
	},
	country: {
		type: String,
		required: [true, "country name is required"],
	},
	phone: {
		type: String,
		required: [true, "phone no is required"],
	},
	profilePic: {
		public_id: {
			type: String,
		},
		url: {
			type: String,
		},
	},
	role: {
		type: String,
		default: "user",
	},
});

export const User = model<TUser>("User", UserSchema);
