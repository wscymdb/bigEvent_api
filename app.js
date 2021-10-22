const express = require('express');
// 创建web服务器实例
const app = express();
// 导入cors模块 允许跨域
const cors = require('cors');
// 导入路由模块
const userRouter = require('./router/user');
const userInfoRouter = require('./router/userInfo');
const artCateRouter = require('./router/artcate');
const articleRouter = require('./router/article');


// 注册全局中间件
app.use(cors());
// 解析表单的数据格式 只能解析application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


// 注册一个全局中间件 用来发送错误的请求
// 在路由之前注册
app.use((req, res, next) => {
  // status 0成功 1失败(默认)
  res.cc = (err, status = 1) => {
    res.send({
      status,
      // 判断err是否是Error对象的实例 instanceof属于
      message: err instanceof Error ? err.message : err
    })
  } 
  next();
})

// 配置解析token相关的
const config = require('./config');
const expressJwt = require('express-jwt');
app.use(expressJwt({secret:config.jwtSecretKey,algorithms:['HS256']}).unless({path:[/^\/api\//]}));

// 托管静态资源
app.use('/uploads',express.static('uploads'))

// 注册路由
app.use('/api', userRouter);
app.use('/my', userInfoRouter);
app.use('/my/article', artCateRouter);
app.use('/my/article',articleRouter);


// 配置错误中间件  捕获错误
app.use((err,req,res,next)=>{

  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')


  // 未知错误
   res.cc(err)

  next();
})

// 监听端口，启动app
app.listen(8080, () => {
  console.log('server is running at http:127.0.0.1:8080');
})