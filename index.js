const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoDBstore = require('connect-mongodb-session')(session)
const app = express()
const config = require('./config')

app.use(bodyParser.json())  // ประกาศไว้เพื่อใช้หน้าอื่นๆ ส่งข้อมูลแบบ json
app.set('trust proxy', 1) // trust first proxy // midle ware จะทำให้มี req.session
app.use(session({
  secret: 'eec!secret',
  //store,
  cookie: {
   maxAge: 15 * 60 * 1000, // 15 min
   // secure: true  // หมายถึง https:// การรับสั่งจะผ่าน https เท่านั้น
  },
  rolling: true,
  resave:  true,
  saveUninitialized: true,
}))
app.use((req, res, next) => {
    var header = { 'Access-Control-Allow-Origin': '*'}
    for (var i in req.headers){
        if (i.toLowerCase().substr(0, 15) === 'access-control-'){
            header[i.replace(/-request-/g, '-allow-')] = req.headers[i]
        }
    }
    //res.header(header)  // แบบเก่า
    res.set(header)   // แบบใหม่
    next()
})
app.use((req, res, next) => {   // ทำให้เกิด  req.db
    req.db = require('./lib/db')
    next()
})

//app.use('/auth')
app.use('/api', require('./api'))
app.use('/user', require('./api/user'))

app.use('/student', checkSession, require('./api/student'))// ต้อง บอกแบบ rerative  path
// app.use('/business', require('./api/business'))


function checkSession(res, res, next){
    // check session
    let ok = req.session.data && req.session.data.id
    if (!ok){
     return res.send({status: false, session: null})
    }
    next()
}

app.listen(config.port, () => {
    console.log('ready', `listening on port${config.port}`)
  })
  