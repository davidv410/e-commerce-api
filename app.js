import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import signup from './routes/signup.js'
import login from './routes/login.js'
import refresh from './routes/refresh.js'

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use('/sign-up', signup)
app.use('/login', login)
app.use('/refresh', refresh)

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
})