// 检查用户登录状态中间件

module.exports = {
    // 检查是否已登录
    checkLogin : function checkLogin(req, res, next) {
        if(!req.session.user) {
            // 如果session中没有用户信息, 则提示未登录, 重定向到登录页面
            req.flash('error', '未登录');
            return res.redirect('/signin');
        }
        next();
    },

    // 检查是否未登录
    checkNotLogin : function checkNotLogin(req, res, next) {
        if(req.session.user) {
            // 如果session中有用户信息, 则提示已登录, 重定向到之前的页面
            req.flash('error', '已登录');
            return res.redirect('back');
        }
        next();
    }
};
