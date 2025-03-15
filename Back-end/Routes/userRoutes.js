import express from 'express';
import * as userController from '../controller/userController.js';

const router = express.Router();

router.post('/register', userController.registerUser);
router.get('/find/:email', userController.getUser);
router.post('/login', userController.Login);

export default router;