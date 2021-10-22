// 这里定义的是和用户路由相关的处理函数

// 导入数据库对象
const pool = require('../db/index');
const jwt = require('jsonwebtoken');


// 导入配置密钥模块
const config = require('../config');

// 导入解密对象
// 随机盐长度一般是10
// bcrypt.hashSync(明文密码, 随机盐的长度) 返回值就是加密后的字符串
const bcrypt = require('bcryptjs');


// 用户注册处理函数
exports.reguser = (req, res) => {
  // 接收客户端的数据
  const userInfo = req.body;
  // 判断用户输入的信息是否合法
  if (!userInfo.username || !user.password) return res.cc('非法输入！！');
  // 查询数据库是否有重名的用户名
  // res.cc()  自定义的响应错误信息的中间件
  const sqlStr = 'SELECT username FROM ev_users WHERE username = ?';
  pool.query(sqlStr, userInfo.username, (err, result) => {
    if (err) return res.cc(err);
    // 如果长度大于0 代表用户名重复
    if (result.length > 0) {
      res.cc('用户名重复！')
    } else {
      // 向数据库插入数据
      // 加密密码
      userInfo.password = bcrypt.hashSync(userInfo.password, 10)
      // return console.log(userInfo);
      const sqlStr = 'INSERT INTO ev_users SET ?'
      pool.query(sqlStr, { username: userInfo.username, password: userInfo.password }, (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows > 0) {
          res.cc('注册成功！', 0)
        } else {
          res.cc('注册失败')
        }
      })
    }
  })

}

// 用户登录处理函数
exports.login = (req, res) => {
  // 接收用户的信息
  const userInfo = req.body;
  // 判断用户输入的信息是否合法
  if (!userInfo.username || !userInfo.password) return res.cc('非法输入！！');
  // 查询数据库
  const sqlStr = 'SELECT id,username,password,nickname,email,user_pic FROM ev_users WHERE username = ?';
  pool.query(sqlStr, [userInfo.username], (err, result) => {
    if (err) return res.cc(err);

    if (result.length !== 1) return res.cc('登录失败');

    // 对比密码  看数据库是否一致
    // 使用bcrypt.compareSync(value1,value2) 返回值为bool
    const compareResult = bcrypt.compareSync(userInfo.password, result[0].password);

    if (!compareResult) return res.cc('登录失败！');

    // 将生成的token响应给客户端
    // 剔除密码和头像 这是敏感信息
    const user = { ...result[0], password: '', user_pic: '' }

    // 利用jwt.sign()生成加密的token
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresin });
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr
    })

  })
}