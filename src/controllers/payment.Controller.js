import * as momoService from '../services/momo.Service.js';

// Controller to handle payment creation request
export async function createPayment(req, res) {
    try {
        // Tạo yêu cầu thanh toán từ MoMo
        const paymentResult = await momoService.createPaymentRequest();
        res.status(200).json(paymentResult); // Trả kết quả từ MoMo API
    } catch (error) {
        res.status(500).json({ message: error.message }); // Trả lỗi nếu có
    }
}

// Controller to handle callback from MoMo after payment
export async function callbackPayment(req, res) {
    try {
        // Xử lý callback trả về từ MoMo (có thể là thanh toán thành công hoặc thất bại)
        const callbackData = req.body; // Dữ liệu callback từ MoMo gửi đến
        const paymentResult = await momoService.handleCallback(callbackData); // Xử lý callback
        res.status(200).json(paymentResult); // Trả kết quả từ xử lý callback
    } catch (error) {
        res.status(500).json({ message: error.message }); // Trả lỗi nếu có
    }
}