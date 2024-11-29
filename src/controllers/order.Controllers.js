import { upload } from '../middlewares/upload.js'

import {
  createOrder,
  createOrderArray,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder as deleteOrderService,
  deleteOrdersByIds,
  getOrderDetail
} from '../services/Order.Service.js'

export const postCreateOrder = async (req, res) => {
  const { customer, employee, totalPrice, orderDate, status } = req.body
  const orderData = {
    customer,
    employee,
    totalPrice,
    orderDate,
    status
  }
  console.log('check :', orderData)

  let order = await createOrder(orderData)

  return res.status(200).json({
    EC: 0,
    data: order
  })
}

export const postCreateArrayOrder = async (req, res) => {
  const orders = await createOrderArray(req.body.orders)

  if (orders) {
    return res.status(200).json({
      EC: 0,
      data: orders
    })
  } else {
    return res.status(200).json({
      EC: -1,
      data: orders
    })
  }
}

export const getAllOrdersController = async (req, res) => {
  const limit = req.query.limit
  const page = req.query.page
  const queryString = req.query

  const result = await getAllOrders(limit, page, queryString)

  if (result) {
    // Render ra giao diện với danh sách đơn hàng
    return res.render('orders/listOrder', { orders: result })
  } else {
    // Xử lý lỗi nếu không lấy được danh sách đơn hàng
    return res.status(500).render('error', { message: 'Lỗi khi lấy danh sách đơn hàng' })
  }
}

export const getOrderByIdController = async (req, res) => {
  const { id } = req.params

  const result = await getOrderById(id)

  if (result) {
    return res.status(200).json({
      EC: 0,
      data: result
    })
  } else {
    return res.status(404).json({
      EC: -1,
      message: 'Order not found'
    })
  }
}

export const putUpdateOrder = async (req, res) => {
  const { id, customer, employee, totalPrice, orderDate, status } = req.body
  const updateData = { customer, employee, totalPrice, orderDate, status }

  const result = await updateOrder(id, updateData)

  return res.status(200).json({
    EC: 0,
    data: result
  })
}

export const deleteOrder = async (req, res) => {
  const { id } = req.body

  const result = await deleteOrderService(id)

  return res.status(200).json({
    EC: 0,
    data: result
  })
}

export const deleteOrdersByIdsController = async (req, res) => {
  const ids = req.body.orderIds

  const result = await deleteOrdersByIds(ids)

  return res.status(200).json({
    EC: 0,
    data: result
  })
}

export const getOrderDetailController = async (req, res) => {
  try {
    const orderInfo = await getOrderDetail(req.params.id)
    if (!orderInfo) {
      return res.status(404).json({
        EC: 1,
        message: 'Đơn hàng không tồn tại'
      })
    }

    // Gửi thông tin lên giao diện
    res.render('orders/orderDetail', { orderInfo: orderInfo })
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error)
    return res.status(500).json({
      EC: -1,
      message: 'Lỗi khi lấy chi tiết đơn hàng'
    });
  }
}

export const addOrder = (req, res) => {
  res.render('orders/addOrder')
}