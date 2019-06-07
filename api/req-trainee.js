const express = require('express')
const router = express.Router()

module.exports = router

router.get('/',function(req, res){
    res.send('Home page')
})
//   /req/trainee/about
router.get('/about',function(req, res){
    res.send('About page')
})