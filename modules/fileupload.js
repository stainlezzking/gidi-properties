const multer = require("multer")
const path = require("path")

let loc = path.join(__dirname,'../uploads')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, loc)
    },
    filename: function (req, file, cb) {
        // change name to include street name and localgov
      cb(null,  Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })


 module.exports = upload;