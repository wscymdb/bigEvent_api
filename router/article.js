// 文章内容相关的路由
const express = require('express');
const article_handler = require('../router_handler/article');
const router = express.Router();

const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 获取文章列表路由
router.get('/list',article_handler.getArtlist)

// 发布新文章路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add',upload.single('cover_img'),article_handler.addArticle)

// 根据Id删除文章
router.get('/delete/:id',article_handler.deleteArticle)

// 根据id获取文章详情
router.get('/:id',article_handler.getArticle)

// 根据id修改文章详情
router.post('/edit',upload.single('cover_img'),article_handler.updateArticle)

// 导出
module.exports = router;