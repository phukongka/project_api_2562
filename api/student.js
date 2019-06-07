const express = require('express')
const router = express.Router()
//const db = require('../lib/db')
module.exports = router
//    /student
//    /student/
router.get('/',(req, res) =>{
   // res.send('Home page')
    let db = req.db    // เอามาใช้ได้เลยเนื่องจากมีมาจาก index.js
    db('student as s')
    .where('s.std_code', '=', req.query.std_code)
    .where('s.code', '=', 'E4B24520')//  จะนำมา  AND กัน
    // .where({ // เขียน where = กรณีเป็น object
    //    's.std_code': req.query.std_code,
    //    's.code': 'E4B24520',
    // })
    //.orWhere('code', '=', 'E4B24520')//  จะนำมา  AND กัน
    .orderBy('std_code','asc')
    .orderBy('code', 'desc')
    //.select(['std_code', 'name'])
    .then((rows) => { // ได้เป็น Array เสมอ ถ้า select
      res.send({   // ส่วนใหญ่ส่งเป็นอ็อบเจ็ค
          status:true,
          data: rows,
      })
    }).catch(error =>{
        console.log('ERROR', error)
        res.send({
            status: false,
            error: 'error.message',
        })
    })
})
//   /student/save
router.post('/save',function (req, res){ // รับข้อมูลแบบ json
    let db = req.db
    return db('student').insert({
        code: req.body.code,
        first_name: req.body.name,
    }).then( ids =>{
        console.log('ids=', ids)
        console.log(ids[0])
        res.send({
            status: true,
        })
    }).catch(error =>{
        console.log('ERROR1', error)
        res.send({
            status: false,
            error: 'error.message',
        })
    })
    console.log('xxxxx')   // ถ้าใส่ return 
})
//   /student/about
router.get('/about',function(req, res){
    res.send('About page')
})