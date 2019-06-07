const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files/img/teachers')
  },
  filename: function (req, file, cb) {
    cb(null, "veh-t" + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })

module.exports = router

router.get('/', async (req,res)=>{
    consolr.log("teacher")
})
router.get('/list', async (req, res) => {
  try {
    let rows = await req.db('pk_teacher').select('*').where("t_Status","!=",0)
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.get("/sh_teacher/:t_id",async(req,res)=>{
  console.log('param='+req.params.t_id)
  try{
    let db = req.db
    let row = await db('pk_teacher').select(
      "pk_teacher.t_id",
      "pk_teacher.t_code",
      "pk_teacher.t_name",
      "pk_teacher.t_dep",
      "pk_teacher.t_tel",
      "pk_teacher.t_username",
      "pk_teacher.t_password",
      "pk_teacher.t_status",
      "pk_department.d_name",
      "pk_group.g_name",

    )
    .innerJoin('pk_department', 'pk_teacher.t_dep', 'pk_department.d_code')
    .innerJoin('pk_group', 'pk_group.d_code', 'pk_department.d_code')

    .where({
      t_id: req.params.t_id
    })
    console.log("row[0].t_id")
    console.log(row[0].t_id)
    let img=await db("pk_img").select("*").where("u_code","=",row[0].t_id).where("u_table","pk_teacher")
    console.log(row)
    console.log(img)
    res.send({
      ok:true,
      datas: row || {},
      image:img
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})
////////////////////////////  select t_id ///////////////////////////////
router.post('/t_id', async (req, res) => {
  try {
    let rows = await req.db('pk_teacher').select('*').where("t_status","!=","0")
    .where("t_code","like",'%'+req.body.t_code+'%')
    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
router.post("/teacher_add",upload.any(),async (req,res)=>{
  try{
    let db=req.db
    let chk_teacher=await db("pk_teacher").where("t_code",req.body.t_code)
    if(chk_teacher.length==0){
      let t_id=await req.db("pk_teacher").insert({
        	t_code:req.body.t_code,
          t_name:req.body.t_name,
          t_dep:req.body.t_dep,
          t_tel:req.body.t_tel,
        	t_username:req.body.t_code,
        	t_password:req.body.t_tel
      })
      var cv_str=req.body.mst_1
      var sp=cv_str.split(",")
      for(i=1;i<sp.length;i++){
        let pk_match_std_tch=await req.db("pk_match_std_tch").insert({
          t_id:t_id,
          g_code:sp[i]
        })
      }

      if(req.files.length==0){
        let img=await req.db("pk_img").insert({
            img_img:"veh-u-default.jpg",
            u_table:req.body.u_table,
            u_code:t_id,
        })

      }
      else{
        for(let i=0;i<req.files.length;i++){
          let img=await req.db("pk_img").insert({
              img_img:req.files[i].filename,
              u_table:req.body.u_table,
              u_code:t_id,
          })

        }
      }
      let log=await req.db("pk_teacher_log").insert({
        t_id:t_id,
        t_code:req.body.t_code,
        t_name:req.body.t_name,
        d_code:req.body.t_dep,
        t_tel:req.body.t_tel,
        t_username:req.body.t_code,
        t_password:req.body.t_tel,
        t_log_work:"เพิ่มข้อมูล",
        u_id:req.body.u_id
      })
    }
    else{
      res.send({ok:false,txt:"พบข้อมูล "+req.body.t_code+" อยู่ในระบบอยู่แล้ว",alt:"error"})
    }


    res.send({ok:true,txt:"เพิ่มข้อมูล "+req.body.t_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่มข้อมูลได้",alt:"error"})}
})

router.post("/teacher_del",async (req,res)=>{//console.log(req.params.t_id)
  try{
    let t_id=await req.db("pk_teacher").update({t_status:"0"}).where({
      t_id:req.body.t_id
    })
    let log=await req.db("pk_teacher_log").insert({
        t_id:req.body.t_id,
      	t_code:req.body.t_code,
        t_name:req.body.t_name,
        d_code:req.body.t_dep,
        t_tel:req.body.t_tel,
      	t_username:req.body.t_code,
      	t_password:req.body.t_tel,
        t_log_work:"ลบข้อมูล",
        u_id:req.body.u_id
    })

    res.send({ok:true,txt:"ลบข้อมูล "+req.body.t_id+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลบข้อมูลได้",alt:"error"})}
})
//////////////////////// search ///////////////////////////////
router.post('/search/', async (req, res) => {
  try {
    let rows = await req.db('pk_teacher').select('*').orderBy("pk_teacher.t_id","desc")
    .where("t_status","!=",0)
    .where("t_name","like",'%'+req.body.txt_search+'%')
    .orWhere("t_code","like",'%'+req.body.txt_search+'%')

    res.send({
      ok: true,
      datas: rows,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})
///////////////////////////////////////////////////////////////
router.post("/teacher_update",upload.any(),async(req,res)=>{//console.log(req.body.t_id)
  try{
    let sql=await req.db("pk_teacher").update({
        t_code:req.body.t_code,
        t_name:req.body.t_name,
        t_tel:req.body.t_tel,
        t_username:req.body.t_username,
      	t_password:req.body.t_password
    }).where({
      t_id:req.body.t_id
    })
    for(let i=0;i<req.files.length;i++){
      var cv_str=req.files[i].fieldname
      var sp=cv_str.split("-")
      let sel=sp[1]
      let img=await req.db("pk_img").update({
        	img_img:req.files[i].filename,
      }).where("img_id","=",sel)
    }
    // let pk_match_std_tch1=await req.db("pk_match_std_tch").update({
    //   t_id:req.body.t_code,
    //   g_code:req.body.mst_1
    // }).where({t_id:req.body.t_code})
    // let pk_match_std_tch2=await req.db("pk_match_std_tch").update({
    //   t_id:req.body.t_code,
    //   g_code:req.body.mst_2
    // }).where({t_id:req.body.t_code})
    // let pk_match_std_tch3=await req.db("pk_match_std_tch").update({
    //   t_id:req.body.t_code,
    //   g_code:req.body.mst_3
    // }).where({t_id:req.body.t_code})
    let log=await req.db("pk_teacher_log").insert({
        t_id:req.body.t_id,
      	t_code:req.body.t_code,
        t_name:req.body.t_name,
        d_code:req.body.t_dep,
        t_tel:req.body.t_tel,
      	t_username:req.body.t_code,
      	t_password:req.body.t_tel,
        t_log_work:"แก้ไขข้อมูล",
        u_id:req.body.u_id
    })
    res.send({ok:true,txt:"แก้ไขข้อมูล "+req.body.t_code+" สำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล "+req.body.t_code+" ได้",alt:"error"})}
})


router.post('/restore', async (req, res) => {
  try {
    let rows = await req.db(req.body.data).select('*').where({run_id: req.body.id})
    let restore=await req.db(req.body.target).update({
      t_status:1,
      t_code:rows[0].t_code,
      t_name:rows[0].t_name,
      t_dep:rows[0].d_code,
      t_tel:rows[0].t_tel,
      t_username:rows[0].t_username,
      t_password:rows[0].t_password,
    }).where({t_id:rows[0].t_id})
    let log=await req.db(req.body.data).insert({
      t_id:rows[0].t_id,
      t_code:rows[0].t_code,
      t_name:rows[0].t_name,
      d_code:rows[0].d_code,
      t_tel:rows[0].t_tel,
      t_username:rows[0].t_username,
      t_password:rows[0].t_password,
      t_log_work:"เรียกคืนข้อมูล",
      u_id:req.body.u_id

    })
    res.send({
      ok:true,txt:"เรียกคืนข้อมูล "+rows[0].t_name+" สำเร็จ",alt:"success"
    })
  } catch (e) {
    res.send({ ok: false,txt:"(-_-') (restore!) ไม่สามารถเรียกคืนข้อมูลได้",alt:"error"})
  }
})

router.post('/sh_profile', async (req, res) => {
  try {
    let db = req.db
    let row = await db('pk_teacher').select(
      "pk_teacher.t_id",
      "pk_teacher.t_code",
      "pk_teacher.t_name",
      "pk_teacher.t_dep",
      "pk_teacher.t_tel",
      "pk_teacher.t_username",
      "pk_teacher.t_password",
      "pk_teacher.t_status",
    )
    .where({
      t_id: req.body.id
    })
    // console.log("row[0].t_id")
    // console.log(row[0].t_id)
    let img=await db("pk_img").select("*").where("u_code","=",row[0].t_id).where("u_table","pk_teacher")
    // console.log(row)
    // console.log(img)
    res.send({
      ok:true,
      datas: row || {},
      image:img
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})

router.post("/profile_update",upload.any(),async(req,res)=>{
  try{
    let sql=await req.db("pk_teacher").update({
        t_name:req.body.t_name,
        t_tel:req.body.t_tel,
    }).where({
      t_id:req.body.id
    })
    for(let i=0;i<req.files.length;i++){
      var cv_str=req.files[i].fieldname
      var sp=cv_str.split("-")
      let sel=sp[1]
      let img=await req.db("pk_img").update({
        	img_img:req.files[i].filename,
      }).where("img_id","=",sel)
    }
    res.send({ok:true,txt:"อัพเดทข้อมูลแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถอัพเดทข้อมูลได้",alt:"error"})}
})

router.post("/security_update",async(req,res)=>{
  try{
    if(req.body.cv_set==="username"){
        let sql=await req.db("pk_teacher").update({
            t_username:req.body.t_username
        }).where({t_id:req.body.t_id})
    }
    else if(req.body.cv_set==="password"){
        let sql=await req.db("pk_teacher").update({
            t_password:req.body.t_password
        }).where({t_id:req.body.t_id})
    }
    res.send({ok:true,txt:"อัพเดทข้อมูลแล้ว",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถอัพเดทข้อมูลได้",alt:"error"})}
})
