import Category from '../models/category.model.js'

export const getAllCategories = async () => {
  return await Category.find().lean()
}

export const createCategory = async (categoryData) => {
  const { code, name } = categoryData

  const existingCategory = await Category.findOne({ code })
  if (existingCategory) {
    throw new Error('Danh mục đã tồn tại')
  }

  const category = new Category({ code, name })
  return await category.save()
}

export const getCategoryById = async (id) => {
  const category = await Category.findById(id).lean()
  if (!category) {
    throw new Error('Không tìm thấy danh mục')
  }
  return category
}

export const updateCategory = async (id, categoryData) => {
  const { name, code } = categoryData

  const category = await Category.findByIdAndUpdate(
    id,
    { name, code },
    { new: true, runValidators: true }
  )

  if (!category) {
    throw new Error('Không tìm thấy danh mục')
  }

  return category
}

export const deleteCategory = async (id) => {
  try {
    const result = await Category.findByIdAndDelete(id)
    if (!result) {
      throw new Error('Không tìm thấy danh mục để xóa')
    }
    return { success: true, message: 'Danh mục đã được xóa thành công', deletedCategory: result }
  } catch (error) {
    if (error.name === 'CastError') {
      throw new Error('ID danh mục không hợp lệ');
    }
    throw error // Ném lại lỗi nếu không phải là lỗi CastError
  }
}