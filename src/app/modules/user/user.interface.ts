import { Types } from "mongoose";

export type IprofilePic = {
	public_id: string;
	url: string;
};

export type TUser = {
	_id: Types.ObjectId;
	name: string;
	email: string;
	password: string;
	role: string;
	city: string;
	address: string;
	profilePic: IprofilePic;
	country: string;
	phone: string;
};

export type TUpdatedUserData = {
	name: string;
	address: string;
	city: string;
	country: string;
	phone: string;
};
