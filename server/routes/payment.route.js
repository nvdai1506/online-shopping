import express from "express";
import { body } from "express-validator";

import paymentController from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create_payment_url', paymentController.postCreatePaymentUrl);
router.get('/vnpay_return', paymentController.getVnpayReturn);
router.get('/vnpay_ipn', paymentController.getVnpayIpn);

export default router;

