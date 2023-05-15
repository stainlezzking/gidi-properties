const md5 = require('md5')
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
}
