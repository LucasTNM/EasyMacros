import express from 'express';
import * as userController from '../controller/userController.js';
import * as metabolismController from '../controller/metabolismController.js'
import { verifyToken } from '../middleware/token.js';

const router = express.Router();

router.post('/register', userController.registerUser);
router.get('/find/:email', verifyToken, userController.getUser);
router.get('/email', verifyToken, userController.getEmail);
router.delete('/deleteUser/:email', userController.deleteUser);
router.post('/login', userController.Login);
router.post('/logout', userController.logout);
router.post('/tmbCalculator/:email', verifyToken, metabolismController.tmbCalculator);
router.post('/macros/:email', verifyToken, metabolismController.macrosCalculator);
router.post('/update/:email', verifyToken, userController.updateUser);
router.post('/sendResetCode', userController.sendResetCode);
router.post('/verifyResetCode', userController.verifyResetCode);
router.post('/createNewPassword', verifyToken, userController.createNewPassword);

export default router;