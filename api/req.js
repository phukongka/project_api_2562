const express = require('express')
const router = express.Router()

module.exports = router

router.use('/trainee', require('./req-trainee'))
// router.use('/a', require('./req-a'))
// router.use('/b', require('./req-b'))
// router.use('/c', require('./req-c'))
router.get('/major', async (req, res) => {
    let data = await req.db('major')
    .orderBy('major_code')
    .select(['major_code', 'major_name'])
     res.send({
      status: true,
      data,
    })
})

router.post('/manpower', async(req, res) => {
   // TODO:
   try {
   // req.db('req_human_power').insert(req.body) // ชื่อหรือ fild ต้องตรงกัน insert ได้เลย ถ้าไม่ตรง
    //ต้อง map กัน ด้วยการเขียน หรือ เขียนเอง  

    let id = await req.db('req_human_power').insert({
           major_id: req.body.majorId,
           req_start: req.body.reqStart,
    }).then(ids => ids[0])
    if(!ids){
        throw new Error('insert error')
      console.log('error')
    }
    res.send ({stateu: true})
   } catch (e){
    res.send({status: false, error: e.message})
   }
 })