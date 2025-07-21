import express from "express";
import loginControllers from "../../controllers/loginControllers.js";

const router = express.Router();

// connect
router.post("/", loginControllers.getOneUser);

// Disconnect (remove cookie)
router.post("/logout", loginControllers.logout);

export default router;
