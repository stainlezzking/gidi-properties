const express = require("express")
const app = express()


app.set("view engine", "ejs")

app.use("/x-x", express.static("public"))


app.get("/", function(req,res){
    res.render("index")
})
app.get("/listing", function(req,res){
    res.render("listing")
})

app.get("/details", function(req,res){
    res.render("details")
})
app.get("/addproperty", function(req,res){
    res.render("newproperty")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log("server up and running")
})