// 用户操作

var User = require('../lib/mongo').User;

// 导出用户相关的方法
module.exports = {
    // 创建用户函数
    create:function create(user) {
        return User.create(user).exec();
    },

    // 根据用户名查询用户信息
    getUserByName:function getUserByName(name) {
        return User
            .findOne({name:name})    // 根据name查找一个结果
            .addCreatedAt()
            .exec();
    }
};
