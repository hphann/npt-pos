import express from 'express'
const router = express.Router()

import { listCategory, addCategoryPage, addCategory, editCategoryPage, editCategory, deleteCategory } from '../controllers/category.Controller.js'
import { requireLogin, checkUserPermission } from '../middlewares/auth.js'

router.get('/listCategory', requireLogin, checkUserPermission, listCategory)
router.get('/addCategoryPage', requireLogin, checkUserPermission, addCategoryPage)
router.post('/addCategory', requireLogin, checkUserPermission, addCategory)
router.get('/editCategoryPage/:id', requireLogin, checkUserPermission, editCategoryPage)
router.put('/editCategory/:id', requireLogin, checkUserPermission, editCategory)
router.delete('/deleteCategory/:id', requireLogin, checkUserPermission, deleteCategory)

export default router