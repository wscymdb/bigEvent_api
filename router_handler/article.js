// 操作文章相关的路由
const pool = require('../db/index');

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })


// 获取文章列表相关的接口
exports.getArtlist = (req, res) => {
  // 查询数据便的数据总数
  const sql = 'SELECT COUNT(id) FROM ev_articles WHERE is_delete = 0';
  pool.query(sql, (err, result) => {
    if (err) return res.cc(err);
    // 成功后将数据总量挂载到res对象上
    res.ev_total = result[0]['COUNT(id)'];
  })
  // 为页码和每页显示的数量设置默认值
  req.query.pagesize = req.query.pagesize ? Number(req.query.pagesize) : 5;
  req.query.pagenum = req.query.pagenum ? req.query.pagenum : 1;
  // 计算页码的索引
  req.query.pagenum = Number((req.query.pagenum - 1) * req.query.pagesize);
  // 数据库分页查询
  // console.log(req.query);
  //  const sqlStr = 'SELECT id,title,content,cover_img,pub_date,state,is_delete,cate_id,author_id FROM ev_articles WHERE is_delete = 0 ORDER BY id LIMIT ?,? ';
   const sqlStr = 'SELECT ev_articles.id,ev_articles.title,ev_articles.content,ev_articles.cover_img,ev_articles.pub_date,ev_articles.state,ev_articles.is_delete,ev_articles.cate_id,ev_articles.author_id,ev_article_cate.name FROM ev_articles LEFT JOIN ev_article_cate ON ev_articles.cate_id = ev_article_cate.id WHERE ev_articles.is_delete =0 ORDER BY ev_articles.id LIMIT ?,?';
  pool.query(sqlStr, [req.query.pagenum, req.query.pagesize], (err, result) => {
    if (err) return res.cc(err);

    if (result.length < 1) return res.cc('获取文章列表失败！！！');
    res.send({
      status: 0,
      message: '获取文章列表成功！！',
      data: result,
      total: res.ev_total
    });
  })

}

// 发布文章
exports.addArticle = (req, res) => {
  // console.log(req.body) // 文本类型的数据
  // console.log('--------分割线----------')
  // console.log(req.file) // 文件类型的数据
  // 对客户的文本信息经行合法性验证
  if (!req.body.title || !req.body.cate_id || !req.body.content || !req.body.state) return res.cc('非法输入');
  // 对客户端的文件经行验证
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');

  // 添加文章分类
  const articleInfo = {
    // 文章的标题、内容、状态、所属分类的id
    ...req.body,
    // 文章封面在服务器的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章的发布时间
    pub_date: new Date(),
    // 文章作者的ID
    author_id: req.user.id
  }
  const sqlStr = 'INSERT INTO ev_articles SET ?';
  pool.query(sqlStr, articleInfo, (err, result) => {
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return res.cc('发布文章失败！！');

    res.cc('发布文章成功！！', 0);
  })
}

// 根据Id删除文章
exports.deleteArticle = (req,res) => {
  // 对用户的信息进行验证
  if (!req.params.id) return res.cc('非法输入！！！')
  // 删除文章数据
  const sqlStr = 'UPDATE ev_articles SET is_delete = 1 WHERE id = ?';
  pool.query(sqlStr,req.params.id,(err,result)=>{
    if (err) return res.cc(err);
    if (result.affectedRows !==1) return res.cc('删除文章失败！！！');
    res.cc('删除文章数据成功！',0);
  })
}

// 根据id获取文章详情
exports.getArticle = (req,res) => {
  // 对数据经行合法验证 
  if (!req.params.id) return res.cc('非法输入！！！');
  // return  console.log(req.params.id);
  // 查询数据库操作
  const sqlStr = 'SELECT *  FROM ev_articles WHERE id = ?';
  pool.query(sqlStr,req.params.id,(err,result)=>{
    if (err) return res.cc(err);
    // console.log(result);
    if (result.length !==1) return res.cc('获取文章详情失败！！');
    res.send({
      status:0,
      message:'获取文章详情成功！！',
      data:result[0]
    })
  })
}

// 根据id更新文章详情
exports.updateArticle =(req,res) => {
  // console.log(req.body);
  //  console.log('--------分割线----------')
  //  console.log(req.file) // 文件类型的数据
  // 对用户信息进行合法验证
  if (!req.body.id || !req.body.title ) return res.cc('非法输入');
  // 对客户端的文件经行验证
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');

 
  // 添加文章分类
  const articleInfo = {
    // 文章的标题、内容、状态、所属分类的id
    ...req.body,
    // 文章封面在服务器的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章的发布时间
    pub_date: new Date(),
    // 文章作者的ID
    author_id: req.user.id
  }
   // 更新数据库操作
  const sqlStr = 'UPDATE ev_articles SET ? WHERE id = ?';
  pool.query(sqlStr,[articleInfo,req.body.id],(err,result)=>{
    if (err) return res.cc(err);
    if (result.affectedRows !==1) return res.cc('修改文章详情失败!!!');
    res.cc('修改文章详情成功！！！',0);
  })
}