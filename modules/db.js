const mongoose = require("mongoose")
require("dotenv").config();
mongoose.set('strictQuery', false);

// local imports

//  connection
let online = ``
let localhost = "mongodb://127.0.0.1:27017/gidi";
mongoose.connect(localhost, { useNewUrlParser: true, useUnifiedTopology: true })
.then(function(req, res) {
    console.log("DB connected successfully");
})

const accounts = mongoose.Schema({
    name : String,
    // fname := name.split(" ")[0]
    email : String,
    password : String,
    agent : {type : Boolean, default : true},
    admin : {type : Boolean, default : false},
    disabled : {type : Boolean, default : false}
}, {timestamps : true})

const apartmentobject = {
    rooms : Number,
    bathrooms : Number,
    parlour : Number,
    kitchen : Number,
    toilets : Number,
    address : String,
    localgovs : String,
    area : String,
    carousel : [String],
    frontImage : String,
    youtube : String,
    cost : Number,
    description : String,
    contacts : [{ name : String, reach : String, whois : String }],
    proptype : {type : String, default : "apartment"}, // add to all schemas
    amenities : [String]
}

const apartmenthistory = mongoose.Schema(apartmentobject)

// make a child schema for when it is edited 
const apartment = mongoose.Schema({
    // selfcon and rooms props
    ...apartmentobject,
    postedBy : {type : mongoose.Schema.Types.ObjectId, ref : "account"},
    admin : {type : Boolean, default : false},
    // fetch postedBy in details page as ref
    postedby : mongoose.Schema.Types.ObjectId,
    history : apartmenthistory,
    // admin process
    edited : {type : Boolean, default : true},
    privatenote : String,
}, {timestamps : true})

const privateprops = mongoose.Schema({
    // enum : [duplex, bungalow]

})
const siteinfo = mongoose.Schema({
    division : [{localgov : String, hide : Boolean, group : [String]}],
    contacts : [{name : String, number : Number}]
},{timestamps : true})

const activities = mongoose.Schema({
    name : String,
    madeby : mongoose.Schema.Types.ObjectId,
    property : mongoose.Schema.Types.ObjectId,
    attended : mongoose.Schema.Types.ObjectId,
}, {timestamps : true})


// Declaring models
const SITE = mongoose.model("siteinfo", siteinfo)
const ACCS = mongoose.model("account", accounts)
const APARTMENTS = mongoose.model("apartments", apartment)
const ACTIVE = mongoose.model("activities", activities)
// const PRIVATEPROPERTY = mongoose.model("privateprop", privateprops)


// apartment.create({
//     rooms : 1, bathroom : 2, kitchen : 1
// })
// .then(d=> console.log(d))

module.exports = {ACCS, APARTMENTS, SITE, ACTIVE}