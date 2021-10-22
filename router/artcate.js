// 文章分类的路由
const express = require('express');
const artcate_handler = require('../router_handler/artcate.js');
const router = express.Router();


// 获取文章列表分类的接口
router.get('/cates',artcate_handler.getArticleCates);

// 新增文章分类的接口
router.post('/addcates',artcate_handler.addArticCates);

// 根据ID删除文章分类
router.get('/deletecate/:id',artcate_handler.deleteCateById);

// 根据ID获取文章分类数据
router.get('/cates/:id',artcate_handler.getArticleById)

// 根据ID更新文章分类数据
router.post('/updatecate',artcate_handler.updateCateById)

module.exports = router;