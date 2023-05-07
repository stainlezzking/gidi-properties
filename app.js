const express = require("express")
const app = express()




app.set("view engine", "ejs")

app.use("/x-x", express.static("public"))

// local imports
const frontRouter = require("./Routes/frontpage")

app.use("/", frontRouter)


app.get("/addproperty", function(req,res){
    res.render("newproperty")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log("server up and running")
})