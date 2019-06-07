module.exports = {
  port: 9000,
  db: {
    port:process.env.MYSQL_PORT || 3306,
    host :process.env.MYSQL_HOST || 'localhost',
    user :process.env.MYSQL_USER || 'root',
    password : process.env.MYSQL_PASS || '',
    database :  process.env.MYSQL_DATABASE ||  'ctc_smart',
    timezone: 'asia/bangkok',
  },
  socket: {
    url: 'https://socket.bpcd.xenex.io',
    user: 'bpcd',
    pass: 'bpcd!@1234',
  },
}
