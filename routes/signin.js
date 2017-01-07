// 登录路由

var express = require('express');
var router = express.Router();

// 导入用户状态检查中间件的checkNotLogin方法
var checkNotLogin = require('../middlewares/check-user').checkNotLogin;

// GET /signin 访问登录页面
router.get('/', checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /signin 提交登录信息
router.post('/', checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;
