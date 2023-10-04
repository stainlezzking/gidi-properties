const multer = require("multer")
const path = require("path")

const cloudinary = require("cloudinary").v2;

// Configuration 
cloudinary.config({
  cloud_name: process.env.RP_CLOUDINARY_NAME,
  api_key: process.env.RP_CLOUDINARY_KEY,
  api_secret: process.env.RP_CLOUDINARY_SECRET,
  secure : true
});

let loc = path.join(__dirname,'../uploads')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, loc)
    },
    filename: function (req, file, cb) {
        // change name to include street name and localgov
        const filename =   req.body.localgovs +"--"+ req.body.area + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
      cb(null, filename )
    }
  })
  
  const upload = multer({ storage: storage })


 module.exports = {upload, cloudinary};