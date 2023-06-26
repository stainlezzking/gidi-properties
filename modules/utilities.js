// const { SITE, APARTMENTS } = require("./db")

// localgovs = [
//     {localgov : "Alimosho", hide : true, group : []},
//     {localgov : "Ajeromi-ifelodun", hide : true, group : []},
//     {localgov : "Mushin", hide : true, group : []},
//     {localgov : "Oshodi-Isolo", hide : true, group : []},
//     {localgov : "Ojo", hide : true, group : []},
//     {localgov : "Ikorodu", hide : true, group : []},
//     {localgov : "Surulere", hide : true, group : []},
//     {localgov : "Agege", hide : true, group : []},
//     {localgov : "Ifako-Ijaiye", hide : true, group : []},
//    {localgov :  "Somolu", hide : true, group : []},
//    {localgov :  "Amuwo-Odofin", hide : true, group : []},
//    {localgov :  "Lagos Mainland", hide : true, group : []},
//     {localgov : "Ikeja", hide : true, group : []},
//     {localgov : "Eti-Osa", hide : true, group : []},
//     {localgov : "Badagry", hide : true, group : []},
//     {localgov : "Apapa", hide : true, group : []},
//     {localgov : "Lagos Island", hide : true, group : []},
//     {localgov : "Epe", hide : true, group : []},
//     {localgov : "Ibeju-Lekki", hide : true, group : []}
// ]

// const awkaLocalgov = [
//     {localgov : "Amawbia", hide : true, group : []},
//     {localgov : "Awka-Ifite", hide : true, group : []},
//     {localgov : "Ezinato", hide : true, group : []},
//     {localgov : "Isiagu", hide : true, group : []},
//     {localgov : "Mbaukwu", hide : true, group : []},
//     {localgov : "Nibo", hide : true, group : []},
//     {localgov : "Nise", hide : true, group : []},
//     {localgov : "Okpuno", hide : true, group : []},
//     {localgov : "Umuawulu", hide : true, group : []},
// ]


module.exports.amenities = [
    {
        name : "prepaid Meter",
        value : "prepaid"
    },
    {
        name : "Running water",
        value : "borehole"
    },
    {
        name : "Parking space",
        value : "parking space"
    },
    {
        name : "Well",
        value : "well"
    },
    {
        name : "P.O.P",
        value : "pop"
    },
    {
        name : "Estate",
        value : "estate"
    },
]

  
module.exports.contactsSelect = ['Landlord', 'Care-taker', 'Tenant']

// do not change the arrangement of this propsselection 
// as it is being accessed throughout the app with its index.
module.exports.propsSelection = ['Self-contain', 'Apartment'] 

module.exports.listingTypes = [{label : "All listings", code : "listings"},{label : 'Apartments', code : 'apt'}, {label : 'Self-con', code : 'sfc'}]
