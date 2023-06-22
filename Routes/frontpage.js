const express = require("express")
const { APARTMENTS, SITE, ACCS } = require("../modules/db")
const { propsSelection, amenities, getPaginatedData, showPaginatedList } = require("../modules/utilities")
const router = express.Router()

const pageSize = 4


router.use(async function(req,res,next){
    try{
        res.locals.site = await SITE.findOne().lean()
        const user = await ACCS.findOne({email : "azukachukwuebuka07@gmail.com"}).lean()
        if(req.url.startsWith('/listings')){
            // console.log(req.query.page)
            // limit n page n count n offset
            req.query.page <= 0 || isNaN(req.query.page)  ? req.query.page = 1 : req.query.page = Number(req.query.page)  ;
            const page = await getPaginatedData(req.query.page, pageSize, next)
            res.locals.props = page.paginatedData;
            res.locals.pagination = showPaginatedList(req.query.page,page.pagin.pageList)
            console.log(res.locals.pagination)
        }
       return req.login(user, function(e){
            if(e) console.log(e)
            if(!user) return res.send("Account not found to be authenticated!")
            res.locals.user = req.user
            next() 
        })
    }catch(e){
        console.log(e)
        return res.send("Internal Server Error! please report if error persist")
    }
})

router.get("/", function(req,res){
    res.render("index")
})

router.get("/listings", async function(req,res){
    
    
    // APARTMENTS.find({ parlour : 1,$or : [
    //     {rooms : 3 },
    //     {rooms : 10}
    // ] }, "cost rooms parlour")
    // .then(d=> console.log(d))
    // .catch(e=> console.log(e))
        res.locals.propSelection = propsSelection
        res.locals.amenities = amenities
        res.locals.division =  res.locals.site.division
        // '/houses' , 'lands' , 'shops' , 
        res.render("listing")
})

router.post("/listings/filter",express.urlencoded({extended : false}), function(req,res){
    try{
        for (props in req.body){
            if(!req.body[props] ) delete req.body[props]
        }
        console.log(req.body)
        res.send("connection")

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