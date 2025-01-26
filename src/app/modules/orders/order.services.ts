import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";

const createANewOrder = async (orderData: TOrder) => {
	return await OrderModel.create(orderData);
};

const getAllOrdersFromDB = async (query: string | undefined) => {
	const filter = query ? { email: query } : {};
	const result = await OrderModel.find(filter);
	return result;
};
export const OrderServices = {
	createANewOrder,
	getAllOrdersFromDB,
};
