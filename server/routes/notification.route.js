import express from "express";
import { body } from "express-validator";

import notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/subscribe', notificationController.subscribe);

export default router;