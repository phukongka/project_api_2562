const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/files/img/object_control')
  },
  filename: function (req, file, cb) {
    cb(null, "veh-oc" + '-' + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })
module.exports = router



//////////////////////////// missing_chart ///////////////////////////////
router.post('/missing_chart',async(req,res)=>{console.log("missing_chart")
  try{
    let db=req.db
    let pk_machine_all=await db("pk_machine").select("*").where("t_status","!=","0")
    let pk_accessories_all=await db("pk_accessories").select("*").where("t_status","!=","0")
    let pk_missing_all=await db("pk_missing").select("*")
    let pk_object_control_all=await db("pk_object_control").select("*")

    let chart_ms=await db("pk_missing").select("ms_chart_month").groupBy("ms_chart_month").count("ms_id as num")
    let chart_oc=await db("pk_object_control").select("oc_chart_month").groupBy("oc_chart_month").count("oc_id as num")
    res.send({
      ok:true,
      pk_machine_all,pk_missing_all,pk_object_control_all,pk_accessories_all,
      chart_ms,chart_oc

    })
  }catch(e){res.send({
    ok:false,
    error:e.message
  })}
})
