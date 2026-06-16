import express from 'express'
import { db } from '../db/db.js'
import { cart } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { protect } from '../middleware/protect.js'
import { cartItems } from '../db/schema.js'
import { product } from '../db/schema.js'
import { getCart, addToCart, updateQuantity, removeFromCart } from '../controllers/cart.controller.js'

const router = express.Router()

router.get('/', protect, getCart)
router.post('/', protect, addToCart)
router.patch('/product/:id', protect, updateQuantity)
router.delete('/product/:id', protect, removeFromCart)

export default router