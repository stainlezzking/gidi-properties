const express = require("express")
const router = express.Router()

const {ACCS, APARTMENTS} = require("../modules/db")

router.use(async function(req,res,next){
    res.locals.activeurl = req.url;
    res.locals.user = {}
    if(req.url == "/"){
        res.locals.count =  await APARTMENTS.find().count()
        res.locals.accounts =  await ACCS.find().count()
        res.locals.lands =  await ACCS.find().count()
    }
    next()
})

router.get("/", function(req,res){
    res.render("private/dashboard.ejs")
})

router.get("/newproperty", function(req,res){
    res.render("private/newproperty")
})

router.get("/profile", function(req,res){
    res.render("private/profile")
})

router.get("/myprops", function(req,res){
    res.render("private/myproperties")
})

router.get("/manageaccounts", function(req,res){
    res.render("private/manageaccounts")
})

router.get("/userListing", function(req,res){
    res.render("private/userListings")
})


module.exports = router