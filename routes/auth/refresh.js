import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../../db/db.js'
import { users } from '../../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { accessToken } from '../../utils/generateToken.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken
        
        if(!refreshToken){ return res.status(401).json({ message: 'No refresh token' }) }
    
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const [user] = await db.select().from(users).where(eq(users.id, decode.id))

        if(!user || user.refreshToken !== refreshToken){ return res.status(403).json({ message: 'Bad refresh token' })}

        const token = accessToken(user.id)

        res.cookie('token', token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'None', 
                maxAge: 900000  //15min
        })

        res.status(200).json({ message: "Token refreshed" })

    }catch(error){
        return res.status(500).json({ message: 'Server error' })
    }
})

export default router