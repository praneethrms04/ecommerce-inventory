import { Schema, model } from "mongoose";
import { TInventory, TProduct, TVariant } from "./product.interface";

const VaiantSchema = new Schema<TVariant>(
	{
		type: String,
		value: String,
	},
	{ _id: false }
);

const InventorySchema = new Schema<TInventory>(
	{
		quantity: Number,
		inStock: Boolean,
	},
	{ _id: false }
);

const ProductSchema = new Schema<TProduct>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		price: Number,
		category: String,
		tags: [String],
		variants: [VaiantSchema],
		inventory: InventorySchema,
	},
	{ timestamps: true }
);

export const Product = model<TProduct>("Product", ProductSchema);
