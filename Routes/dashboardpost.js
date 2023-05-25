const express = require("express")
const Router = express.Router()
const upload = require("../modules/fileupload")
const {APARTMENTS} = require("../modules/db")




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
    req.body.carousel = req.files.map(i=> i.path)
   APARTMENTS.create({...req.body, contacts, postedBy : req.user ? req.user._id : "646c906e2f6b0b27830ae223" })
   .then(d=> res.redirect("/details/"+ d.id ))
    .catch(e=>   next({m : e.message, r : "/dashboard/newproperty", showflash: true}))
    // upload the image
})

module.exports = Router