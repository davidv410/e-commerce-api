import 'dotenv/config'
import express from 'express'
import { protect } from '../middleware/protect.js';

import { checkout } from '../controllers/stripe.controller.js';

const router = express.Router()

router.post('/', protect, checkout);

export default router