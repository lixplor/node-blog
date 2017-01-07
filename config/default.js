// 默认配置文件
module.exports = {
    port:3000,                                 // web服务器监听端口
    session:{                                  // session设置
       secret:'nblog',
       key:'nblog',
       maxAge:1000 * 60 * 60 * 1
    },
    mongodb:'mongodb:localhost:27017/nblog'    // mongodb连接配置
};
