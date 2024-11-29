import express from 'express';
import { getAllTransactions, transactionPage, createTransaction, getTransactionById, updateTransaction, deleteTransaction } from '../controllers/transaction.Controller.js';

const router = express.Router();

// Định nghĩa các routes
router.get('/transactions', getAllTransactions); // Lấy tất cả giao dịch
router.get('/transactionPage', transactionPage)
router.post('/addTransaction', createTransaction); // Tạo giao dịch mới
router.get('/transactions/:transactionId', getTransactionById); // Lấy giao dịch theo ID
router.put('/transactions/:transactionId', updateTransaction); // Cập nhật giao dịch
router.delete('/transactions/:transactionId', deleteTransaction); // Xóa giao dịch

export default router;