import * as z from 'zod/v4';

// Zod schema for attraction creation
export const createReviewSchema = z.object({
	rating: z.coerce.number({ message: 'La note doit être un nombre' }).int().positive(),
	comment: z.string().nonempty({ message: 'Le commentaire ne peut pas être vide.' }).min(1),
});
