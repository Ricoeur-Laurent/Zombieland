import * as z from 'zod/v4';

// Define a schema to validate the parameters object
const paramsSchema = z
	.object({
		id: z.coerce.number().int().positive().optional(),
		slug: z
			.string()
			.regex(/^[a-z0-9àâäçéèêëîïôöùûüÿœ\-]+$/)
			.optional(),
	})
	.refine((data) => data.id !== undefined || data.slug !== undefined);

export default paramsSchema;
