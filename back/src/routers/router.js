import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';
import loginRoutes from './routes/login.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import signUpRoutes from './routes/users.routes.js';
import attractionsRoutes from './routes/attractions.routes.js';
import categoriesRoutes from './routes/categories.routes.js';


const router = express.Router();

router.use('/api/signUp', signUpRoutes);
router.use('/api/login', loginRoutes);
router.use('/api/reservations', verifyToken, reservationsRoutes);
router.use('/api/attractions', attractionsRoutes);
router.use('/api/categories', categoriesRoutes);
router.use("/api/myReservations", verifyToken, reservationsRoutes);

// =================== Admin routes =====================

router.use('/api/admin/reservations', verifyToken, verifyAdmin, reservationsRoutes);
router.use('/api/admin/attractions', verifyToken, verifyAdmin, attractionsRoutes);
router.use('/api/admin/users', verifyToken, verifyAdmin, signUpRoutes);
router.use('/api/admin/categories', verifyToken, verifyAdmin, categoriesRoutes);

export default router;
