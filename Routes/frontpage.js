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

router.get("/auth/login", function(req,res){
    res.render("auth.ejs", {login : true})
})

router.get("/auth/register", function(req,res){
    res.render("auth.ejs", {login : false})
})



module.exports = router