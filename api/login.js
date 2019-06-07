const express = require('express')
const router = express.Router()

module.exports = router

router.post("/", async (req, res) => {
  // 1. check require
  if (!req.body.user || !req.body.pass) {
    return res.send({
      message: "กรุณาตรวจสอบชื่อผู้ใช้งานและรหัสผ่าน",
      status: "fail"
    });
  }
  let db = req.db;
  console.log('user=>',req.body.user)
  //2. check user
  console.log("chaeck user", req.body.user);
  let rows = await db("person").where({
    username: req.body.user
   
  });
  //users = JSON.parse(JSON.stringify(rows));
  console.log("rows.length", rows.length);
  if (rows.length == 0) {
    return res.send({
      message: "กรุณาตรวจสอบชื่อผู้ใช้งานและรหัสผ่าน",
      status: "fail",
      rows: "ไม่ถูกต้อง"
    });
  }
  
  console.log("login ok");
  //users = JSON.parse(JSON.stringify(rows));
  console.log("user::", rows);
  let user = rows[0];
  res.send({
    ok: true,
    message: "เข้าสู่ระบบสำเร็จ",
    status: "success",
    user
  });
});