const mongoose = require("mongoose")
require("dotenv").config();
mongoose.set('strictQuery', false);
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
})

const house = mongoose.Schema({
    rooms : Number,
    bathroom : Number,
    parlour : Boolean,
    kitchen : Number,
    store : Boolean,
    pop : Boolean,
    Borehole : Boolean,
    well : Boolean,
    estate : Boolean,
    address : String,
    carousel : [String],
    frontImage : String,
    youtube : String,
    postedBy : {type : mongoose.Schema.Types.ObjectId, ref : "agent"},
    admin : {type : Boolean, default : false},
    // fetch postedBy in details page as ref
    contact : [{ name : String, reach : String, whois : String }],
    postedby : mongoose.Schema.Types.ObjectId,

})


const ACCS = mongoose.model("account", accounts)
const HOUSES = mongoose.model("house", house)

// HOUSE.create({
//     rooms : 1, bathroom : 2, kitchen : 1
// })
// .then(d=> console.log(d))

module.exports = {ACCS, HOUSES}