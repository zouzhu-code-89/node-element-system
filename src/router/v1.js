/**用户数据请求路由
 * 
 * @fileoverview APP用户请求资源的集中路由模块包括: 地域、用户信息、验证码、地址等等
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-12
 */
const express = require('express');
const Captchas = require('../controller/v1/captchas');

const router = express.Router();

router.get('/captchas', Captchas.getCaptchas);               // 获取验证码


module.exports = router;




