
const express = require('express')
const router = express.Router()
const multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files/img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })

module.exports = router

router.post('/upload',upload.any(), function(req, res,next) {
  console.log(req.files[0].filename);
  // console.log(Date.now());
   // res.send({status: true, url: './public/img/' + req.file.myFile})

  // res.send({status: true, url: '/files/' + req.files.myFile.name})
});

