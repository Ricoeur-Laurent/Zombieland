import express from 'express';
import usersControllers from '../../controllers/usersControllers.js';
import { checkParams } from "../../middlewares/checkParams.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

// Get all users
router.get('/', verifyToken, verifyAdmin,  usersControllers.getAllUsers);

// Create one user
router.post('/', usersControllers.userCreate);

// Get one user
router.get('/:id',  verifyToken, checkParams, usersControllers.getOneUser);

// get user's password
router.patch('/pswd/:id',  verifyToken, checkParams, usersControllers.editUserPswd)

// Update one user
router.patch('/:id',  verifyToken, checkParams, usersControllers.updateUser);

// Delete one user
router.delete('/:id',  verifyToken, checkParams, usersControllers.deleteUser);

export default router;
