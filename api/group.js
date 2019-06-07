const express = require('express')
const router = express.Router()

module.exports = router

////////////////////////// teacher //////////////////////////////////////
router.post('/list_teacher', async (req, res) => {
  try {
    let rows = await req.db('group').select(
      "teacher.t_id",
      "teacher.t_code",
      "teacher.t_name",
      "teacher.t_dep",
      "teacher.t_tel",
      "teacher.t_username",
      "teacher.t_password",
      "teacher.t_status",
      "department.d_name",
      "group.g_name",
      "group.g_code",
      "group.g_id"
    )

    .innerJoin('department', 'department.d_code', 'group.d_code')
    .innerJoin('teacher', 'department.d_code', 'teacher.t_dep')
    .rightOuterJoin('match_std_tch', function() {
      this.on('teacher.t_id', '=', 'match_std_tch.t_id').andOn('group.g_code', '=', 'match_std_tch.g_code')
    })
    .where("teacher.t_id","=",req.body.t_id)
    console.log(rows)
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
/////////////////////////////////// search ////////////////////////////////
router.post("/search",async(req,res)=>{
  try{
    let db=req.db
    let rows = await req.db('group').select('*').orderBy("group.g_code","desc")
    .where("group.t_status","!=",0)
    .innerJoin("department","group.d_code","department.d_code")
    .where("group.g_code","like",'%'+req.body.txt_search+'%')
    .orWhere("group.g_name","like",'%'+req.body.txt_search+'%')
    .orWhere("department.d_name","like",'%'+req.body.txt_search+'%')
    res.send({
      ok: true,
      datas: rows,
    })
  }catch(e){res.send({ ok: false, error: e.message })}
})
router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('group').select('*').orderBy("group.g_code","desc")
    .innerJoin('department', 'group.d_code', 'department.d_code')
    .where("group.t_status","!=",0)
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
router.post('/cus_select', async (req, res) => {//console.log(req.params.select)
    try {
      let rows = await req.db('group').select("g_code","g_name").where({
        d_code:req.body.t_dep
      })
      res.send({
        ok: true,
        datas: rows,
      })
    }catch(e){res.send({ ok: false, error: e.message })}
})


router.get("/sh_group/:g_id",async(req,res)=>{
  console.log('param='+req.params.g_id)
  try{
    let db = req.db
    let row = await req.db('group').select('*').where({
      g_id: req.params.g_id
    })
    .innerJoin('department', 'group.d_code', 'department.d_code')

    let num_rows=await req.db("group")
    .innerJoin('student', 'group.g_code', 'student.g_code')
    .count("std_id as count")
    .where("g_id",req.params.g_id)
    res.send({
      ok:true,
      datas: row[0] || {},
      nums:num_rows,
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

router.post("/group_add",async (req,res)=>{
  try{
    let g_id=await req.db("group").insert({
      	g_code:req.body.g_code,
        d_code:req.body.d_code,
        g_name:req.body.g_name,
    })
    let log=await req.db("group_log").insert({
    	g_id:g_id,
    	g_code:req.body.g_code,
      g_name:req.body.g_name,
      d_code:req.body.d_code,
      u_id:req.body.u_id,
      g_log_work:"เพิ่มข้อมูล",
    })
    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.g_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (add!) ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/group_del",async (req,res)=>{
  try{
    let g_id=await req.db("group").update({t_status:"0"}).where({
      g_id:req.body.g_id
    })
    let log=await req.db("group_log").insert({
      g_id:req.body.g_id,
    	g_code:req.body.g_code,
      g_name:req.body.g_name,
      d_code:req.body.d_code,
      u_id:req.body.u_id,
      g_log_work:"ลบข้อมูล",
    })
    res.send({ok:true,txt:"ลบข้อมูล "+req.body.g_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (del!) ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
router.post("/group_update",async(req,res)=>{//console.log(req.body.g_id)
  try{
    let sql=await req.db("group").update({
      g_code:req.body.g_code,
      g_name:req.body.g_name,
    }).where({
      g_id:req.body.g_id
    })
    let log=await req.db("group_log").insert({
      g_id:req.body.g_id,
    	g_code:req.body.g_code,
      g_name:req.body.g_name,
      u_id:req.body.u_id,
      g_log_work:"แก้ไขข้อมูล",
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.g_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"(-_-') (update!) ไม่สามารถแก้ไขข้อมูล "+req.body.g_code+" ได้",alt:"error"})}
})


router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      g_code:rows[0].g_code,
      g_name:rows[0].g_name,
      d_name:rows[0].d_name,
    }).where({g_id:rows[0].g_id})
    let log=await req.db(req.body.data).insert({
    	g_id:rows[0].g_id,
    	g_code:rows[0].g_code,
      g_name:rows[0].g_name,
      d_code:rows[0].d_code,
      u_id:req.body.u_id,
      g_log_work:"เรียกคืนข้อมูล",
    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].g_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})
