import express from 'express';
import reservationsControllers from '../../controllers/reservationsControllers.js';

const router = express.Router();

// get all reservations
router.get('/', reservationsControllers.getAllReservations);

// Get all reservations by user's id
router.get('/userId', reservationsControllers.getAllReservationsByUserId);

// Get on reservation by user id
router.get('/userId/:id', reservationsControllers.getOneReservationByUserId)

// create one reservation
router.post('/', reservationsControllers.createReservation);

// update a reservation based on its id
router.patch('/:id', reservationsControllers.updateReservation);

// delete a reservation based on its id
router.delete('/:id', reservationsControllers.deleteReservation);

export default router;
