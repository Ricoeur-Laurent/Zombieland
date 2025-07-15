import * as z from 'zod/v4';

// Zod schema for attraction creation
export const createAttractionSchema = z.object({
	name: z.string().nonempty().min(3),
	image: z.url(),
	description: z.string().nonempty().min(10),
	slug: z
		.string()
		.nonempty()
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

// Zod schema for attraction update
export const updateAttractionSchema = createAttractionSchema.partial();
