const express = require("express")
const Router = express.Router()
const upload = require("../modules/fileupload")
const {APARTMENTS, SITE, ACCS} = require("../modules/db")

Router.use( async function(req,res,next){
    if(!req.isAuthenticated()) return res.redirect("/listings")
    res.locals.activeurl = req.url;
    if(!req.user.admin) return res.redirect("/dashboard/profile")
    res.locals.user = req.user
    if(req.url.toLowerCase().startsWith("/managelisting")){
        res.locals.ownprops = await APARTMENTS.find().limit(20).lean()
    }
    next()
})

Router.get("/editedlist",async function(req,res){
    res.locals.ownprops = await APARTMENTS.find({edited : true})
    res.render("private/editedList")
})
/* Later hide this route from 
agents dash
*/

Router.get("/manageaccounts", async function(req,res){
    res.locals.accounts = await ACCS.find({}, "-password")
    res.render("private/manageaccounts")
})

Router.get("/managelisting", function(req,res){
    res.render("private/managelisting")
})

Router.post("/delete/prop/:id", async function(req,res, next){
    try{
       await APARTMENTS.deleteOne({_id : req.params.id})
        res.redirect("/dashboard")
    }catch(e){
        console.log(e)
        res.send("An error Occured trying to delete Property")
    }
})

Router.post("/newarea", express.urlencoded({extended : false}), function(req,res,next){
    SITE.updateOne({'division.localgov' : req.body.localgovs}, {
        $push : {"division.$.group": { distance : req.body.distance, junction : req.body.newarea}}
    })
    .then(e=> res.redirect("/dashboard/newlocation"))
    .catch(e=> next({m : e.message, r : "/dashboard/newproperty", showflash: true}))
})



Router.post("/approve/prop/:id", async function(req,res, next){
    try{
        await APARTMENTS.updateOne({_id : req.params.id}, {approved : true})
        res.redirect("/details/"+req.params.id)
    }catch(e){
        console.log(e)
        res.send("An error Occured trying to Approve property")
    }
})

/*
approve Edit 
*/
Router.post("/approve/edit/:id",express.urlencoded({extended : false}), async function(req,res){
    const approvedUpdates = req.body
    const obnArrys = ['contacts', 'amenities', 'carousel' ]
    for(props in approvedUpdates){
        if(obnArrys.includes(props))  approvedUpdates[props] = JSON.parse(approvedUpdates[props]);  
    }
    const complete = approvedUpdates.complete  ? {complete : true } : { complete : false};
    delete approvedUpdates.complete
    try{
        await APARTMENTS.updateOne({_id : req.params.id}, {...approvedUpdates,...complete, edited : false, history : null})
        res.redirect("/details/"+req.params.id)
    }catch(e){
        console.log(e)
        res.send("An error Occured trying to Approve property")
    }
})

Router.post("/user/:id",express.urlencoded({extended : false}), async function(req,res,next){
    try{
        const type = req.body.type 
        if(type == 'delete') await ACCS.deleteOne({_id : req.params.id})
        if(type.endsWith('activate') )  await ACCS.updateOne({_id : req.params.id}, {disabled : type == 'activate' ? false : true})
        return res.redirect(type == 'delete' ? '/dashboard/profile' : 'back')
    }catch(e){
        console.log(e)
        res.send("An Error Occured trying to update user")
    }
})

module.exports = Router