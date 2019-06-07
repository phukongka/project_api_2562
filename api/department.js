const express = require('express')
const router = express.Router()

module.exports = router


router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('department').select('*')
    //.where("t_status","!=",0)
    .orderBy("d_id","desc")
    console.log('datas',rows)
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
router.get('/cus_select/:select', async (req, res) => {//console.log(req.params.select)
    try {
      let rows = await req.db('pk_department').select(req.params.select)
      res.send({
        ok: true,
        datas: rows,
      })
    }catch(e){res.send({ ok: false, error: e.message })}
  })

router.get("/sh_dep/:d_id",async(req,res)=>{
  console.log('param='+req.params.d_id)
  try{
    let db = req.db
    let row = await req.db('pk_department').select('*').where({
      d_id: req.params.d_id

    })
    res.send({
      ok:true,
      datas: row[0] || {},
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

router.post("/dep_add",async (req,res)=>{
  try{
    let d_id=await req.db("pk_department").insert({
      	d_code:req.body.d_code,
        d_name:req.body.d_name,
    })
    let log=await req.db("pk_department_log").insert({
    	d_id:d_id,
    	d_code:req.body.d_code,
        d_name:req.body.d_name,
        u_id:req.body.u_id,
        d_log_work:"เพิ่มข้อมูล",
    })
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.d_name+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/dep_del",async (req,res)=>{
  try{
    let d_id=await req.db("pk_department").update({
      t_status:"0"
    }).where({d_id:req.body.d_id})
    let log=await req.db("pk_department_log").insert({
    	d_id:req.body.d_id,
    	d_code:req.body.d_code,
      d_name:req.body.d_name,
      u_id:req.body.u_id,
      d_log_work:"ลบข้อมูล",
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.d_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/dep_update",async(req,res)=>{
  try{
    let sql=await req.db("pk_department").update({
        d_code:req.body.d_code,
        d_name:req.body.d_name,
    }).where({
      d_id:req.body.d_id
    })
    let log=await req.db("pk_department_log").insert({
    	d_id:req.body.d_id,
    	d_code:req.body.d_code,
      d_name:req.body.d_name,
      u_id:req.body.u_id,
      d_log_work:req.body.type,
      d_log_work:"แก้ไขข้อมูล"
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.d_name+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.d_name+" ได้",alt:"error"})}
})
router.post("/log",async (req,res)=>{
  try{
    let log=await req.db("pk_department_log").insert({
    	d_id:req.body.d_id,
    	d_code:req.body.d_code,
      d_name:req.body.d_name,
      u_id:req.body.u_id,
      d_log_work:req.body.type
    })
    res.send({
      ok:true,
    })
  }catch(e){res.send({ok:false,txt:"(-_-') (log!) ไม่สามารถบันทึกการทำงานได้",alt:"error"})}
})

router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      d_code:rows[0].d_code,
      d_name:rows[0].d_name,
    }).where({d_id:rows[0].d_id})
    let log=await req.db(req.body.data).insert({
    	d_id:rows[0].d_id,
    	d_code:rows[0].d_code,
      d_name:rows[0].d_name,
      u_id:req.body.u_id,
      d_log_work:"เรียกคืนข้อมูล",
    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].d_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})
