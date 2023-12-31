const express = require("express")
const app = express()
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("express-flash");


// local imports
const frontRouter = require("./Routes/frontpage")
const dashRouter = require("./Routes/dashboardget.js")
const dashPost = require("./Routes/dashboardpost.js")
const adminPost = require("./Routes/adminrequests")
const passportConfig = require("./modules/authentication")
const {ACCS} = require("./modules/db");
const { propsSelection, amenities,  listingTypes } = require("./modules/utilities")



// Express setups and middle wares
app.use(flash());


// ] PASSPORT & Express-Session SET-UP [
passportConfig(app, session, passport, localStrategy, ACCS);
    

app.set("view engine", "ejs")

// ejs global variable declaration
app.use(function(req,res,next){
    res.locals.propSelection = propsSelection
    res.locals.amenities = amenities
    res.locals.user = req.user ? req.user : null;
    res.locals.listingTypes =  listingTypes 
    res.locals.activeurl =  null;
    next()
})


app.use("/x-x", express.static("public"))
app.use("/", frontRouter)
app.use("/dashboard", dashRouter)
app.use("/dashboard", dashPost)
app.use("/uploads",express.static("uploads"))
app.use("/admin", adminPost)

app.use(function(err,req,res,next){
    if(err.showflash){
        req.flash("error", err.m)
        return res.redirect(err.r)
    }
    // do something with all uncaught error after here
    console.log("error called ", err)
    return res.send(err.message)
})
app.use(function(req,res,next){
    res.render("404")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log("server up and running on "+ PORT)
})