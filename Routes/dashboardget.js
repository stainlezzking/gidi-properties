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
        }
        if(req.url.startsWith("/newproperty") || req.url.startsWith("/newlocation") ){
            res.locals.amenities = amenities
            res.locals.division = res.locals.site.division.filter(d=> !d.hide)
        }
        if(req.url.startsWith("/profile") && req.url.length < 20){
            // <20 so it doesnt clash with when admin checks on other users
            res.locals.user = req.user
            res.locals.ownprops = await APARTMENTS.find({postedBy : req.user._id}).lean()
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
router.get("/profile/:id", async function(req,res){
    if(!req.user.admin || req.user._id == req.params.id) return res.redirect("/dashboard/profile")
    try{
        const user = await ACCS.findById(req.params.id)
        if(!user) return res.render("404.ejs")
        user.adminaccess = true
        res.locals.user = user
        res.locals.ownprops = await APARTMENTS.find({postedBy : user._id}).lean()
       return  res.render("private/profile")
    }catch(e){
        console.log(e)
       return res.send("Internal Error! please report if this error persist ")
    }
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