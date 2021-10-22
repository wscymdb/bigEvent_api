// 文章分类的处理函数

const pool = require('../db/index');

// 获取文章分类列表的处理函数
exports.getArticleCates = (req, res) => {
  // 数据库操作
  const sqlStr = 'SELECT id,name,alias,is_delete FROM ev_article_cate WHERE is_delete = 0 ORDER BY id ASC ';
  pool.query(sqlStr, (err, result) => {
    if (err) return res.cc(err);
    // console.log(result);
    if (result.length < 1) return res.cc('获取文章分类列表失败！');
    res.send({
      status: 0,
      message: '获取文章分类列表成功！',
      data: result
    })
  })
}

// 添加文章分类的处理函数
exports.addArticCates = (req, res) => {
  // 对用户的信息经行合法验证
  if (!req.body.name || !req.body.alias) return res.cc('非法输入！！');
  // 查询分类的名称和别名是否被占用
  const sqlStr = 'SELECT id,name,alias,is_delete FROM ev_article_cate WHERE name = ? OR alias = ?';
  pool.query(sqlStr, [req.body.name, req.body.alias], (err, result) => {
    if (err) return res.cc(err);
    // 分别判断别名和分类名称哪个被占用
    if (result.length === 2) return res.cc('分类名称和别名被占用，请更换！');
    if (result.length === 1 && result[0].name === req.body.name) return res.cc('分类名称被占用，请更换！');
    if (result.length === 1 && result[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换！');

    // 这步是确保自增长的值正确 因为如果有重复的值那么就会插入失败 但是auto_increment的值会加一
    // 每次经行操作之后 重置一下自增长的值 他就会接着id的值继续增加
    const sqlStr = 'ALTER TABLE ev_article_cate AUTO_INCREMENT =1';
    pool.query(sqlStr, (err, result) => {
      if (err) return res.cc(err);


      // 添加文章分类
      const sqlStr = 'INSERT INTO ev_article_cate SET ?';
      pool.query(sqlStr, req.body, (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('添加文章分类失败！！');
        res.cc('添加文章分类成功！！', 0);
      })
    })

  })
}

// 根据Id删除文章分类
exports.deleteCateById = (req, res) => {
  console.log(req.params);
  // 对用户的信息经行合法验证
  if (!req.params.id) return res.cc('非法输入！！');

  // 数据库操作
  // 判断删除的数据是否是科技和历史两个分类
  const sqlStr = 'SELECT id,name,alias,is_delete FROM ev_article_cate WHERE id = ?';
  pool.query(sqlStr, req.params.id, (err, result) => {
    if (err) return res.cc(err);
    if (result[0].name === '科技' || result[0].name === '历史') return res.cc('不允许删除历史或科技的分类');
    // 删除文章分类数据
    const sqlStr = 'UPDATE ev_article_cate SET ? WHERE id = ?';
    pool.query(sqlStr, [{ is_delete: 1 }, req.params.id], (err, result) => {

      if (err) return res.cc(err);
      if (result.affectedRows !== 1) res.cc('删除文章分类失败！！');
      res.cc('删除文章分类成功！', 0);
    })
  })

}

// 根据Id获取文章分类数据
exports.getArticleById = (req, res) => {
  // 对用户的信息经行合法验证
  if (!req.params.id) return res.cc('非法输入！！');
  // 数据库操作
  const sqlStr = 'SELECT id,name,alias,is_delete FROM ev_article_cate WHERE id = ? AND is_delete = 0';
  pool.query(sqlStr, req.params.id, (err, result) => {
    if (err) return res.cc(err);
    if (result.length !== 1) return res.cc('查询文章分类数据失败！');
    res.send({
      status: 0,
      message: '查询文章分类数据成功！',
      data: result[0]
    })
  })
}

// 根据Id更新文章分类数据
exports.updateCateById = (req, res) => {
  // 对用户的信息经行合法验证
  if (!req.body.name || !req.body.alias || !req.body.id) return res.cc('非法输入！！');
  // 查询分类的名称和别名是否被占用
  const sqlStr = 'SELECT id,name,alias,is_delete FROM ev_article_cate WHERE (name = ? OR alias = ?) AND id <> ?';
  pool.query(sqlStr, [req.body.name, req.body.alias, req.body.id], (err, result) => {
    if (err) return res.cc(err);
    // 分别判断别名和分类名称哪个被占用
    if (result.length === 2) return res.cc('分类名称和别名被占用，请更换！');
    if (result.length === 1 && result[0].name === req.body.name) return res.cc('分类名称被占用，请更换！');
    if (result.length === 1 && result[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换！');
    // 更新文章分类数据
    const sqlStr = 'UPDATE ev_article_cate SET ? WHERE id = ?';
    pool.query(sqlStr, [req.body, req.body.id], (err, result) => {
      if (err) return res.cc(err);

      if (result.affectedRows !== 1) return res.cc('更新文章分类数据失败！！');
      res.cc('更新文章分类数据成功！！', 0)
    })
  })


}