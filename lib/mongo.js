// 连接数据库

var config = require('config-lite');
var mongoose = require('mongoose');

// 连接数据库
mongoose.connect(config.mongodb);
