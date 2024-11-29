import express from 'express'
const router = express.Router()
import { upload, processImage } from '../middlewares/upload.js'
import { listProduct, addProductPage, addProduct, editProductPage, editProduct, deleteProduct } from '../controllers/product.Controller.js'
import { requireLogin, checkUserPermission } from '../middlewares/auth.js'

router.get('/listProduct', requireLogin, checkUserPermission, listProduct)
router.get('/addProductPage', requireLogin, checkUserPermission, addProductPage)
router.post('/addProduct', requireLogin, checkUserPermission, upload.single('image'), processImage, addProduct)
router.get('/editProductPage/:id', requireLogin, checkUserPermission, editProductPage)
router.put('/editProduct/:id', requireLogin, checkUserPermission, upload.single('image'), processImage, editProduct)
router.delete('/deleteProduct/:id', requireLogin, checkUserPermission, deleteProduct)
export default router