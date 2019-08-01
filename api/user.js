const express = require("express");
const router = express.Router();

module.exports = router;
// /user/disactive
// /user/id/:id
// /user/
// /user/login
// /user/token

let tokenList = {};

/// get user ตามรหัส
// router.get("/:code?", async (req, res) => {
//   let db = req.db;
//  console.log('user=>list',req.params)
//   let rows = await db.
//   raw(
//     `SELECT * FROM work_time AS wt,teacher AS t WHERE t.teacher_code = wt.person_id AND wt.person_id = ${req.params.code}  ORDER BY wt.date_in `
//   );
//   console.log("ok=search");
//   // users = JSON.parse(JSON.stringify(rows));
//   console.log("rows.length", rows.length);
//   if (rows.length == 0) {
//     return res.send({
//       message: "ไม่มีข้อมูลในระบบคะ.!",
//       status: "fail"
//     });
//   }
//   res.send({
//     ok: true,
//     message: "select complete",
//     status: "success",
//     user: rows[0]
//   });
// });
 
// post query

// router.post("/:code?", async (req, res) => {
//   let db = req.db;
//  //console.log('user=>list',req.body.username)
//  //let username = JSON.stringify(req.body.username)
//  //console.log('user=>tranfrom=>',req.body.username)
//   //let rows = await db.
//  // raw(
//  //   `SELECT * FROM work_time AS wt,teacher AS t WHERE t.teacher_code = wt.person_id AND wt.person_id = '${req.body.username}'  ORDER BY wt.date_in `
//  // )
//  let rows = await db.raw(`SELECT * FROM work_time WHERE person_id = '${username}' `)
//   console.log("ok=search");
//   // users = JSON.parse(JSON.stringify(rows));
//   console.log("rows.length", rows.length);
//   console.log("detailuser=>", rows);
//   if (rows.length == 0) {
//     return res.send({
//       message: "ไม่มีข้อมูลในระบบคะ.!",
//       status: "fail"
//     });
//   }
//   res.send({
//     ok: true,
//     message: "select complete",
//     status: "success",
//     user: rows[0]
//   });
// });


//  ลงเวลาปฏิบิตงาน
router.post("/signin", async (req, res) => {
  // 1. check require
  if (!req.body.user) {
    return res.send({
      message: "กรุณากรอก USERNAME ลงเวลา",
      status: "fail"
    });
  }
  let db = req.db;
  //2. check user
  //console.log("chaeck user", req.body.user);
  let rows = await db("person").where({
    username: req.body.user
    //status: 'active',
  });
  //users = JSON.parse(JSON.stringify(rows));
  //console.log("rows.length", rows.length);
  if (rows.length == 0) {
    return res.send({
      message: "กรุณากรอก USERNAME ลงเวลาด้วยคะ.!",
      status: "fail"
    });
  }
  // TODO: 3. INSERT USERNAME INTO TABLE

  // let rows = await db("person").where({
  //   username: req.body.user
  //   //status: 'active',
  // });
 console.log('insert=>',req.body)
  let id = await db("work_time").insert({
    person_id: req.body.user,
   // start_time: req.body.start_time,
    date_in: req.body.date_in,
    status: req.body.status,
    // status: rows[0].status
  });
  // .then(ids => ids[0]);
  if (id) {
    console.log("id=>", id);
    console.log("login ok");
    //users = JSON.parse(JSON.stringify(rows));
    //console.log("user::", rows);
    let user = rows[0];
    res.send({
      ok: true,
      message: "insert complete",
      status: "success",
      user
    });
  } else {
    res.send({
      ok: false,
      message: "insert error",
      status: "error"
    });
  }
});

//////Sign  OUT


router.post("/signout", async (req, res) => {
  // 1. check require
  if (!req.body.user) {
    return res.send({
      message: "กรุณากรอก USERNAME เพื่อลงเวลาออก",
      status: "fail"
    });
  }
  let db = req.db;
  //2. check user
  //console.log("chaeck user", req.body.user);
  let rows = await db("work_time").where({
    person_id: req.body.user
    //status: 'active',
  });
  //users = JSON.parse(JSON.stringify(rows));
  //console.log("rows.length", rows.length);
  if (rows.length == 0) {
    return res.send({
      message: " คุณไม่ได้ลงเวลามาทำงานคะ กรุณาติดต่องานบุคลากร..!",
      status: "fail"
    });
  }
 console.log('update=>',req.body)
 let date_out = JSON.stringify(req.body.date_out)
 let person_id = req.body.user
  let id = await db.raw(`UPDATE work_time SET date_out=${date_out} WHERE person_id=${person_id}`);
  // .then(ids => ids[0]);
  if (id) {
    console.log("id=>", id);
    console.log("Update ok");
    //users = JSON.parse(JSON.stringify(rows));
    //console.log("user::", rows);
    let user = rows[0];
    res.send({
      ok: true,
      message: "UPDATE complete",
      status: "success",
      user
    });
  } else {
    res.send({
      ok: false,
      message: "UPDATE error",
      status: "error"
    });
  }
});


//// รายงาน
  router.post("/listuser_day", async (req, res) => {
    let db = req.db;
    let rows = await db.raw(
      "SELECT * FROM work_time AS wt,teacher AS t WHERE t.teacher_code = wt.person_id ORDER BY wt.date_in  "
    );
    console.log("ok=search");
    // users = JSON.parse(JSON.stringify(rows));
    console.log("rows.length", rows.length);
    if (rows.length == 0) {
      return res.send({
        message: "ไม่มีข้อมูลในระบบคะ.!",
        status: "fail"
      });
    }
  // let user = rows;
  res.send({
    ok: true,
    message: "select complete",
    status: "success",
    user: rows[0]
  });
  });

//รายงานรายบุคคล

router.post("/list_per_user", async (req, res) => {
  let db = req.db;
 console.log('user=>list',req.body)
  let rows = await db.
  raw(
    "SELECT * FROM work_time AS wt,teacher AS t WHERE t.teacher_code = wt.person_id AND wt.person_id = req.body.user ORDER BY wt.date_in  "
  );
  console.log("ok=search");
  // users = JSON.parse(JSON.stringify(rows));
  console.log("rows.length", rows.length);
  if (rows.length == 0) {
    return res.send({
      message: "ไม่มีข้อมูลในระบบคะ.!",
      status: "fail"
    });
  }
  // let user = rows;
  res.send({
    ok: true,
    message: "select complete",
    status: "success",
    user: rows[0]
  });
});


//รายงานรายบุคคล

router.post("/report_condition", async (req, res) => {
  let db = req.db;
 console.log('user=>list',req)
  let rows = await db.
  raw(
    "SELECT * FROM work_time AS wt,teacher AS t WHERE t.teacher_code = wt.person_id AND status='มาทำงาน' ORDER BY wt.date_in  "
  );
  console.log("ok=search");
  // users = JSON.parse(JSON.stringify(rows));
  console.log("rows.length", rows.length);
  if (rows.length == 0) {
    return res.send({
      message: "ไม่มีข้อมูลในระบบคะ.!",
      status: "fail"
    });
  }
  // let user = rows;
  res.send({
    ok: true,
    message: "select complete",
    status: "success",
    user: rows[0]
  });
});



//rows = [[{ id, person_id }, {}, {}], [{ name: "id", type: "number" }]];
