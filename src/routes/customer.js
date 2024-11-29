import express from 'express'
const router = express.Router()

import { listCustomer, addCustomer, checkPhoneNumber, viewCustomerWithOrders } from '../controllers/customer.Controller.js'
import { requireLogin, checkUserPermission } from '../middlewares/auth.js'

router.get('/listCustomer', requireLogin, listCustomer)
router.post('/addCustomer', addCustomer)
router.get('/checkPhoneNumber/:phone', checkPhoneNumber)
router.get('/viewCustomerWithOrders/:id', viewCustomerWithOrders)
export default router