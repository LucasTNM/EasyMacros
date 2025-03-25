import express from 'express';
import * as userController from '../controller/userController.js';
import * as metabolismController from '../controller/metabolismController.js'
import { verifyToken } from '../middleware/token.js';

const router = express.Router();

router.post('/register', userController.registerUser);
router.get('/find/:email', verifyToken, userController.getUser);
router.delete('/deleteUser/:email', userController.deleteUser);
router.post('/login', userController.Login);
router.post('/tmbCalculator/:email', metabolismController.tmbCalculator);
router.post('/macros/:email', metabolismController.macrosCalculator);
router.post('/update/:email', userController.updateUser);
router.post('/sendResetCode', userController.sendResetCode);
router.post('/verifyResetCode', userController.verifyResetCode);
router.post('/createNewPassword/:token', userController.createNewPassword);

export default router;