const express = require('express')
const router = express.Router()

module.exports = router

router.use('/login', require('./login'))
router.use('/department', require('./department'))
router.use('/group', require('./group'))
router.use('/student', require('./student'))
router.use('/upload', require('./upload'))
router.use('/teacher', require('./teacher'))
router.use('/dashboard', require('./dashboard'))

