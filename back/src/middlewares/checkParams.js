import paramsSchema from "../schemas/params.js";

// Middleware to validate req.params using Zod
export function checkParams(req, res, next) {

	// Use Zod's safeParse to validate req.params
	const result = paramsSchema.safeParse(req.params);

	// If validation fails, return a 400 Bad Request with error details
	if (!result.success) {
		return res.status(400).json({
			message: "req.params ne respecte pas les contraintes",
			error: result.error.issues, // Array of specific validation errors
		});
	}

	// If valid, store the validated data in req.checkedParams for later use
	req.checkedParams = result.data;
	next();
}