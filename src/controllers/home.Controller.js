import Account from '../models/account.model.js'
import { upload } from '../middlewares/upload.js'
import Order from '../models/order.model.js'
import OrderDetail from '../models/orderDetail.model.js'
import bcrypt from 'bcryptjs'

export const home = async(req, res) => {
    //Tổng số hóa đơn
    const totalOrders = await Order.countDocuments()

    //Tổng doanh thu
    const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])
    const totalRevenueResult = totalRevenue[0] ?.total || 0

    //Tổng sản phẩm đã bán
    const totalProductsSoldResult = await OrderDetail.aggregate([
        { $group: { _id: null, total: { $sum: '$quantity' } } }
    ])
    const totalProductsSold = totalProductsSoldResult[0] ?.total || 0


    res.render('index', { user: req.session.user, totalOrders, totalRevenue: totalRevenueResult, totalProductsSold })
}

// Đăng xuất chuyển đến trang login
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/')
        }
        res.render('pages/login', { layout: 'loginLayout' })
    })
}

// Đăng nhập chuyển đến trang login
export const loginPage = (req, res) => {
    res.render('pages/login', { layout: 'loginLayout' })
}

export const login = async(req, res) => {
    const { username, password } = req.body

    try {
        if (!username || !password) {
            return res.render('pages/login', { layout: 'loginLayout', error: 'Vui lòng nhập đầy đủ thông tin' })
        }

        const account = await Account.findOne({ username })

        if (!account) {
            return res.render('pages/login', { layout: 'loginLayout', error: 'Tài khoản không tồn tại' })
        }

        if (account.isLocked) {
            return res.render('pages/login', { layout: 'loginLayout', error: 'Tài khoản của bạn đã bị khóa' })
        }

        const isMatch = await bcrypt.compare(password, account.password)

        if (!isMatch) {
            return res.render('pages/login', { layout: 'loginLayout', error: 'Mật khẩu không chính xác' })
        }

        // Lưu thông tin người dùng vào session
        req.session.user = {
            id: account._id,
            email: account.email,
            avatar: account.avatar,
            fullName: account.fullName,
            permissions: account.permissions,
            isFirstLogin: account.isFirstLogin,
            isActive: account.isActive // Thêm isActive vào session
        }

        // Kiểm tra lần đăng nhập đầu tiên
        if (account.isFirstLogin) {
            return res.redirect('/employee/new-password')
        }

        res.redirect('/')
    } catch (error) {
        res.render('pages/login', { layout: 'loginLayout', error: 'Đã xảy ra lỗi, vui lòng thử lại' })
    }
}