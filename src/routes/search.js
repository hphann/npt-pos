// routes/searchRoutes.js
import express from 'express'
const router = express.Router()

import { searchController } from '../controllers/search.Controller.js';

// Route tìm kiếm sản phẩm
router.get('/search', searchController);

export default router