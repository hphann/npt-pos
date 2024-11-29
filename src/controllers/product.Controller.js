import * as productService from '../services/Product.Service.js'

export const listProduct = async(req, res) => {
    try {
        const products = await productService.getAllProducts()
        res.render('products/listProduct', { products, success: req.query.success, error: req.query.error })
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
            error: error.message
        })
    }
}

export const addProductPage = async(req, res) => {
    try {
        const categories = await productService.getAllCategories()
        res.render('products/addProduct', { categories })
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy danh mục',
            error: error.message
        })
    }
}

export const addProduct = async(req, res) => {
    try {
        await productService.createProduct(req.body, req.file)
        res.redirect('/product/listProduct?success=add')
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm sản phẩm',
            error: error.message
        })
    }
}

export const editProductPage = async(req, res) => {
    try {
        const { id } = req.params
        const product = await productService.getProductById(id)
        const categories = await productService.getAllCategories()
        res.render('products/editProduct', { product, categories })
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy sản phẩm',
            error: error.message
        })
    }
}

export const editProduct = async(req, res) => {
    try {
        const { id } = req.params
        const { currentImage } = req.body
        await productService.updateProduct(id, req.body, req.file, currentImage)
        res.redirect('/product/listProduct?success=edit')
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi cập nhật sản phẩm',
            error: error.message
        })
    }
}

export const deleteProduct = async(req, res) => {
    try {

        const { id } = req.params
        const result = await productService.deleteProduct(id)

        if (result.success) {
            // Gửi phản hồi JSON thành công
            res.json({ success: true, message: 'Xóa sản phẩm thành công' })
        } else {
            // Gửi phản hồi JSON thất bại
            res.status(400).json({ success: false, message: result.message })
        }
    } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu xóa sản phẩm:', error)
            // Gửi phản hồi JSON lỗi

        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa sản phẩm' })

    }
}