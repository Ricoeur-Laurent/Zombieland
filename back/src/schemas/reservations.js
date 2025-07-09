import * as z from "zod/v4"

// Zod schema for attraction creation
export const createReservationSchema = z.object ({
visit_date : z.coerce.date().nonempty(),
amount : z.coerce.number().int().positive(),
nb_participants : z.coerce.number().int().positive(),
userId : z.number().int().nonempty()
})

// Zod schema for attraction update
export const updateReservationSchema = createReservationSchema.partial()