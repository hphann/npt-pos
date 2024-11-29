import * as categoryService from '../services/category.Service.js'

export const listCategory = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories()
    res.render('categories/listCategory', { categories, success: req.query.success, error: req.query.error })
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy danh mục',
      error: error.message
    })
  }
}

export const addCategoryPage = (req, res) => {
  res.render('categories/addCategory')
}

export const addCategory = async (req, res) => {
  try {
    await categoryService.createCategory(req.body)
    res.redirect('/category/listCategory?success=add')
  } catch (error) {
    res.status(400).json({
      message: 'Có lỗi xảy ra khi thêm danh mục',
      error: error.message
    })
  }
}

export const editCategoryPage = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id)
    res.render('categories/editCategory', { category })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params
    await categoryService.updateCategory(id, req.body)
    res.redirect('/category/listCategory?success=edit')
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    await categoryService.deleteCategory(id)
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // Nếu là yêu cầu AJAX
      res.json({ success: true, message: 'Xóa danh mục thành công' })
    } else {
      // Nếu là yêu cầu thông thường
      res.redirect('/category/listCategory?success=delete')
    }
  } catch (error) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // Nếu là yêu cầu AJAX
      res.status(400).json({ success: false, message: error.message })
    } else {
      // Nếu là yêu cầu thông thường
      res.status(400).render('error', { message: error.message })
    }
  }
}