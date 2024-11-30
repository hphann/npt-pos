import * as searchService from '../services/search.Service.js';


export const searchController = async(req, res) => {
    const searchTerm = req.query.q || ''; // Get search term from query string

    try {
        // Call the service to search for products
        const products = await searchService.searchProducts(searchTerm);

        // Send the result as JSON to the front-end
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi tìm kiếm sản phẩm');
    }
};