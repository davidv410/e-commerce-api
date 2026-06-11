import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import signup from './routes/auth/signup.js'
import login from './routes/auth/login.js'
import logout from './routes/auth/logout.js'
import refresh from './routes/auth/refresh.js'
import product from './routes/product.js'

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use('/sign-up', signup)
app.use('/login', login)
app.use('/logout', logout)
app.use('/refresh', refresh)
app.use('/product', product)

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
})