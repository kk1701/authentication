const express = require('express')
const authRouter = require('./routes/authRoute')
const connectDB = require('./config/dbConfig')
const cookieParser = require('cookie-parser')

const cors = require('cors')

const app = express()
connectDB()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))

app.use('/api/auth', authRouter)

app.use('/', (req, res) => {
    res.status(200).json({
        data: "JWTAuth Server"
    })
})

module.exports = app