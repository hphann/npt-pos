import express from 'express'
const routerAPI = express.Router()

import { requireLogin, checkUserPermission } from '../middlewares/auth.js'

import {
    postCreateOrder,
    postCreateArrayOrder,
    getAllOrdersController,
    getOrderByIdController,
    putUpdateOrder,
    deleteOrder,
    deleteOrdersByIdsController,
    addOrder,
    getOrderDetailController
} from '../controllers/order.Controllers.js'

// Sử dụng các hàm controller trong routes
routerAPI.post('/create', postCreateOrder)
routerAPI.post('/create-array', postCreateArrayOrder)

routerAPI.get('/', requireLogin, checkUserPermission, getAllOrdersController)

//Hai route dùng để render view tạm để xem giao diện
routerAPI.get('/addOrder', addOrder)
routerAPI.get('/orderDetail/:id', getOrderDetailController)


routerAPI.get('/:id', getOrderByIdController)
routerAPI.put('/update', putUpdateOrder)
routerAPI.delete('/delete', deleteOrder)
routerAPI.delete('/delete-many', deleteOrdersByIdsController)

export default routerAPI