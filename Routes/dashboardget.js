const express = require("express")
const router = express.Router()

const {ACCS, APARTMENTS, SITE} = require("../modules/db")
const { amenities, propsSelection, contactsSelect } = require("../modules/utilities")

router.use(async function(req,res,next){
    res.locals.activeurl = req.url;
    try{
        if(!req.isAuthenticated()) return res.redirect("/")
        res.locals.user = req.user
        if(req.user.disabled) return res.send("Your account has been disabled, contact admin for more info")
        if(req.url == "/"){
            res.locals.count =  await APARTMENTS.find().count()
            res.locals.accounts =  await ACCS.find().count()
        }
        if(req.url.toLowerCase().startsWith("/newproperty") || req.url.startsWith("/newlocation") || req.url.startsWith("/edit") ){
            res.locals.amenities = amenities
            res.locals.propsSelection = propsSelection
            res.locals.contactsSelect = contactsSelect
            res.locals.division = res.locals.site.division
        }
        if(req.url.toLowerCase().startsWith("/myprops") || (req.url.startsWith("/profile") && req.url.length < 20) ){
            res.locals.ownprops = await APARTMENTS.find({postedBy : req.user._id}).lean()
        }
        next()

    }catch(e){
        console.log(e)
        next(e)
    }
})


/*
 WHY does newproprty and newLocation
  not have user passed into he ejs
*/

router.get("/", function(req,res){
    console.log(res.locals.user)
    res.render("private/dashboard.ejs")
})

router.get("/newproperty", function(req,res){
    res.render("private/newproperty")
})
router.get("/newlocation", function(req,res){ 
    if(!req.user.admin) return res.redirect("back")
    res.render("private/newlocation")
})

/*
#Edit-Page
if carousel images < 8 it wont let options to add new images
*/
router.get("/edit/:id", async function(req,res){
    try{
        res.locals.propsSelection = propsSelection
        res.locals.prop = await APARTMENTS.findById(req.params.id).populate("postedBy", "name").lean()
        if(!req.user.admin &&  JSON.stringify(req.user._id) !== JSON.stringify(res.locals.prop.postedBy._id)) return res.redirect("back")
        if(res.locals.prop.edited) res.locals.prop = {...res.locals.prop, ...res.locals.prop.history}
        return res.render("private/editpage")

    }catch(e){
        console.log(e)
        return res.send("Internal Error! please report if this error persist ")
    }
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


module.exports = router