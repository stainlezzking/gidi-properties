const express = require("express")
const Router = express.Router()
const upload = require("../modules/fileupload")
const {APARTMENTS, SITE} = require("../modules/db")

Router.use(function(req,res,next){
    if(!req.user.admin) return res.redirect("/dashboard/profile")
    next()
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

module.exports = Router