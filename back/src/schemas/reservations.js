import * as z from 'zod/v4';

// Zod schema for user reservations creation
export const createReservationUserSchema = z.object({
	visit_date: z.coerce
		.date()
		.refine((date) => date > new Date(), { message: 'La date de visite doit être dans le futur' }),
	nb_participants: z.coerce.number().int().positive(),
});

// Zod schema for admin reservations creation
export const createReservationAdminSchema = z.object({
	visit_date: z.coerce
		.date()
		.refine((date) => date > new Date(), { message: 'La date de visite doit être dans le futur' }),
	amount: z.coerce.number().positive(),
	nb_participants: z.coerce.number().int().positive(),
});

// Zod schema for user reservations update
export const updateReservationUserSchema = z.object({
	visit_date: z.coerce
		.date()
		.optional()
		.refine((date) => date > new Date(), { message: 'La date de visite doit être dans le futur' }),
	nb_participants: z.coerce.number().int().positive(),
});

// Zod schema for admin reservations update
export const updateReservationAdminSchema = z.object({
	visit_date: z.coerce
		.date()
		.refine((date) => date > new Date(), {
			message: "La date de visite doit être dans le futur",
		}),
	nb_participants: z.coerce.number().int().positive().optional(),
	amount: z.coerce.number().positive().optional(),
});
