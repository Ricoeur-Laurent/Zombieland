import express from 'express';
import homeRoutes from './routes/home.routes.js';
import loginRoutes from './routes/login.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import signUpRoutes from './routes/signUp.routes.js';
import attractionsRoutes from './routes/attractions.routes.js';
import categoriesRoutes from './routes/categories.routes.js';

const router = express.Router();

router.use('/', homeRoutes);
router.use('/signUp', signUpRoutes);
router.use('/login', loginRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/attractions', attractionsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/admin/users', signUpRoutes);
router.use('/admin/categories', categoriesRoutes);

export default router;
