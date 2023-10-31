const express = require("express")
const Router = express.Router()
const {upload, cloudinary}= require("../modules/fileupload")
const {APARTMENTS, SITE} = require("../modules/db")
const path = require("path")
const multer = require("multer")

loc = path.join(__dirname, "../uploads")
Router.post("/newproperty",  function(req,res, next){
    return  upload.array('images', 12)(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            return next(err)
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err)
           return next(err)
        }
        try {
            const contacts = [];
            // console.log(req.body)
            const {name,reach, incomplete} = req.body
             req.body.whois.forEach((whois,i)=>{
                 if(whois && name[i] && reach[i]) return contacts.push({whois, name : name[i], reach : reach[i]})
             })
            let urls = []
            for(let i=0; i <req.files.length; i++){
                const resp = await cloudinary.uploader.upload(loc + "/" + req.files[i].filename, { folder: req.body.localgovs.replace(" ", "-") + "_" + req.body.area.replace(" ", "-"), use_filename: true })
                urls.push(resp.secure_url)
            }
            req.body.carousel = urls.map(i=> {return{ url :i, show : true}})
            const d = await APARTMENTS.create({...req.body, complete : Boolean(req.body.complete), contacts, postedBy : req.user._id, approved : (Boolean(req.body.complete) && req.user.admin) })
            return res.redirect("/details/"+ d.id )
        } catch (e) {
            console.log(e)
            next({m : e.message, r : "/dashboard/newproperty", showflash: true})
        }
    })
})
Router.post("/newarea", express.urlencoded({extended : false}), function(req,res,next){
    SITE.updateOne({'division.localgov' : req.body.localgovs}, {
        $push : {"division.$.group": req.body.newarea}
    })
    .then(e=> res.redirect("/dashboard/newlocation"))
    .catch(e=> next({m : e.message, r : "/dashboard/newproperty", showflash: true}))
})

Router.post("/search",express.urlencoded({extended : false}), async function(req,res){
    try{
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
        if(!checkForHexRegExp.test(req.body.id)) return res.render("404", {m : "no property exists with such ID - "+ req.body.id})
        const prop = await APARTMENTS.findById(req.body.id)
        if(!prop) return res.render("404", {m : "no property exists with ID of - "+ req.body.id})
        res.redirect("/details/"+req.body.id)
    }catch(e){
        console.log(e)
        return next({m : "Internal Server Error", r : "/dashboard/newproperty", showflash: true})
    }
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

Router.post("/edit/:id", upload.array('images', 8), async function(req,res,next){

    // Edit should have a notification of its own... with the previous confirmed one still showing
    // put back processing status in my props and details page
    // add Edited status

    // if carousel + new images > 8 show error
    try{
        const aparte = await APARTMENTS.findById(req.params.id)
        if(!aparte) return res.send("No propertie could be found with id : "+req.params.id)
        if(JSON.stringify(aparte.postedBy) !== JSON.stringify(req.user._id) && !req.user.admin) return res.send("Not Authorized!")
        // if new contacts are added to the update
        if(req.body.whois[0] || req.body.whois[1]){
            req.body.contacts = []
            req.body.whois.forEach((whois,i)=>{
                if(whois && req.body.name[i] && req.body.reach[i]) return req.body.contacts.push({whois, name : req.body.name[i], reach : req.body.reach[i]})
            })
            req.body.whois = undefined ; req.body.reach = undefined ; req.body.name = undefined ;
        }
        req.body.carousel = aparte.carousel.map(ca=>{
            if(req.body.carousel.includes(ca.url)) return {url : ca.url, show : true}
            return {url : ca.url, show : false}})
        // upload image to server
        if(req.files.length) req.body.carousel.push(...req.files.map(i=> {return {url : "/uploads/"+i.filename, show : true}}))
        if(req.user.admin) {
            await APARTMENTS.updateOne({_id : req.params.id}, {...req.body})
        }else{
            await APARTMENTS.updateOne({_id : req.params.id}, {edited : true, history : req.body})
        }
        
        return res.redirect("/details/"+req.params.id)

}catch(e){
    next(e)
}
})

module.exports = Router