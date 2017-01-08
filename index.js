// 入口文件

var path = require('path'),                               // 处理路径相关
    express = require('express'),                         // express框架
    session = require('express-session'),                 // express处理session包
    MongoStore = require('connect-mongo')(session),       // mongo驱动包
    flash = require('connect-flash'),                     // 通知包
    config = require('config-lite'),                      // 配置包
    routes = require('./routes'),                         // 导入路由文件
    pkg = require('./package'),                           // 导入package.json文件
    winston = require('winston'),                         // 日志包
    expressWinston = require('express-winston');          // express处理winston包

var app = express();

// 设置模板目录为views目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// session中间件, 通过config获取配置
app.use(session({
    name:config.session.key,             // cookie中保存session id的字段名称
    secret:config.session.secret,        // 通过设置secret来计算hash并放在cookie中, 使产生的signedCookie防篡改
    cookie:{
        maxAge:config.session.maxAge     // 过期时间, 过期后cookie中的session id自动删除
    },
    store:new MongoStore({               // 将session存储到mongodb
        url:config.mongodb               // mongodb地址
    })
}));

// flash中间件, 用于显示通知
app.use(flash());

// express-formidable中间件, 处理form表单
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname, 'public/img'),  // 文件上传目录
    keepExtensions:true                            // 保留文件后缀
}));

// 设置模板全局常量, 使用app.locals
app.locals.blog = {
    title:pkg.name,
    description:pkg.description
};

// 添加模板必须的三个变量, 使用res.locals
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

// 正常请求的日志
app.use(expressWinston.logger({
    transports:[
        new (winston.transports.Console)({
            json:true,
            colorize:true
        }),
        new winston.transports.File({
            filename:'logs/success.log')
        })
    ]
}));

// 设置路由
routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports:[
        new winston.transports.Console({
            json:true,
            colorize:true
        }),
        new winston.transports.File({
            filename:'logs/error.log'
        })
    ]
}));

// 错误页面
app.use(function(err, req, res, next) {
    res.render('error', {
        error:err
    });
});

// 监听端口, 启动程序
app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}. Press Ctrl + C to terminate`);
});
