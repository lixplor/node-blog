// 登出路由

var express = require('express');
var router = express.Router();

// 导入用户状态中间件的checkLogin方法
var checkLogin = require('../middlewares/check-user').checkLogin;

// GET /signout 登出操作
router.get('/', function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;
