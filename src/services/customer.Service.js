import Customer from '../models/customer.model.js'
import Order from '../models/order.model.js'
import { getOrdersByCustomerId } from './Order.Service.js'

export const getCustomersWithOrderCount = async () => {
  const customers = await Customer.find().sort({ createdAt: -1 })
  return Promise.all(customers.map(async (customer) => {
    const orderCount = await Order.countDocuments({ customer: customer._id })
    return {
      ...customer.toObject(),
      orderCount
    }
  }))
}

export const createCustomer = async (customerData) => {
  const newCustomer = new Customer(customerData)
  return newCustomer.save()
}

export const findCustomerByPhone = async (phone) => {
  return Customer.findOne({ phone })
}

export const getCustomerWithOrders = async (customerId) => {
  try {
    const customerDoc = await Customer.findById(customerId)
    if (!customerDoc) {
      return { success: false, message: 'Không tìm thấy khách hàng' }
    }

    const customer = customerDoc.toObject()

    // Sử dụng hàm mới để lấy thông tin chi tiết đơn hàng
    const orders = await getOrdersByCustomerId(customerId)

    return { success: true, customer, orders }
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi lấy thông tin' }
  }
}