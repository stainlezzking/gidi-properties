const express = require("express")
const app = express()
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("express-flash");


// local imports
const frontRouter = require("./Routes/frontpage")
const dashRouter = require("./Routes/dashboardget.js")
const passportConfig = require("./modules/authentication")
const {ACCS} = require("./modules/db");
const md5 = require("md5");


// Express setups and middle wares
app.use(flash());


// ] PASSPORT & Express-Session SET-UP [
passportConfig(app, session, passport, localStrategy, ACCS);
    

app.set("view engine", "ejs")

app.use("/x-x", express.static("public"))
app.use("/", frontRouter)
app.use("/dashboard", dashRouter)




//  LOgin authentication
app.post("/auth/login", express.urlencoded({ extended: false }),
    function(req, res, next) {
        next()
    },
    passport.authenticate("account", {
        successRedirect: "/dashboard",
        failureRedirect: "/auth/login",
        failureFlash: true,
    })
);


app.post("/auth/register", express.urlencoded({ extended: false }), async function(req, res, next) {
    try{
        const user = await ACCS.findOne({ email: req.body.email.toLowerCase()});
        if (user) return next({m : "This email has been used", r: "/auth/register", showflash : true})
        await ACCS.create({...req.body, email : req.body.email.toLowercase(), password : md5(req.body.password)})
        return next()
    }catch(e){
       return  next({m : "A 500 code error, please try again", r : "/auth/register", showflash: true})
    }
}, passport.authenticate("account", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/register",
    failureFlash: true,
}))


app.use(function(err,req,res,next){
    if(err.showflash){
        req.flash("error", err.m)
        return res.redirect(err.r)
    }
    // do something with all uncaught error after here
    console.log("error called ", err)
})



const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log("server up and running")
})