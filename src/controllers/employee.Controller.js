import * as employeeService from '../services/employee.Service.js'

export const listEmployee = async(req, res) => {
    try {
        const employees = await employeeService.getAllEmployees()
        res.render('employees/listEmployee', {
            employees,
            user: req.session.user,
            success: req.query.success,
            error: req.query.error
        })
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy danh sách nhân viên',
            error: error.message
        })
    }
}


export const addEmployeePage = (req, res) => {
    try {
        res.render('employees/addEmployee')
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm nhân viên',
            error: error.message
        })
    }
}

export const addEmployee = async(req, res) => {
    try {
        await employeeService.createEmployee(req.body)
        res.redirect('/employee/listEmployee?success=add')
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm nhân viên',
            error: error.message
        })
    }
}

export const verifyAccount = async(req, res) => {
    try {
        await employeeService.verifyAccount(req.params.token)
        res.redirect('/loginPage')
    } catch (error) {
        res.status(400).send('Liên kết không hợp lệ hoặc đã hết hạn')
    }
}

export const detailEmployee = async(req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id)
        console.log('employee', employee)
        const orders = await employeeService.getEmployeeOrders(req.params.id)
        console.log('orders', orders)
        res.render('employees/detailEmployee', {
            employee,
            orders
        })
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy thông tin nhân viên',
            error: error.message
        })
    }
}

export const updateEmployee = async(req, res) => {
    try {
        const updatedEmployee = await employeeService.updateEmployee(
            req.params.id,
            req.body,
            req.file,
            req.body.currentImage
        )

        // Update session if user updates their own info
        if (req.session.user && req.session.user.id === req.params.id) {
            req.session.user = {
                id: updatedEmployee._id,
                avatar: updatedEmployee.avatar,
                fullName: updatedEmployee.fullName,
                email: updatedEmployee.email,
                permissions: updatedEmployee.permissions
            }
        }

        res.redirect(`/employee/detailEmployee/${req.params.id}`)
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi cập nhật thông tin nhân viên',
            error: error.message
        })
    }
}

export const detailEmployeePage = async(req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id)
        res.render('employees/detailEmployeePage', { employee })
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy thông tin nhân viên',
            error: error.message
        })
    }
}


export const newPassword = (req, res) => {
    res.render('pages/newPass', { layout: 'loginLayout' })
}

export const updatePassword = async(req, res) => {
    const { newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        return res.render('pages/newPass', { layout: 'loginLayout', error: 'Mật khẩu không khớp' })
    }

    try {
        await employeeService.updatePassword(req.session.user.id, newPassword)
        req.session.user.isFirstLogin = false
        req.session.user.isActive = true
        res.redirect('/')
    } catch (error) {
        res.status(500).send('Có lỗi xảy ra khi cập nhật mật khẩu')
    }
}

export const sendVerificationEmail = async(req, res) => {
    try {
        await employeeService.sendVerificationEmail(req.params.id)
        res.redirect('/employee/listEmployee?success=sendEmail')
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi gửi email xác thực',
            error: error.message
        })
    }
}

export const sendVerificationCode = async(req, res) => {
    try {
        const response = await employeeService.sendVerificationCode(req.params.id, req.session)
        res.json(response)
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi gửi mã xác nhận', error: error.message })
    }
}

export const changePassword = async(req, res) => {
    const { oldPassword, newPassword, confirmCode } = req.body

    try {
        const response = await employeeService.changePassword(
            req.params.id,
            oldPassword,
            newPassword,
            confirmCode,
            req.session
        )
        res.json(response)
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi đổi mật khẩu', error: error.message })
    }
}

export const toggleLock = async(req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id)
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' })
        }
        const result = await employeeService.updateEmployeeLockStatus(req.params.id, !employee.isLocked)
        res.json(result)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi thay đổi trạng thái khóa', error: error.message })
    }
}