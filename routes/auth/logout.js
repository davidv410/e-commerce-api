import express from 'express'
import { logout } from '../../controllers/auth.controller.js'
import { protect } from '../../middleware/protect.js'


const router = express.Router()

router.post('/', protect, logout)

export default router