import { z } from "zod";

export const variantValidationSchema = z.object({
	type: z.string({
		required_error: "Variant type is required",
		invalid_type_error: "Variant type must be a string",
	}),
	value: z.string(),
});

export const inventoryValidationSchema = z.object({
	quantity: z.number().min(0),
	inStock: z.boolean(),
});

const productValidationSchema = z.object({
	name: z.string(),
	description: z.string(),
	price: z.number(),
	category: z.string(),
	tags: z.array(z.string()),
	variants: z.array(variantValidationSchema),
	inventory: inventoryValidationSchema,
});

export default productValidationSchema;
