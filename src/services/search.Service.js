// services/searchService.js
import Product from '../models/product.model.js';

// Hàm tìm kiếm sản phẩm theo từ khóa
export const searchProducts = async(searchTerm) => {
    try {
        // Tìm kiếm trong MongoDB và giới hạn số kết quả trả về
        const products = await Product.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { barcode: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ]
        }).limit(20);

        return products;
    } catch (error) {
        console.error('Error while searching for products:', error);
        throw new Error('Không thể tìm kiếm sản phẩm, vui lòng thử lại sau.');
    }
};