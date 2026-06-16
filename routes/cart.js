import express from 'express'
import { protect } from '../middleware/protect.js'
import { getCart, addToCart, updateQuantity, removeFromCart } from '../controllers/cart.controller.js'

const router = express.Router()

router.get('/', protect, getCart)
router.post('/', protect, addToCart)
router.patch('/product/:id', protect, updateQuantity)
router.delete('/product/:id', protect, removeFromCart)

export default router