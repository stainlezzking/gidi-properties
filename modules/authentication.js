const md5 = require('md5')
const express = require("express")
const {ACCS} = require("./db")
module.exports = passportAuth = function(app, session, passport, localStrategy, ACCS) {
    // session
    app.use(session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }))

    app.use(passport.initialize())

    app.use(passport.session())

    passport.use("account",new localStrategy({usernameField: "email"},
        (user,password,done)=>{
            console.log(user,password, md5(password))
            ACCS.findOne({email: user.toLowerCase()})
            .then(function(data){
                if(!data) return done(null, false, {message : "wrong username or password"})
                if(data){
                        if(data.password == md5(password)) return done(null,data)
                            return done(null, false, {message : "wrong username or password"})
                }
            })
            .catch(e=> done(e))
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, { id: user.id, admin: user.admin });
    });

    passport.deserializeUser(function(user, done) {
        return ACCS.findById(user.id)
        .then(user=> done(null,user))
        .catch(e=> done(e))
    });



    // ALL LOGIN ROUTES

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
    const user = await ACCS.findOne({ _id : req.body.email.toLowerCase()});
    if (user) return next({m : "This email has been used", r: "/auth/register", showflash : true})
    await ACCS.create({...req.body, email : req.body.email.toLowerCase(), password : md5(req.body.password)})
    return next()
}catch(e){
    console.log(e)
   return  next({m : "A 500 code error, please try again", r : "/auth/register", showflash: true})
}
}, passport.authenticate("account", {
successRedirect: "/dashboard",
failureRedirect: "/auth/register",
failureFlash: true,
}))

}
