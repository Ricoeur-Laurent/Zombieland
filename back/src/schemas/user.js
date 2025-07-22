import { z } from 'zod';

// Schema for user sign-up form validation
const signUpSchema = z.object({
	firstname: z.string().min(2),
	lastname: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(4),
	phone: z.string().min(10),
});

// Schema for updating user info - all fields optional but validated if present
const updateUserSchema = z.object({
	firstname: z.string().min(2).optional(),
	lastname: z.string().min(2).optional(),
	email: z.string().email().optional(),
	password: z.string().min(4).optional(),
	phone: z.string().min(10).optional(),
	admin: z.boolean().optional(),
});

// Schema for updating password, requires old and new password (both at least 4 chars)
const updatePswdSchema = z.object({
	oldPswd: z.string().min(4),
	newPswd: z.string().min(4),
});

// Schema for login, requires valid email and password
const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});

// Schema for admin to create user, password is optional (allow fallback)
const adminUserCreateSchema = z.object({
	firstname: z.string().min(2),
	lastname: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(4).optional(), // pour autoriser le fallback
	phone: z.string().min(10),
	admin: z.boolean().optional(),
});
export { signUpSchema, updatePswdSchema, loginSchema, updateUserSchema, adminUserCreateSchema };
