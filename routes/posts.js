// 文章相关路由

var express = require('express');
var router = express.Router();

// 导入用户状态检查中间件的checkLogin函数
var checkLogin = require('../middlewares/check-user').checkLogin;

// GET /posts 获取用户的文章
// 没有querystring时获取所有用户文章
// ?author=xxx获取指定用户文章
router.get('/', function(req, res, next) {
    res.render('posts');
});

// GET /posts/create 访问发表文章页面
router.get('/create', checkLogin, function(req, res, next) {
    // 上面使用了checkLogin中间件, 先检查用户状态
    res.send(req.flash());
});

// POST /posts 提交要发表的文章
router.post('/', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId 访问指定文章页面
router.get('/:postId', function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/edit 访问编辑指定文章页面
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/edit 提交编辑的文章内容
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/remove 删除指定文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/comment 发表一条评论
router.post('/:postId/comment', function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/comment/:commentId/delete 删除指定评论
router.get('/:postId/comment/:commentId/delete', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// 导出路由对象
module.exports = router;  
