require('dotenv').config()
const PORT = process.env.PORT || 3000

const app = require('./app')

app.listen(PORT, () => {
    console.log("Server is live at port:",PORT);
})