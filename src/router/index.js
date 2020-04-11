/**
 * @fileoverview 路由路口文件,所有的路由都在这里进行配置,统一管理
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-11
 */
const v2 = require("./v2");

const routes = (app) => {
    app.use('/v2', v2);
}

module.exports = routes;