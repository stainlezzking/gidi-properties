const express = require("express")
const Router = express.Router()
const upload = require("../modules/fileupload")
const {APARTMENTS, SITE, ACCS} = require("../modules/db")

Router.use(function(req,res,next){
    if(!req.user.admin) return res.redirect("/dashboard/profile")
    next()
})

Router.get("/pendingListing", function(req,res){
    
})
/* Later hide this route from 
agents dash
*/

Router.get("/manageaccounts", async function(req,res){
    res.locals.activeurl = req.url;
    res.locals.accounts = await ACCS.find({}, "-password")
    res.render("private/manageaccounts")
})

Router.get("/managelisting", function(req,res){
    res.locals.activeurl = req.url;
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

Router.post("/approve/prop/:id", async function(req,res, next){
    try{
        await APARTMENTS.updateOne({_id : req.params.id}, {edited : false})
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