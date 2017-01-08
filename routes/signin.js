// 登录路由

var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

// 导入用户操作model
var UserModel = require('../models/users');
// 导入用户状态检查中间件的checkNotLogin方法
var checkNotLogin = require('../middlewares/check-user').checkNotLogin;

// GET /signin 访问登录页面
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin');
});

// POST /signin 提交登录信息
router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;

    UserModel.getUserByName(name)
        .then(function(user) {
            if(!user) {
                req.flash('error', '用户不存在');
                return res.redirect('back');
            }
            // 检查密码是否匹配
            if(sha1(password) !== user.password) {
                req.flash('error', '用户名或密码错误');
                return res.redirect('back');
            }
            // 用户存在且密码匹配, 则登录成功
            req.flash('success', '登陆成功');
            // 删除用户密码
            delete user.password;
            // 写入session
            req.session.user = user;
            // 重定向到主页
            res.redirect('/posts');
        })
        .catch(next);
});

module.exports = router;
