import * as z from 'zod/v4';

// Zod schema for category creation
export const createCategorySchema = z.object({
	name: z.string().nonempty().min(2),
});

// Zod schema for category update
export const updateCategorySchema = createCategorySchema.partial();
