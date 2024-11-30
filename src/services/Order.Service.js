import { Order } from '../models/order.model.js'
import { Payment } from '../models/payment.model.js'
import { OrderDetail } from '../models/orderDetail.model.js'
import { Product } from '../models/product.model.js'
import aqp from 'api-query-params'

export const createOrder = async(orderData) => {
    console.log(">>>abc")
    try {
        const result = await Order.create({
            customer: orderData.customer,
            employee: orderData.employee,
            totalPrice: orderData.totalPrice,
            orderDate: orderData.orderDate,
            status: orderData.status
        })
        return result
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error)
        return null
    }
}

export const createOrderArray = async(arr) => {
    try {
        const result = await Order.insertMany(arr)
        return result
    } catch (error) {
        console.log('error', error)
        return null
    }
}

export const getAllOrders = async(limit, page, queryString) => {
    try {
        let result = null
        const { filter } = aqp(queryString)
        if (limit && page) {
            let offset = (page - 1) * limit
            result = await Order.find(filter)
                .populate('customer employee')
                .skip(offset)
                .limit(limit)
                .lean() // Sử dụng lean() để trả về đối tượng JavaScript thuần túy
                .exec()
        } else {
            result = await Order.find(filter)
                .populate('customer employee')
                .lean() // Sử dụng lean() để trả về đối tượng JavaScript thuần túy
                .exec()
        }
        // Giả sử bạn có một hàm để lấy thông tin thanh toán
        for (let order of result) {
            const payment = await Payment.findOne({ orderId: order._id }).lean()
            order.payment = payment || { receive: 0, remain: 0 }
        }
        return result
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error)
        return null
    }
}

export const getOrderById = async(orderId) => {
    try {
        return await Order.findById(orderId).populate('customer employee').exec()
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error)
        return null
    }
}

export const updateOrder = async(orderId, updateData) => {
    try {
        const result = await Order.findByIdAndUpdate(orderId, updateData, { new: true })
        return result
    } catch (error) {
        console.error('Lỗi khi cập nhật đơn hàng:', error)
        return null
    }
}

export const deleteOrder = async(orderId) => {
    try {
        const result = await Order.deleteById(orderId) // Mongoose Delete Plugin hỗ trợ deleteById
        return result
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error)
        return null
    }
}

export const deleteOrdersByIds = async(orderIds) => {
    try {
        const result = await Order.deleteMany({ _id: { $in: orderIds } })
        return result
    } catch (error) {
        console.error('Lỗi khi xóa các đơn hàng:', error)
        return null
    }
}

export const getOrderDetail = async(orderId) => {
    try {
        // Tìm đơn hàng
        const order = await Order.findById(orderId).populate('customer employee').lean()
        if (!order) {
            console.error('Order not found')
            return null
        }

        // Tìm chi tiết đơn hàng
        const orderDetails = await OrderDetail.find({ orderId: order._id }).lean()

        // Lấy thông tin sản phẩm cho từng chi tiết đơn hàng
        for (let detail of orderDetails) {
            const product = await Product.findById(detail.productId).lean()
            if (product) {
                detail.productName = product.name
                detail.productImage = product.image // Giả sử trường ảnh là 'image'
            } else {
                detail.productName = 'Unknown Product'
                detail.productImage = 'default-image.jpg' // Đường dẫn ảnh mặc định
            }
        }

        // Tìm thông tin thanh toán
        const payment = await Payment.findOne({ orderId: order._id }).lean()
        order.payment = payment || { receive: 0, remain: 0 }

        // Kết hợp thông tin
        const orderInfo = {
            ...order,
            details: orderDetails
        }

        return orderInfo
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        return null
    }
}

export const getOrdersByCustomerId = async(customerId) => {
    try {
        // Tìm tất cả các đơn hàng của khách hàng
        const orders = await Order.find({ customer: customerId }).populate('customer employee').lean()
        if (!orders.length) {
            console.error('No orders found for this customer')
            return []
        }

        // Lấy chi tiết cho từng đơn hàng
        const detailedOrders = await Promise.all(orders.map(async(order) => {
            const orderDetails = await OrderDetail.find({ orderId: order._id }).lean()

            for (let detail of orderDetails) {
                const product = await Product.findById(detail.productId).lean()
                if (product) {
                    detail.productName = product.name
                    detail.productImage = product.image
                } else {
                    detail.productName = 'Unknown Product'
                    detail.productImage = 'default-image.jpg'
                }
            }

            const payment = await Payment.findOne({ orderId: order._id }).lean()
            order.payment = payment || { receive: 0, remain: 0 }

            return {
                ...order,
                details: orderDetails
            }
        }))

        return detailedOrders
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error)
        return []
    }
}