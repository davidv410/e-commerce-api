import 'dotenv/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { eq, and } from 'drizzle-orm'

import { db } from '../db/db.js'
import { users } from '../db/schema.js'
import { loginSchema, registerSchema } from '../validation/validation.js'
import { accessToken, refreshToken } from '../utils/generateToken.js'


export const login = async (body) => {
    const result = loginSchema.safeParse(body)
    if(!result.success){ return { status: 400, message: result.error.issues } }

    const { email, password } = result.data

    const [user] = await db.select().from(users).where(eq(users.email, email))
    if(!user){ return { status: 404, message: 'User not found' } }

    const compare = await bcrypt.compare(password, user.password)
    if(!compare){ return { status: 401, message: 'Invalid credentials' }}

    const token = accessToken(user.id, user.role, user.email)
    const refresh = refreshToken(user.id, user.role, user.email)
    
    await db.update(users).set({ refreshToken: refresh }).where(eq(users.id, user.id))
    
    return { status: 200, message: 'User successfully logged in!', token, refresh }
}

export const refresh = async (cookies) => {
    const refreshToken = cookies.refreshToken
    if(!refreshToken){ return { status: 400, message: 'No refresh token' } }

    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const [user] = await db.select().from(users).where(eq(users.id, decode.id))
    if(!user || user.refreshToken !== refreshToken){ return { status: 400, message: 'Bad refresh token' }}

    const token = accessToken(user.id, user.role, user.email)

    return {status: 200, message: "Token refreshed", token }
}

export const signup = async (body) => {
    const result = registerSchema.safeParse(body)
    if(!result.success) { return { status: 400, message: result.error.issues } }
    
    const { name, email, password } = result.data

    const userExist = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if(userExist.length > 0){ return { status: 400, message: 'Email already in use' } }

    const hash = await bcrypt.hash(password, 10)

    const [user] = await db.insert(users).values({
        name,
        email,
        password: hash
    }).returning({ id: users.id, email: users.email, name: users.name })

    return { status: 200, message: user }
}

export const logout = async (id) => {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, id))
}