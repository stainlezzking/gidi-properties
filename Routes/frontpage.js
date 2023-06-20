const express = require("express")
const { APARTMENTS, SITE, ACCS } = require("../modules/db")
const { propsSelection, amenities } = require("../modules/utilities")
const router = express.Router()


router.use(async function(req,res,next){
    try{
        res.locals.site = await SITE.findOne().lean()
        const user = await ACCS.findOne({email : "azukachukwuebuka07@gmail.com"}).lean()
       return req.login(user, function(e){
            if(e) console.log(e)
            if(!user) return res.send("Account not found to be authenticated!")
            res.locals.user = req.user
            next() 
        })
    }catch(e){
        console.log(e)
        return res.send("Internal Server Error! please report if error persist")
    }
})

router.get("/", function(req,res){
    res.render("index")
})

router.get("/listings", async function(req,res){
        res.locals.propSelection = propsSelection
        res.locals.amenities = amenities
        res.locals.division =  res.locals.site.division
        // '/houses' , 'lands' , 'shops' , 
        res.render("listing")
})

router.get("/listings/filter", function(req,res){
    console.log(req.query)
    res.send("connection")
})

router.get("/details/:id", async function(req,res, next){
    try{
        // remember to strip of admin info before sending
        const props = await APARTMENTS.findOne({_id : req.params.id}).populate("postedBy", "name")
        if(!props) return res.render("404.ejs")
        res.locals.property  = props;
        return res.render("details")
    }catch(e){
        console.log(e, e.message)
        // find the url he is coming from and revert back to it. whether it was from post or get
        return res.send("Internal Server Error! please report if error persist")
    }
})

router.get("/auth/login", function(req,res){
    res.render("auth.ejs", {login : true})
})

router.get("/auth/register", function(req,res){
    res.render("auth.ejs", {login : false})
})



module.exports = router