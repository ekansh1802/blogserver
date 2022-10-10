import express from 'express';
import { registerUser, loginUser, getUser, updateUser, deleteUser } from '../controllers/users.js';

const router = express.Router();

//To register a User
router.post('/register', registerUser);

//To login a User
router.post('/login', loginUser);

//To get a user by id
router.get('/:id', getUser);

//To update a user by id
router.put('/update/:id', updateUser);

//To delete a User by id
router.delete('/delete/:id', deleteUser);

export default router;