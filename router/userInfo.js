const express = require('express');
const router = express.Router();
const userInfoHandler = require('../router_handler/userInfo');


// 获取用户信息接口
router.get('/userinfo', userInfoHandler.userInfo)

// 更新用户的基本信息
router.post('/userinfo', userInfoHandler.updateUserInfo)

// 更改密码
router.post('/updatepwd',userInfoHandler.updatePassword)

// 更新头像
router.post('/update/avatar',userInfoHandler.updateAvatar)

module.exports = router;