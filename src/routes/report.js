import express from 'express'
const router = express.Router()

import { listReport } from '../controllers/report.Controller.js'
import { requireLogin, checkUserPermission } from '../middlewares/auth.js'

router.get('/listReport', requireLogin, checkUserPermission, listReport)

export default router