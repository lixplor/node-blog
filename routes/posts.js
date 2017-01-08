// 文章相关路由

var express = require('express');
var router = express.Router();

// 导入文章model
var PostModel = require('../models/posts');
// 导入评论model
var CommentModel = require('../models/comments');
// 导入用户状态检查中间件的checkLogin函数
var checkLogin = require('../middlewares/check-user').checkLogin;

// GET /posts 获取用户的文章
// 没有querystring时获取所有用户文章
// ?author=xxx获取指定用户文章
router.get('/', function(req, res, next) {
    var author = req.query.author;

    PostModel.getPosts(author)
        .then(function(posts) {
            res.render('posts', {
                posts:posts
            });
        })
        .catch(next);
});

// GET /posts/create 访问发表文章页面
router.get('/create', checkLogin, function(req, res, next) {
    // 上面使用了checkLogin中间件, 先检查用户状态
    res.render('create');
});

// POST /posts 提交要发表的文章
router.post('/', checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    // 校验参数
    try {
        // 判断是否填写标题
        if(!title.length) {
            throw new Error('请填写标题');
        }
        // 判断是否填写内容
        if(!content.length) {
            throw new Error('请填写内容');
        }
    } catch(e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var post = {
        author:author,
        title:title,
        content:content,
        pv:0
    };

    // 插入数据库
    PostModel.create(post)
        .then(function(result) {
            // 此post时插入mongodb后的值, 包含_id
            post = result.ops[0];
            req.flash('success', '发表成功');
            // 重定向到该文章详情页
            res.redirect(`/posts/${post._id}`);
        })
        .catch(next);
});

// GET /posts/:postId 访问指定文章页面
router.get('/:postId', function(req, res, next) {
    var postId = req.params.postId;
    
    Promise.all([
        PostModel.getPostById(postId),   // 获取文章信息
        CommentModel.getComments(postId), // 获取文章评论
        PostModel.incPv(postId)          // 获取的同时pv+1
    ])
    .then(function(result) {
        var post = result[0];
        var comments = result[1];
        if(!post) {
            throw new Error('该文章不存在');
        }

        res.render('post', {
            post:post,
            comments:comments
        });
    })
    .catch(next);
});

// GET /posts/:postId/edit 访问编辑指定文章页面
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if(!post) {
                throw new Error('该文章不存在');
            }
            if(author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', {
                post:post
            });
        })
        .catch(next);
});

// POST /posts/:postId/edit 提交编辑的文章内容
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    PostModel.updatePostById(postId, author, {title:title, content:content})
        .then(function() {
            req.flash('success', '编辑文章成功');
            // 重定向到上一页
            res.redirect(`/posts/${postId}`);
        })
        .catch(next);
});

// GET /posts/:postId/remove 删除指定文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.delPostById(postId, author)
        .then(function() {
            req.flash('success', '删除文章成功');
            // 重定向到主页
            res.redirect('/posts');
        })
        .catch(next);
});

// POST /posts/:postId/comment 发表一条评论
router.post('/:postId/comment', function(req, res, next) {
    var author = req.session.user._id;
    var postId = req.params.postId;
    var content = req.fields.content;
    var comment = {
        author:author,
        postId:postId,
        content:content
    };

    CommentModel.create(comment)
        .then(function() {
            req.flash('success', '评论成功');
            // 重定向到上一页
            res.redirect('back');
        })
        .catch(next);
});

// GET /posts/:postId/comment/:commentId/delete 删除指定评论
router.get('/:postId/comment/:commentId/delete', checkLogin, function(req, res, next) {
    var commentId = req.params.commentId;
    var author = req.session.user._id;

    CommentModel.delCommentById(commentId, author)
        .then(function() {
            req.flash('success', '删除评论成功');
            // 重定向到上一页
            res.redirect('back');
        })
        .catch(next);
});

// 导出路由对象
module.exports = router;  
