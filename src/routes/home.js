import express from 'express'
const router = express.Router()

import { home, logout, loginPage, login } from '../controllers/home.Controller.js'
import { requireLogin, ensurePasswordUpdated, checkUserPermission } from '../middlewares/auth.js'

router.get('/', requireLogin, ensurePasswordUpdated, checkUserPermission, home)

router.get('/logout', logout)

router.get('/loginPage', loginPage)

router.post('/login', login)

export default router