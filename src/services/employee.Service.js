import Account from '../models/account.model.js'
import fs from 'fs/promises'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const unlink = promisify(fs.unlink)
const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

export const getAllEmployees = async() => {
    return await Account.find({
        permissions: { $ne: 'ADMIN_PERMISSION' }
    }).lean()
}

export const createEmployee = async(employeeData) => {
    const { fullName, email } = employeeData
    const username = email.split('@')[0]
    const password = username
    const hashedPassword = await bcrypt.hash(password, 10)

    const newEmployee = new Account({
        avatar: 'https://via.placeholder.com/150',
        fullName,
        username,
        password: hashedPassword,
        email,
        permissions: ['SALESPERSON_PERMISSION'],
        isActive: false,
        isLocked: false
    })

    await newEmployee.save()

    const token = jwt.sign({ id: newEmployee._id }, process.env.JWT_SECRET, { expiresIn: '1m' })

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác thực tài khoản',
        text: `Tài khoản của bạn đã được tạo, click vào link để xác thực tài khoản: http://localhost:3000/employee/verifyAccount/${token}
    Để đăng nhập vào hệ thống, bạn cần đăng nhập bằng tài khoản mặc định: ${username} và mật khẩu: ${password}
    Vui lòng đổi mật khẩu sau khi đăng nhập!
    `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Lỗi gửi email: ', error)
        } else {
            console.log('Đã gửi email: ', info.response)
        }
    })

    return newEmployee
}

export const getEmployeeById = async(id) => {
    return await Account.findById(id).lean()
}

export const updateEmployeeLockStatus = async(id, isLocked) => {
    const updatedEmployee = await Account.findByIdAndUpdate(id, { isLocked }, { new: true })
    return {
        success: true,
        message: isLocked ? 'Nhân viên đã bị khóa' : 'Nhân viên đã được mở khóa'
    }
}

export const updateEmployee = async(id, employeeData, file, currentImage) => {
    const { fullName, email } = employeeData
    let imagePath = currentImage

    if (file) {
        imagePath = file.path
        if (currentImage && !currentImage.includes('default-avatar')) {
            const oldImagePath = path.join(process.cwd(), 'public', currentImage.replace(/^\//, ''))
            try {
                await fs.access(oldImagePath)
                await fs.unlink(oldImagePath)
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error('Không thể xóa ảnh cũ:', err)
                }
            }
        }
    }

    const updateData = {
        avatar: imagePath,
        fullName,
        email
    }

    const updatedEmployee = await Account.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    return updatedEmployee
}

export const deleteEmployee = async(id) => {
    try {
        const result = await Account.findByIdAndDelete(id)
        if (result) {
            return { success: true }
        } else {
            return { success: false, message: 'Không tìm thấy nhân viên để xóa' }
        }
    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error)
        return { success: false, message: 'Có lỗi xảy ra khi xóa nhân viên' }
    }
}

export const verifyAccount = async(token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const employee = await Account.findById(decoded.id)

    if (!employee) {
        throw new Error('Không tìm thấy nhân viên')
    }

    employee.isFirstLogin = true
    await employee.save()

    return employee
}

export const updatePassword = async(userId, newPassword) => {
    const account = await Account.findById(userId)

    if (!account) {
        throw new Error('Không tìm thấy tài khoản')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    account.password = hashedPassword
    account.isFirstLogin = false
    account.isActive = true
    await account.save()

    return account
}

export const sendVerificationEmail = async(id) => {
    const employee = await Account.findById(id)

    if (!employee) {
        throw new Error('Không tìm thấy nhân viên')
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1m' })

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employee.email,
        subject: 'Xác thực tài khoản',
        text: `Tài khoản của bạn đã được tạo, click vào link để xác thực tài khoản: http://localhost:3000/employee/verifyAccount/${token}
    Để đăng nhập vào hệ thống, bạn cần đăng nhập bằng tài khoản mặc định: ${employee.username} và mật khẩu: ${employee.password}
    Vui lòng đổi mật khẩu sau khi đăng nhập!
    `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Lỗi gửi email: ', error)
        } else {
            console.log('Đã gửi email: ', info.response)
        }
    })

    return employee
}

export const sendVerificationCode = async(id, session) => {
    const account = await Account.findById(id)
    if (!account) {
        throw new Error('Không tìm thấy tài khoản')
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString()
    session.verificationCode = verificationCode

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: account.email,
        subject: 'Mã xác nhận đổi mật khẩu',
        text: `Mã xác nhận của bạn là: ${verificationCode}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Lỗi gửi email: ', error)
        } else {
            console.log('Đã gửi email: ', info.response)
        }
    })

    return { message: 'Mã xác nhận đã được gửi đến email của bạn' }
}

export const changePassword = async(id, oldPassword, newPassword, confirmCode, session) => {
    const account = await Account.findById(id)
    if (!account) {
        throw new Error('Không tìm thấy tài khoản')
    }

    if (!await bcrypt.compare(oldPassword, account.password)) {
        throw new Error('Mật khẩu cũ không đúng')
    }

    if (session.verificationCode !== confirmCode) {
        throw new Error('Mã xác nhận không đúng hoặc đã hết hạn')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    account.password = hashedPassword
    await account.save()

    delete session.verificationCode

    return { message: 'Đổi mật khẩu thành công' }
}

export const getEmployeeOrders = async(employeeId) => {
    const Order = (await
        import ('../models/order.model.js')).default
    const Payment = (await
        import ('../models/payment.model.js')).default

    const orders = await Order.find({ employee: employeeId })
        .populate('customer')
        .populate('employee')
        .sort({ orderDate: -1 })
        .lean()

    const payments = await Payment.find({
        orderId: { $in: orders.map(order => order._id) }
    }).lean()

    const ordersWithPayments = orders.map(order => {
        const orderPayment = payments.find(p => p.orderId.toString() === order._id.toString())
        return {
            ...order,
            payment: orderPayment ? {
                receive: orderPayment.receive,
                remain: orderPayment.remain,
                paymentDate: orderPayment.paymentDate
            } : {
                receive: 0,
                remain: 0
            }
        }
    })

    return ordersWithPayments
}