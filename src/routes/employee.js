import express from 'express'
const router = express.Router()
import { upload, processImage } from '../middlewares/upload.js'

import { listEmployee, addEmployeePage, addEmployee, detailEmployee, detailEmployeePage, updateEmployee, verifyAccount, updatePassword, newPassword, sendVerificationEmail, sendVerificationCode, changePassword, toggleLock } from '../controllers/employee.Controller.js'
import { requireLogin, checkUserPermission } from '../middlewares/auth.js'

router.get('/listEmployee', requireLogin, checkUserPermission, listEmployee)

router.get('/addEmployeePage', addEmployeePage)

router.post('/addEmployee', addEmployee)

router.get('/verifyAccount/:token', verifyAccount)

router.get('/detailEmployee/:id', detailEmployee)

router.put('/updateEmployee/:id', upload.single('image'), processImage, updateEmployee)

router.get('/detailEmployeePage/:id', detailEmployeePage)

router.get('/new-password', newPassword)

router.post('/update-password', updatePassword)

router.get('/sendVerificationEmail/:id', sendVerificationEmail)

router.get('/sendVerificationCode/:id', sendVerificationCode)

router.put('/changePassword/:id', changePassword)

router.post('/toggleLock/:id', toggleLock)

export default router