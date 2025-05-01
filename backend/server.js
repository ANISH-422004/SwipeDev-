const env = require("dotenv").config()
const http = require("http")
const app = require("./src/app")
const config = require("./src/config/config")
const  initializeSocket  = require("./src/utils/socket")

const server = http.createServer(app)

initializeSocket(server)


//dbConnection
const {connectDB} = require("./src/db/db")
connectDB()
//serverStart
server.listen(config.PORT, () => {
    console.log(`Server is running on port XXXX `)
})

