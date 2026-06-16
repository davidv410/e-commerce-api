import 'dotenv/config'
import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

export const accessToken = (id,role) => { return jwt.sign({ id: id, role: role }, accessTokenSecret, { expiresIn: '1h' }) }
export const refreshToken = (id,role) => { return jwt.sign({ id: id, role: role }, refreshTokenSecret, { expiresIn: '7d' }) }