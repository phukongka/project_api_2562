const util = require('./util')
const config = require('../config')

const knex = require('knex')({
  client: 'mysql',
  connection: config.db,
  debug: true,
 
})
console.log("*****db****");
module.exports = knex
