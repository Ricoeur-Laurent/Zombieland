import express from "express";
import reservationsControllers from "../../controllers/reservationsControllers.js";

const router = express.Router();

router.get("/", reservationsControllers.getAllReservations);

export default router;