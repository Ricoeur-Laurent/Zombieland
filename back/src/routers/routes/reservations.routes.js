import express from 'express';
import reservationsControllers from '../../controllers/reservationsControllers.js';

const router = express.Router();

// get all reservations
router.get('/', reservationsControllers.getAllReservations);

// Get one reservation by its id
router.get('/:id', reservationsControllers.getOneReservation);

// create one reservation
router.post('/', reservationsControllers.reservationsCreate);

// update a reservation based on its id
router.patch('/:id', reservationsControllers.reservationUpdate)

// delete a reservation based on its id
router.delete('/:id', reservationsControllers.reservationDelete)

export default router;
