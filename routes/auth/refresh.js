import express from 'express'
import { refresh } from '../../controllers/auth.controller.js'

const router = express.Router()

router.post('/', refresh)

export default router