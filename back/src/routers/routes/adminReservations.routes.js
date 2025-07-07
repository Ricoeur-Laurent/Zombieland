import express from "express";
import reservationsController from"../../controllers/adminReservationsController.js"

const router = express.Router();


//Display all reservations
router.get('/', reservationsController.getAllReservations)

// display one reservation
router.get('/:id', reservationsController.getOneReservation)

// create one erservation
router.post('/', reservationsController.createOneReservation)


router.use((req, res) => {
    res.status(404).send("Sorry can't find that!");
});

export default router;