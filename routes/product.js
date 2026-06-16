import express from 'express'
import { protect } from '../middleware/protect.js'
import { upload } from '../middleware/upload.js'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'

const router = express.Router()

// http://localhost:5000/product?search=monster&minPrice=1&maxPrice=5&page=1&limit=20

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', protect, upload.array('images', 10), createProduct)
router.patch('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

export default router