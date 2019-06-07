var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    // database : 'dve_tvet',
    database: "ctc_smart"
  },
  debug: true
});
console.log("*****db****");

module.exports = knex;


