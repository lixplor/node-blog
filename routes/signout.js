// 登出路由

var express = require('express');
var router = express.Router();

// 导入用户状态中间件的checkLogin方法
var checkLogin = require('../middlewares/check-user').checkLogin;

// GET /signout 登出操作
router.get('/', checkLogin, function(req, res, next) {
    // 清空session中的用户信息
    req.session.user = null;
    // 提示登出成功
    req.flash('success', '登出成功');
    // 登出后重定向到主页
    res.redirect('/posts');
});

module.exports = router;
