import * as z from "zod/v4"

// Zod schema for attraction creation
export const createReservationSchema = z.object({
    visit_date: z.coerce.date().refine((date)=> date > new Date(),{message : "La date de visite doit être dans le futur"}),
    amount: z.coerce.number().positive(),
    nb_participants: z.coerce.number().int().positive(),
    userId: z.coerce.number().int().positive()
})

// Zod schema for attraction update
export const updateReservationSchema = createReservationSchema.partial()