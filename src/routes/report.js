import express from 'express'
const router = express.Router()


import { getReportView, getReportApi, getRevenueAndProfitApi, getAllTransactionsController } from '../controllers/report.Controller.js'

import { requireLogin, checkUserPermission } from '../middlewares/auth.js'

router.get('/', requireLogin, checkUserPermission, getReportView)
router.get('/data', requireLogin, checkUserPermission, getReportApi)

router.get('/revenue-profit', requireLogin, checkUserPermission, getRevenueAndProfitApi)
router.get('/transactions', requireLogin, checkUserPermission, getAllTransactionsController)

export default router