import { TProduct } from "./product.interface";
import { Product } from "./product.model";

const createAProductIntoDB = async (productData: TProduct) => {
	const result = await Product.create(productData);
	return result;
};

const getSingleProductFromDB = async (id: string) => {
	const result = await Product.findById(id);
	return result;
};

const updateProductIntoDB = async (id: string, updatedData: TProduct) => {
	const result = await Product.findByIdAndUpdate(id, updatedData, {
		new: true,
	});
	return result;
};

const deleteProductFromDB = async (id: string) => {
	const result = await Product.findByIdAndDelete(id);
	return result;
};

export const productServices = {
	createAProductIntoDB,
	getSingleProductFromDB,
	updateProductIntoDB,
	deleteProductFromDB,
};
