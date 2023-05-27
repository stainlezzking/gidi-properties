const express = require("express")
const Router = express.Router()
const upload = require("../modules/fileupload")
const {APARTMENTS, SITE} = require("../modules/db")




const dAdmin = function(req,res,next){
    // shoulf be added to all user update route
    delete req.body.admin;
    next()
}

Router.post("/newproperty",  upload.array('images', 12), function(req,res, next){
   const contacts = [];
   const {name,reach} = req.body
    req.body.whois.forEach((whois,i)=>{
        if(whois && name[i] && reach[i]) return contacts.push({whois, name : name[i], reach : reach[i]})
    })
    req.body.carousel = req.files.map(i=> "/uploads/"+i. filename)
   APARTMENTS.create({...req.body, contacts, postedBy : req.user._id })
   .then(d=> res.redirect("/details/"+ d.id ))
    .catch(e=>   next({m : e.message, r : "/dashboard/newproperty", showflash: true}))
    // upload the image
})

Router.post("/newarea", express.urlencoded({extended : false}), function(req,res,next){
    SITE.updateOne({'division.localgov' : req.body.localgovs}, {
        $push : {"division.$.group": req.body.newarea}
    })
    .then(e=> res.redirect("/dashboard/newlocation"))
    .catch(e=> next({m : e.message, r : "/dashboard/newproperty", showflash: true}))
})

Router.post("/update/localgov",express.urlencoded({extended : false}), async function(req,res,next){
    try{
        const chosenLGs = req.body.lgs 
        const site = await SITE.findOne({})
    
        site.division.forEach(d=> {
            if(chosenLGs.includes(d.localgov)) return d.hide = false
            return d.hide = true
        })
        site.save()
        res.redirect("/dashboard/newlocation")
    }catch(e){
        console.log(e)
        return next({m : "Internal Server Error", r : "/dashboard/newproperty", showflash: true})
    }
})


module.exports = Router