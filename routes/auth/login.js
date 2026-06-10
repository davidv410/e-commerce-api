import express from 'express'
import { loginSchema } from '../../validation/validation.js'
import { db } from '../../db/db.js'
import { users } from '../../db/schema.js'
import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { accessToken, refreshToken } from '../../utils/generateToken.js'

const router = express.Router()

router.get('/', (req, res) => {
    console.log(req.cookies)
})

router.post('/', async (req, res) => {

    try{
        const result = loginSchema.safeParse(req.body)
    
        if(!result.success){
            return res.status(400).json({ messag: result.error.issues })
        }
    
        const { email, password } = result.data

        const [user] = await db.select().from(users).where(eq(users.email, email))

        if(!user){ return res.status(404).json({ messag: 'User not found' }) }

        const compare = await bcrypt.compare(password, user.password)

        if(!compare){ return res.status(401).json({ message: 'Invalid credentials' })}

        const token = accessToken(user.id)
        const refresh = refreshToken(user.id)

        await db.update(users).set({ refreshToken: refresh }).where(eq(users.id, user.id))

        res.cookie('token', token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'None', 
                maxAge: 900000  //15min
        })

        res.cookie('refreshToken', refresh, {
                httpOnly: true,
                secure: true, 
                sameSite: 'None', 
                maxAge: 604800000  //7h
        })

        res.status(200).json({ message: 'User successfully logged in!' })
        
    }catch(error){
        console.log(error.message)

        return res.status(500).json({ messsage: 'Server error' })
    }
})

export default router