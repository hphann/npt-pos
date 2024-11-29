// services/momo.Service.js
import axios from 'axios';
import crypto from 'crypto';

// Cấu hình MoMo
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const ipnUrl = 'https://49da-1-53-82-111.ngrok-free.app/callback';
const orderInfo = 'pay with MoMo';
const requestType = "payWithMethod";
const amount = '10000';
const orderId = partnerCode + new Date().getTime();
const requestId = orderId;
const extraData = '';

// Tạo chữ ký HMAC SHA256
function createSignature() {
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    return crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
}

// Tạo yêu cầu thanh toán
export async function createPaymentRequest() {
    const signature = createSignature();

    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: 'vi',
        requestType: requestType,
        autoCapture: true,
        extraData: extraData,
        signature: signature
    });

    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody
    };

    try {
        const result = await axios(options);
        return result.data; // Trả về kết quả thanh toán từ MoMo API
    } catch (error) {
        throw new Error('Payment creation failed: ' + error.message);
    }
}

// Hàm xử lý callback sau khi thanh toán
export async function handleCallback(callbackData) {
    // Xử lý dữ liệu callback từ MoMo, ví dụ như kiểm tra trạng thái thanh toán
    const { errorCode, message, orderId, requestId } = callbackData;

    // Kiểm tra trạng thái thanh toán và cập nhật đơn hàng
    if (errorCode === '0') {
        // Thanh toán thành công, cập nhật trạng thái đơn hàng
        // Ví dụ: cập nhật trong cơ sở dữ liệu
        return { success: true, message: 'Payment successful', orderId };
    } else {
        // Thanh toán thất bại
        return { success: false, message: 'Payment failed', orderId };
    }
}