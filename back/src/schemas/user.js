import { z } from "zod";

const signUpSchema = z.object({
	firstname: z.string().min(2),
	lastname: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(4),
	phone: z.string().min(10),
});

const updateUserSchema = z.object({

	firstname: z.string().min(2).optional(),
	lastname: z.string().min(2).optional(),
	email: z.string().email().optional(),
	password: z.string().min(4).optional(),
	phone: z.string().min(10).optional(),
	admin: z.boolean().optional(),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});
const adminUserCreateSchema = z.object({
	firstname: z.string().min(2),
	lastname: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(4).optional(), // pour autoriser le fallback
	phone: z.string().min(10),
	admin: z.boolean().optional(),
});
export { signUpSchema, loginSchema, updateUserSchema, adminUserCreateSchema };
