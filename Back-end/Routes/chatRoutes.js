import express from "express";
import * as chatController from "../controller/chatController.js";

const router = express.Router();

router.post('/generateDiet/:email', chatController.GenerateDiet);
router.get('/getDiet/:email', chatController.getDiet);
router.get('/getCredits', chatController.getCredits);

export default router;