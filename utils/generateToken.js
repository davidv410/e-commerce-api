import 'dotenv/config'
import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

export const accessToken = (id) => { return jwt.sign({ id: id }, accessTokenSecret, { expiresIn: '1h' }) }

export const refreshToken = (id) => { return jwt.sign({ id: id }, refreshTokenSecret, { expiresIn: '7d' }) }