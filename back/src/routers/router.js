
import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import attractionsRoutes from "./routes/attractions.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import loginRoutes from "./routes/login.routes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import signUpRoutes from "./routes/users.routes.js";


const router = express.Router();

router.use("/signUp", signUpRoutes);
router.use("/login", loginRoutes);
router.use("/reservations", verifyToken, reservationsRoutes);
router.use("/attractions", attractionsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/myReservations", verifyToken, reservationsRoutes);
router.use("/reviews", reviewsRoutes);

// =================== Admin routes =====================

router.use("/admin/reservations", verifyToken, verifyAdmin, reservationsRoutes);
router.use("/admin/attractions", verifyToken, verifyAdmin, attractionsRoutes);
router.use("/admin/users", verifyToken, verifyAdmin, signUpRoutes);
router.use("/admin/categories", verifyToken, verifyAdmin, categoriesRoutes);
router.use("/admin/reviews", verifyToken, verifyAdmin, reviewsRoutes);

// =================== auth routes =====================

router.use("/auth", authRoutes);

export default router;
