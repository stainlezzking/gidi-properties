const express = require("express")
const { APARTMENTS, SITE, ACCS } = require("../modules/db")
const { getPaginatedData, showPaginatedList} = require("../modules/utilities")
const router = express.Router()

const pageSize = 5


router.use(async function(req,res,next){
    try{
        res.locals.site = await SITE.findOne().lean()
        // const user = await ACCS.findOne({email : "bishop@gmail.com"}).lean()
        if(req.url.startsWith('/listings') || req.url.startsWith("/ls")){
            res.locals.division =  res.locals.site.division  
            typeof req.query.page == 'object' && req.query.page.length ? req.query.page = req.query.page[req.query.page.length - 1] : null ;
            req.query.page <= 0 || isNaN(req.query.page)  ? req.query.page = 1 : req.query.page = Number(req.query.page)  ;
        }
        next()
    //    return req.login(user, function(e){
    //         if(e) console.log(e)
    //         if(!user) return res.send("Account not found to be authenticated!")
    //         res.locals.user = req.user
    //         next() 
    //     })
    }catch(e){
        console.log(e)
        return res.send("Internal Server Error! please report if error persist")
    }
})

router.get("/", (req,res)=> res.redirect("/listings"))
router.get("/home", function(req,res){
    res.render("index")
})

router.get("/listings", async function(req,res, next){
    const page = await getPaginatedData(req.query.page, pageSize, next)
    res.locals.props = page.paginatedData;
    res.locals.pagination = showPaginatedList(req.query.page,page.pagin.pageList)
    res.locals.url = null;
    res.render("listing")
})
router.get("/ls/houses", async function(req,res){
    console.log(req.url)
    const mainQ = { proptype : { $ne : req.url.split("/")[2]} }
    const totalCount = await APARTMENTS.find(mainQ).count()
    res.locals.props = await APARTMENTS.find(mainQ).sort({createdAt : -1}).skip((req.query.page - 1) * pageSize).limit(pageSize)
    res.locals.pagination = showPaginatedList(req.query.page,new Array(Math.ceil(totalCount/pageSize)))
    res.locals.url = req.url
    res.render("listing")
})

router.get("/ls/lands", async function(req,res){
    const mainQ = { proptype : { $eq : req.url.split("/")[2]} }
    const totalCount = await APARTMENTS.find(mainQ).count()
    res.locals.props = await APARTMENTS.find(mainQ).sort({createdAt : -1}).skip((req.query.page - 1) * pageSize).limit(pageSize)
    res.locals.pagination = showPaginatedList(req.query.page,new Array(Math.ceil(totalCount/pageSize)))
    res.locals.url = req.url
    res.render("listing")
})


router.get("/terms", function(req,res){
    res.render("terms")
})

router.get("/listings/filter", async function(req,res, next){
    try{
        for (props in req.query){
            if(!req.query[props] ) delete req.query[props]
        }
        let mainQ = {}
        req.query.amenities ? mainQ ={ ...mainQ, amenities :   {$in : req.query.amenities}} : null;
        req.query.proptype ? mainQ =  {...mainQ, proptype : req.query.proptype} : null;
        req.query.max ? mainQ = {...mainQ, cost : {$lte : req.query.max }} : null;
        req.query.area ? mainQ = {...mainQ, area : req.query.area} : null ;
        req.query.rooms ? mainQ = {...mainQ, rooms : { $gte : req.query.rooms}} : null ;
        req.query.bathrooms ? mainQ = {...mainQ, bathrooms : {$gte : req.query.bathrooms}} : null ;
        const totalCount = await APARTMENTS.find(mainQ).count()
        res.locals.props = await APARTMENTS.find(mainQ).sort({createdAt : -1}).skip((req.query.page - 1) * pageSize).limit(pageSize)
        res.locals.pagination = showPaginatedList(req.query.page,new Array(Math.ceil(totalCount/pageSize)))
        res.locals.url = req.url
        res.render("listing")

    }catch(e){
        console.log(e)
        return res.send("Internal Server Error! please report if error persist")
    }
})

router.get("/details/:id", async function(req,res, next){
    try{
        // remember to strip of admin info before sending
        const props = await APARTMENTS.findOne({_id : req.params.id}).populate("postedBy", "name")
        if(!props) return res.render("404.ejs")
        res.locals.property  = props;
        return res.render("details")
    }catch(e){
        console.log(e)
        // find the url he is coming from and revert back to it. whether it was from post or get
        return res.send("Internal Server Error! please report if error persist")
    }
})

router.get("/auth/login", function(req,res){
    res.render("auth.ejs", {login : true})
})

router.get("/auth/register", function(req,res){
    res.render("auth.ejs", {login : false})
})



module.exports = router