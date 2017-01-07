// 注册路由

var express = require('express');
var router = express.Router();

// 导入用户状态检查中间件的checkNotLogin方法
var checkNotLogin = require('../middlewares/check-user').checkNotLogin;

// GET /signup 访问注册页面
router.get('/', checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /signup 提交注册信息
router.post('/', checkNotLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;
