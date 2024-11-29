import Payment from "../models/payment.model.js";


// Lấy tất cả giao dịch thanh toán
export const getAllTransactions = async() => {
    try {
        return await Payment.find().sort({ paymentDate: -1 });
    } catch (error) {
        throw new Error('Có lỗi khi lấy danh sách giao dịch thanh toán: ' + error.message);
    }
}

// Tạo mới giao dịch thanh toán
export const createTransaction = async(orderId, paymentDate, receive, remain) => {
    try {
        if (!orderId || !paymentDate || receive === undefined || remain === undefined) {
            throw new Error('Thiếu thông tin giao dịch');
        }

        const payment = new Payment({
            orderId,
            paymentDate,
            receive,
            remain
        });

        await payment.save();
        return payment;
    } catch (error) {
        throw new Error('Lỗi khi tạo giao dịch thanh toán: ' + error.message);
    }
}

// Lấy giao dịch thanh toán theo ID
export const getTransactionById = async(transactionId) => {
    try {
        const payment = await Payment.findById(transactionId);
        if (!payment) {
            return { success: false, message: 'Không tìm thấy giao dịch' };
        }
        return { success: true, payment };
    } catch (error) {
        return { success: false, message: 'Có lỗi xảy ra khi lấy thông tin giao dịch: ' + error.message };
    }
}

// Cập nhật giao dịch thanh toán
export const updateTransaction = async(transactionId, updateData) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(transactionId, updateData, { new: true });
        if (!updatedPayment) {
            return { success: false, message: 'Không tìm thấy giao dịch để cập nhật' };
        }
        return { success: true, updatedPayment };
    } catch (error) {
        return { success: false, message: 'Có lỗi xảy ra khi cập nhật giao dịch: ' + error.message };
    }
}

// Xóa giao dịch thanh toán
export const deleteTransaction = async(transactionId) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(transactionId);
        if (!deletedPayment) {
            return { success: false, message: 'Không tìm thấy giao dịch để xóa' };
        }
        return { success: true, message: 'Giao dịch đã được xóa thành công' };
    } catch (error) {
        return { success: false, message: 'Có lỗi xảy ra khi xóa giao dịch: ' + error.message };
    }
}