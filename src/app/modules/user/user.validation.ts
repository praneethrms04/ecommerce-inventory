import { z } from "zod";

const userValidationSchema = z.object({
	email: z.string({
		required_error: "Email is required",
		invalid_type_error: "Email must be string",
	}),
	password: z.string({
		required_error: "Password is required",
		invalid_type_error: "Password must be a string",
	}),
});

export default userValidationSchema;
