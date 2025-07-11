import { z } from 'zod';

const signUpSchema = z.object({
	firstname: z.string().min(2),
	lastname: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(4),
	phone: z.string().min(10),
});

const updateUserSchema = z.object({
	firstname: z.string().min(2),
	lastname: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(4),
	phone: z.string().min(10),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});
export { signUpSchema, loginSchema, updateUserSchema };
