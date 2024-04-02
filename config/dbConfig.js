const mongoose = require('mongoose')

const MONGODB_URL = process.env.MONGODB_URL

const connectDB = () => {
    mongoose
        .connect(MONGODB_URL)
        .then((conn) => console.log('Connected to database:', conn.connection.host))
        .catch((e) => console.log(e.message))
}

module.exports = connectDB
