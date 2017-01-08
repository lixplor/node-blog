// 用户操作

var User = require('../lib/mongo').User;

// 导出创建用户的方法
module.exports = {
    // 创建用户函数
    create:function create(user) {
        return User.create(user);
    }
};
