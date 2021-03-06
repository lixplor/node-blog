// 根路由

module.exports = function(app) {
    // 根路径
    app.get('/', function(req, res) {
        // 访问根路径时, 重定向到帖子列表页面
        res.redirect('/posts');
    }); 
    // 为所有路径添加日志中间件
    app.use('/*', require('../middlewares/log-req').logReq);
    // 为以下路径加载相关中间件
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));

    // 404
    app.use(function(req, res) {
        if(!res.headersSent) {
            res.render('404');
        }
    });
};
