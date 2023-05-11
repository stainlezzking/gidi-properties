const express = require("express")
const router = express.Router()



router.get("/", function(req,res){
    res.render("index")
})
router.get("/listing", function(req,res){
    // '/houses' , 'lands' , 'shops' , 
    res.render("listing")
})

router.get("/details", function(req,res){
    res.render("details")
})

router.get("/login", function(req,res){
    res.render("login.ejs")
})


module.exports = router