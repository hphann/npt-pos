import express from 'express';
import { createTransaction, } from '../controllers/transaction.Controller.js';

const router = express.Router();

// Định tuyến API cho thanh toán Momo
router.post('/create', createTransaction);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

export default router;