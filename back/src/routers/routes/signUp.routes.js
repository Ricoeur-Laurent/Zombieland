import express from 'express';
import usersControllers from '../../controllers/usersControllers.js';

const router = express.Router();

// Get all users
router.get('/', usersControllers.getAllUsers);

// Create one user
router.post('/', usersControllers.userCreate);

// Get one user
router.get('/:id', usersControllers.getOneUser);

// Update one user
router.patch('/:id', usersControllers.updateUser);

// Delete one user
router.delete('/:id', usersControllers.deleteUser);

export default router;
