import express from 'express';
import usersControllers from '../../controllers/usersControllers.js';
import { checkParams } from "../../middlewares/checkParams.js";

const router = express.Router();

// Get all users
router.get('/', usersControllers.getAllUsers);

// Create one user
router.post('/', usersControllers.userCreate);

// Get one user
router.get('/:id', checkParams, usersControllers.getOneUser);

// get user's password
router.patch('/pswd/:id', checkParams, usersControllers.editUserPswd)

// Update one user
router.patch('/:id', checkParams, usersControllers.updateUser);

// Delete one user
router.delete('/:id', checkParams, usersControllers.deleteUser);

export default router;
