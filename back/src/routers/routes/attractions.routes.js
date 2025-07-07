import express from "express";
import attractionsController from "../../controllers/attractionsController.js";

const router = express.Router();


//Display all attractions
router.get('/', attractionsController.getAllAttractions)

// Display one attraction
router.get('/:id', attractionsController.getOneAttraction)


router.use((req, res) => {
    res.status(404).send("Sorry can't find that!");
});

export default router;