// 连接数据库

var config = require('config-lite');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 连接数据库
mongoose.connect(config.mongodb);

// 定义User模型, 并导出
var userSchema = new Schema({
    name:{                  // 用户名作为唯一索引, 保证不重复
        type:String, 
        index:true, 
        unique:true
    },
    password:String,
    avatar:String,
    gender:Number,
    bio:String
});
exports.User = mongoose.model('User', userSchema);
