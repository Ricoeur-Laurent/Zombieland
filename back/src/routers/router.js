import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';
import homeRoutes from './routes/home.routes.js';
import loginRoutes from './routes/login.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import signUpRoutes from './routes/users.routes.js';
import attractionsRoutes from './routes/attractions.routes.js';
import categoriesRoutes from './routes/categories.routes.js';


const router = express.Router();

router.use('/signUp', signUpRoutes);
router.use('/login', loginRoutes);
router.use('/reservations', verifyToken, reservationsRoutes);
router.use('/attractions', attractionsRoutes);
router.use('/categories', categoriesRoutes);
router.use("/myReservations", verifyToken, reservationsRoutes);

// =================== Admin routes =====================

router.use('/admin/reservations', verifyToken, verifyAdmin, reservationsRoutes);
router.use('/admin/attractions', verifyToken, verifyAdmin, attractionsRoutes);
router.use('/admin/users', verifyToken, verifyAdmin, signUpRoutes);
router.use('/admin/categories', verifyToken, verifyAdmin, categoriesRoutes);

export default router;
