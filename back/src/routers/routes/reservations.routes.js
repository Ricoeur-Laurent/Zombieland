import express from "express";
import reservationsControllers from "../../controllers/reservationsControllers.js";
import { checkParams } from "../../middlewares/checkParams.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

// get all reservations
router.get("/", verifyToken, verifyAdmin,  reservationsControllers.getAllReservations);

// Get all reservations by user's id
router.get("/userId", verifyToken,  reservationsControllers.getAllReservationsByUserId);

// Get one reservation by user id
router.get(
	"/userId/:id", verifyToken, 
	checkParams,
	reservationsControllers.getOneReservationByUserId,
);

// create one reservation
router.post("/",  verifyToken, reservationsControllers.createReservation);

// update a reservation based on its id
router.patch("/:id",  verifyToken, checkParams, reservationsControllers.updateReservation);

// delete a reservation based on its id
router.delete("/:id",  verifyToken, checkParams, reservationsControllers.deleteReservation);

export default router;
