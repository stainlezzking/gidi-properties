const express = require("express")
const app = express()




app.set("view engine", "ejs")

app.use("/x-x", express.static("public"))

// local imports
const frontRouter = require("./Routes/frontpage")
const dashRouter = require("./Routes/dashboardget.js")

app.use("/", frontRouter)
app.use("/dashboard", dashRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log("server up and running")
})