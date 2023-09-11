const mongoose = require("mongoose");
const { propsSelection } = require("./utilities");
require("dotenv").config();
mongoose.set('strictQuery', false);

// local imports

//  connection
let online = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@uh-cluster-1.7jqhrpe.mongodb.net/uh-housing`
let localhost = "mongodb://127.0.0.1:27017/gidi";
mongoose.connect(online, { useNewUrlParser: true, useUnifiedTopology: true })
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
    title : String,
    label : String,
    rooms : Number,
    bathrooms : Number,
    parlour : Number,
    kitchen : Number,
    toilets : Number,
    address : String,
    localgovs : String,
    area : String,
    distance : Number,
    carousel : [{url : String, show : { default : true ,type :Boolean}}],
    frontImage : String,
    youtube : String,
    cost : Number,
    description : String,
    contacts : [{ name : String, reach : String, whois : String }],
    proptype : String, // add to all schemas
    amenities : [String],
    privatenote : String,
    complete : {type : Boolean, default : false}
}


// make a child schema for when it is edited 
const apartment = mongoose.Schema({
    // selfcon and rooms props
    ...apartmentobject,
    postedBy : {type : mongoose.Schema.Types.ObjectId, ref : "account"},
    // fetch postedBy in details page as ref
    postedby : mongoose.Schema.Types.ObjectId,
    history : {...apartmentobject, confirmed : {type : Boolean, default : false}},
    // admin process
    edited : {type : Boolean, default : false},
    approved : {type : Boolean, default : false},
    // complete means all information are provided clear and correct
}, {timestamps : true})


const siteinfo = mongoose.Schema({
    division : [{localgov : String, hide : Boolean, group : [{junction : String,distance : Number}]}],
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

ACCS.find()
.then(d=> console.log(d))
module.exports = {ACCS, APARTMENTS, SITE, ACTIVE}