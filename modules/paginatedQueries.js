const { APARTMENTS } = require("./db");

// Pagination function
module.exports.getPaginatedData = async function(pageNumber, pageSize, next, query = {}) {
    try {
      const pipeline = [
      { $match: { complete : true, approved : true, ...query } },
      { $count: 'count' },
    ];
  
    
   
    const [result] = await APARTMENTS.aggregate(pipeline);
    const totalCount = result ? result.count : 0;

    const paginatedData = await APARTMENTS.aggregate([
      { $match: { complete : true, approved : true, ...query  } },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
      {$project : {carousel : 1, _id : 1, proptype : 1, cost : 1, bathrooms : 1, rooms : 1, area : 1, label : 1, localgovs : 1, complete : 1}}
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