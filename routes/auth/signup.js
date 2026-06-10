import express from 'express'
import {db} from '../../db/db.js'
import { users } from '../../db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { registerSchema } from '../../validation/validation.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('hi')
})

router.post('/', async (req, res) => {
    try{   
        
        const result = registerSchema.safeParse(req.body)
        
        if(!result.success) {
            return res.status(400).json({ message: result.error.issues })
        }
        
        const { name, email, password } = result.data

        const userExist = await db.select().from(users).where(eq(users.email, email)).limit(1)

        if(userExist.length > 0){ return res.status(409).json({ message: 'Email already in use' }) }

        const hash = await bcrypt.hash(password, 10)

        const [user] = await db.insert(users).values({
            name,
            email,
            password: hash
        }).returning({ id: users.id, email: users.email, name: users.name })

    
        res.status(200).json({ user })
    }catch(error){
        res.status(500).json({ message: 'server error' })
    }
})

export default router