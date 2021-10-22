const pool = require('../db/index');
const bcrypt = require('bcryptjs')

// 获取用户信息接口
module.exports.userInfo = (req, res) => {
  const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`;
  // 数据库的操作
  // req.user.id 客户端携带的token值中有我们自己传入的信息 被挂载在req.user上
  pool.query(sql, req.user.id, (err, result) => {
    if (err) return res.cc(err);

    if (result.length !== 1) return res.cc('获取用户信息失败！');

    // 成功后 响应
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: result[0]
    })
  })
}

// 更新用户的基本信息
module.exports.updateUserInfo = (req, res) => {
  // 判断用户信息的合法性
  if (!req.body.id) return res.cc('非法输入！！');

  const sqlStr = 'UPDATE ev_users SET ? where id = ?';
  // 数据库操作
  pool.query(sqlStr, [req.body, req.body.id], (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return res.cc('更新用户基本信息失败！');

    res.cc('修改用户基本信息成功！', 0);
  })

}


// 更改密码的处理函数 
exports.updatePassword = (req, res) => {
  // 对用户的信息经行合法验证
  if (!req.body.oldPwd || !req.body.newPwd) return res.cc('非法输入!!!');

  // 根据id查询用户是否存在
  const sqlStr = 'SELECT * FROM ev_users WHERE id = ?';
  pool.query(sqlStr, req.user.id, (err, result) => {
    if (err) return res.cc(err);
    // 查询失败
    if (result.length !== 1) res.cc('该用户不存在!');
    // 查询成功
    // 判断原密码是否和数据库的原密码相同
    const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password);

    if (!compareResult) return res.cc('原密码不正确');

    // 更新密码
    const sqlStr = 'UPDATE ev_users SET password = ? WHERE id = ?';

    // 对密码经行加密
    req.body.newPwd = bcrypt.hashSync(req.body.newPwd, 10);

    pool.query(sqlStr, [req.body.newPwd, req.user.id], (err, result) => {
      if (err) return res.cc(err);
      if (result.affectedRows !== 1) return res.cc('修改密码失败!')
      res.cc('修改密码成功!', 0)
    })
  })
}

// 更新用户头像
module.exports.updateAvatar = (req, res) => {
  // 对用户的信息经行合法验证
  if (!req.body.avatar) return res.cc('非法输入!!');

  // 数据库操作
  const sqlStr = 'UPDATE ev_users SET user_pic = ? WHERE id = ? ';
  pool.query(sqlStr, [req.body.avatar, req.user.id], (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return res.cc('更新用户头像失败!');
    res.cc('更新用户头像成功!', 0);
  })
}