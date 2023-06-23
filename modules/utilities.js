const { SITE, APARTMENTS } = require("./db")

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

// Pagination function
module.exports.getPaginatedData = async function(pageNumber, pageSize, next) {
    try {
      const pipeline = [
      { $match: { } },
      { $count: 'count' },
    ];
  
    
   
    const [result] = await APARTMENTS.aggregate(pipeline);
    const totalCount = result ? result.count : 0;

    const paginatedData = await APARTMENTS.aggregate([
      { $match: {  } },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
      {$project : {carousel : 1, _id : 1, proptype : 1, cost : 1, bathrooms : 1, rooms : 1, area : 1, label : 1, localgovs : 1}}
    ]);
    
    return {
      paginatedData,
      pagin : {pageList : new Array(Math.ceil(totalCount/pageSize)), pageNumber, pageSize}
    };

    } catch (error) {
      return next(error)
    }
  }

  module.exports.showPaginatedList = function(currentIndex, totalpages){
        let startpoint;
        currentIndex > 5 ? startpoint = (currentIndex-5) : startpoint = currentIndex- (currentIndex-1)

        let endpoint;
        totalpages.length <= currentIndex+5 ? endpoint = totalpages.length : (currentIndex <= 5 && totalpages.length > currentIndex+5) ? endpoint = (startpoint + 9) : endpoint = currentIndex + 5;

        let pagination = []
        for(i = startpoint; i<= endpoint; i++){
        pagination.push(i);
        }
        return {list : pagination, currentIndex, totalpages};
}
  
module.exports.contactsSelect = ['Landlord', 'Care-taker', 'Tenant']

module.exports.propsSelection = ['Self-contain', 'Apartment', 'Bungalow', 'Houses'] 
