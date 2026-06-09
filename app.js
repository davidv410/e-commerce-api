import 'dotenv/config'
import express from 'express'
import signup from './routes/signup.js'

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())

app.use('/sign-up', signup)

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
})