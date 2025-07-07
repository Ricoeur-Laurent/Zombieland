import express from 'express';
import { verifyToken } from '../../middlewares/verifyToken.js';
import reservationsControllers from '../../controllers/reservationsControllers.js';

const router = express.Router();

// Middleware pour vérifier le token JWT et protéger toutes les routes de ce router
router.use(verifyToken);

// get all reservations
router.get('/', reservationsControllers.getAllReservations);

// Get one reservation by user's id
router.get('/:userId', reservationsControllers.getAllReservationsByUserId);

// create one reservation
router.post('/', reservationsControllers.createReservation);

// update a reservation based on its id
router.patch('/:id', reservationsControllers.updateReservation);

// delete a reservation based on its id
router.delete('/:id', reservationsControllers.deleteReservation);

export default router;
