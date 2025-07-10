import paramsSchema from "../schemas/params.js";

export function checkParams(req, res, next) {
	const result = paramsSchema.safeParse(req.params);
	if (!result.success) {
		return res.status(400).json({
			message: "req.params ne respecte pas les contraintes",
			error: result.error.issues,
		});
	}
	req.checkedParams = result.data;
	next();
}