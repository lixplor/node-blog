// 注册路由

var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

// 导入用户model
var UserModel = require('../models/users');
// 导入用户状态检查中间件的checkNotLogin方法
var checkNotLogin = require('../middlewares/check-user').checkNotLogin;

// GET /signup 访问注册页面
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

// POST /signup 提交注册信息
router.post('/', checkNotLogin, function(req, res, next) {
    // 获取请求中的参数
    var name = req.fields.name;
    var gender = req.fields.gender;
    var bio = req.fields.bio;
    var avatar = req.files.avatar.path.split(path.sep).pop();
    var password = req.fields.password;
    var repassword = req.fields.repassword;

    // 校验参数
    try {
        if(!(name.length >= 1 && name.length <= 10)) {
            throw new Error('名字请限制在1-10个字符');
        }
        if(!(password.length >= 6 && password.length <= 12)) {
            throw new Error('密码请限制在6-12个字符');
        }
        if(password !== repassword) {
            throw new Error('两次输入密码不一致, 请检查');
        }
        if(['-1', '0', '1'].indexOf(gender) === -1) {
            throw new Error('性别只能是保密, 女, 男');
        }
        if(!req.files.avatar.name) {
            throw new Error('缺少头像');
        }
        if(!(bio.length >=1 && bio.length <= 30)) {
            throw new Error('个人简介请限制在1-30个字符');
        }
    } catch (e) {
        // 条件不符, 异步删除上传的头像
        fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    // 如果校验通过, 则将明文密码加密
    password = sha1(password);
    
    // 创建数据库模型
    var user = {
        name:name,
        password:password,
        gender:gender,
        bio:bio,
        avatar:avatar
    };
    // 写入数据库
    UserModel.create(user)
        .then(function(result) {
            // 此user时插入mongodb后的值, 包含_id
            user = result;
            // 将用户信息存入session, 注意要删除密码
            delete user.password;
            req.session.user = user;
            // 提示注册成功
            req.flash('success', '注册成功');
            // 跳转首页
            res.redirect('/posts');
        })
        .catch(function(e) {
console.log('-----------error-----------');
console.log(e);
console.log('---------------------------');
            // 注册失败, 异步删除上传头像
            fs.unlink(req.files.avatar.path);
            // 用户名被占用则返回注册页
            if(e.message.indexOf('E11000 duplicate key') !== -1) {
                req.flash('error', '用户名已被占用, 请更换为其他名称');
                return res.redirect('/signup');
            }
            next(e);
        });
});

module.exports = router;
