import express from 'express';
import usersControllers from '../../controllers/usersControllers.js';

const router = express.Router();

// get all users
router.get("/users", usersControllers.getAllUsers);

// create one user
router.post("/users/:id", usersControllers.userCreate);

// get one user
router.get("/users/:id", usersControllers.getOneUser);

// update one user
router.patch("/users/:id", usersControllers.updateUser);

// delete one user
router.delete("/users/:id", usersControllers.deleteUser);

export default router;