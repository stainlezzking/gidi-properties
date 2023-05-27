const express = require("express")
const router = express.Router()

const {ACCS, APARTMENTS, SITE} = require("../modules/db")
const { amenities } = require("../modules/utilities")

router.use(async function(req,res,next){
    res.locals.activeurl = req.url;
    try{
        if(!req.isAuthenticated()) return res.redirect("/")
        if(req.user.disabled) return res.send("Your account has been disabled, contact admin for more info")
        if(req.url == "/"){
            res.locals.count =  await APARTMENTS.find().count()
            res.locals.accounts =  await ACCS.find().count()
            res.locals.lands =  await ACCS.find().count()
        }
        if(req.url.startsWith("/newproperty") || req.url.startsWith("/newlocation") ){
            res.locals.amenities = amenities
            res.locals.division = res.locals.site.divisionfilter(d=> !d.hide)
        }
        next()

    }catch(e){
        console.log(e)
        next(e)
    }
})

router.get("/", function(req,res){
    res.render("private/dashboard.ejs")
})

router.get("/newproperty", function(req,res){
    res.render("private/newproperty")
})
router.get("/newlocation", function(req,res){
    res.render("private/newlocation")
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