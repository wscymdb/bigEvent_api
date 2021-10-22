const express = require('express');
// 创建路由器实例
const router = express.Router();

// 导入路由处理函数
const userHandler = require('../router_handler/user')




// 路由相关
// 注册路由
router.post('/reguser',userHandler.reguser)

// 登录路由
router.post('/login',userHandler.login)



// 导出路由对象
module.exports = router;