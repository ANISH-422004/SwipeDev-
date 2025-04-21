const env = require("dotenv").config()
const app = require("./src/app")
const config = require("./src/config/config")


//dbConnection
const {connectDB} = require("./src/db/db")
connectDB()
//serverStart
app.listen(config.PORT, () => {
    console.log(`Server is running on port XXXX `)
})

