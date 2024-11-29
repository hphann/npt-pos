import Product from '../models/product.model.js'
import Category from '../models/category.model.js'
import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'
import OrderDetail from '../models/orderDetail.model.js'

const unlink = promisify(fs.unlink)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getAllProducts = async () => {
  return await Product.find().lean()
}

export const getAllCategories = async () => {
  return await Category.find().lean()
}

export const createProduct = async (productData, file) => {
  const { barcode, name, category, importPrice, retailPrice, quantity } = productData
  let imagePath = file ? file.path : ''

  const existingProduct = await Product.findOne({ barcode })
  if (existingProduct) {
    throw new Error('Mã sản phẩm đã tồn tại')
  }

  const newProduct = new Product({
    barcode,
    name,
    category,
    importPrice: Number(importPrice),
    retailPrice: Number(retailPrice),
    quantity: Number(quantity),
    image: imagePath
  })

  return await newProduct.save()
}

export const getProductById = async (id) => {
  return await Product.findById(id).lean()
}

export const updateProduct = async (id, productData, file, currentImage) => {
  const { barcode, name, category, importPrice, retailPrice, quantity } = productData
  let imagePath = currentImage

  if (file) {
    imagePath = file.path
    if (currentImage && !currentImage.includes('default-product')) {
      const oldImagePath = path.join(process.cwd(), 'public', currentImage.replace(/^\//, ''))
      await unlink(oldImagePath).catch(err => console.error('Không thể xóa ảnh cũ:', err))
    }
  }

  const updateData = {
    barcode,
    name,
    category,
    importPrice: parseFloat(importPrice),
    retailPrice: parseFloat(retailPrice),
    quantity: parseInt(quantity, 10),
    image: imagePath
  }

  return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
}

export const deleteProduct = async (id) => {
  try {
    // Kiểm tra xem sản phẩm có liên quan đến bất kỳ đơn hàng nào không
    const orderDetail = await OrderDetail.findOne({ productId: id });
    if (orderDetail) {
      return { success: false, message: 'Sản phẩm không thể xóa vì đã có đơn hàng tồn tại' };
    }

    // Thực hiện lệnh xóa sản phẩm từ cơ sở dữ liệu
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      return { success: true };
    } else {
      return { success: false, message: 'Không tìm thấy sản phẩm để xóa' };
    }
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return { success: false, message: 'Có lỗi xảy ra khi xóa sản phẩm' };
  }
}