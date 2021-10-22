// 数据库  连接池

const mysql = require('mysql')

// 创建连接池
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'userdb',
  connectionLimit: 20
})

// 导出数据库连接对象
module.exports = pool;