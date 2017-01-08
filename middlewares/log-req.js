// 控制台打印请求的中间件

module.exports = {
    logReq:function logReq(req, res, next) {
        console.log('req=');
        console.log(req.params);
        console.log(req.fields);
        console.log(req.files);
        next();
    }
};
