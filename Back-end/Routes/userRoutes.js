import express from 'express';
import * as userController from '../controller/userController.js';
import * as metabolismController from '../controller/metabolismController.js'

const router = express.Router();

router.post('/register', userController.registerUser);
router.get('/find/:email', userController.getUser);
router.post('/login', userController.Login);
router.post('/tmbCalculator/:email', metabolismController.tmbCalculator);
router.post('/macros/:email', metabolismController.macrosCalculator);

export default router;