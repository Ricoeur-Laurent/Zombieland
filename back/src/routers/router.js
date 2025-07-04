
import express from "express";
import homeControllers from "../controllers/homeControllers.js";
import adminReservationsRoutes from "./routes/adminReservations.routes.js"
import attractionsRoutes from "./routes/attractions.routes.js"



const router = express.Router();

//  Routes principales
router.get("/", homeControllers.getAllAttractions);
//signup

//login

// ================= Attractions routes ==============================
router.use('/attractions', attractionsRoutes)

// ================= Admin routes ====================================
// routes for reservations
router.use('/admin/reservations', adminReservationsRoutes)



//Routes for admin


// routes for invoices
// router.use("/invoices", invoiceRoutes);



export default router;