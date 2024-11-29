import * as transactionService from '../services/transaction.Service.js';

const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
}



// Lấy tất cả giao dịch thanh toán
export const getAllTransactions = async(req, res) => {
    try {
        const payments = await transactionService.getAllTransactions();
        sendResponse(res, 200, true, 'Lấy danh sách giao dịch thành công', payments);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}

// Render trang giao dịch thanh toán
export const transactionPage = async(req, res) => {
    try {
        const payments = await transactionService.getAllTransactions();
        res.render('transaction/transactionPage', { payments });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy giao dịch thanh toán',
            error: error.message
        })

    }
}

// Tạo mới giao dịch thanh toán
export const createTransaction = async(req, res) => {
    const { orderId, paymentDate, receive, remain } = req.body;

    try {
        const newPayment = await transactionService.createTransaction(orderId, paymentDate, receive, remain);
        sendResponse(res, 201, true, 'Tạo giao dịch thanh toán thành công', newPayment);
    } catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

// Lấy thông tin giao dịch thanh toán theo ID
export const getTransactionById = async(req, res) => {
    const { transactionId } = req.params;

    try {
        const result = await transactionService.getTransactionById(transactionId);
        if (result.success) {
            sendResponse(res, 200, true, 'Lấy giao dịch thanh toán thành công', result.payment);
        } else {
            sendResponse(res, 404, false, result.message);
        }
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}

// Cập nhật giao dịch thanh toán
export const updateTransaction = async(req, res) => {
    const { transactionId } = req.params;
    const updateData = req.body;

    try {
        const result = await transactionService.updateTransaction(transactionId, updateData);
        if (result.success) {
            sendResponse(res, 200, true, 'Cập nhật giao dịch thanh toán thành công', result.updatedPayment);
        } else {
            sendResponse(res, 404, false, result.message);
        }
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}

// Xóa giao dịch thanh toán
export const deleteTransaction = async(req, res) => {
    const { transactionId } = req.params;

    try {
        const result = await transactionService.deleteTransaction(transactionId);
        if (result.success) {
            sendResponse(res, 200, true, result.message);
        } else {
            sendResponse(res, 404, false, result.message);
        }
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}