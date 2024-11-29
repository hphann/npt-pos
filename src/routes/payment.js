import express from 'express';
import { createPayment, callbackPayment } from '../controllers/payment.Controller.js';

const router = express.Router();

// Định tuyến API cho thanh toán Momo
router.post('/create', createPayment);

router.post('/callback', callbackPayment);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

export default router;