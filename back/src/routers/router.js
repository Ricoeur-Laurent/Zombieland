
import express from "express";
import homeControllers from "../controllers/homeControllers.js";


const router = express.Router();

//  Routes principales
router.get("/", homeControllers.getAllAttractions);
//signup
//login
//reservation

// sub routes
//my_reservations
//Attractions
//admin


// routes for invoices
// router.use("/invoices", invoiceRoutes);



export default router;