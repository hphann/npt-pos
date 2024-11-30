import * as customerService from '../services/customer.service.js'

export const listCustomer = async(req, res) => {
    try {
        const customers = await customerService.getCustomersWithOrderCount()
        res.render('customers/listCustomer', { customers })
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error)
        res.status(500).render('error', { message: 'Có lỗi xảy ra khi lấy danh sách khách hàng' })
    }
}

export const addCustomer = async(req, res) => {
    try {
        const { customerName, address, phone } = req.body
        const newCustomer = await customerService.createCustomer({
            name: customerName,
            address,
            phone
        })
        res.status(201).json({ message: 'Khách hàng đã được tạo thành công', customer: newCustomer })
    } catch (error) {
        res.status(400).json({ message: 'Không thể tạo khách hàng', error: error.message })
    }
}

export const checkPhoneNumber = async(req, res) => {
    try {
        const { phone } = req.params
        const customer = await customerService.findCustomerByPhone(phone)
        if (customer) {
            res.status(200).json({ exists: true, customer })
        } else {
            res.status(200).json({ exists: false })
        }
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi kiểm tra số điện thoại', error: error.message })
    }
}

export const viewCustomerWithOrders = async(req, res) => {
    const customerId = req.params.id
    const result = await customerService.getCustomerWithOrders(customerId)
    if (result.success) {
        res.render('customers/listOrderCustomer', { customer: result.customer, orders: result.orders })
    } else {
        res.status(404).render('error', { message: result.message })
    }
}