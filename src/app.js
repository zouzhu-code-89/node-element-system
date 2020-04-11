const express = require('express');
const history = require('connect-history-api-fallback');
const routes = require('./router/index');

const app = new express();


/**
 * all路由的路口,所有请求都将到达这里,并设置统一的响应头
 */
app.all('*', (request, response, next) => {
    console.log("请求到来了 ....");
    const { origin, Origin, referer, Referer } = request.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    // 设置响应头 header
    response.header("Access-Control-Allow-Origin", allowOrigin);
    response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    response.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    response.header("Access-Control-Allow-Credentials", true);      // 可以携带cookie
    response.header("X-Powered-By", "Express");
    // 是否是测试方式 OPTION
    if (request.method == 'OPTIONS') {
      response.sendStatus(200);
    } else {
        next();
    }
});

routes(app);

app.use(history());
app.use(express.static('./public'));
app.listen(3000, () => {
    console.log(`start run express app project .... port: ${3000}`);
});