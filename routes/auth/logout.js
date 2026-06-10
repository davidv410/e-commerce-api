import express from 'express'
import { db } from '../../db/db.js'
import { users } from '../../db/schema.js'
import { protect } from '../../middleware/protect.js'
import { eq } from 'drizzle-orm'

const router = express.Router()

router.post('/', protect, async (req, res) => {

    await db.update(users).set({ refreshToken: null }).where(eq(users.id, req.user.id))

    res.clearCookie('token')
    res.clearCookie('refreshToken')

    return res.status(200).json({message: "Logged out successfully"})

})

export default router