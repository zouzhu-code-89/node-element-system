/**
 * @fileoverview 负责路由用户的相关模块: 登录、用户信息、用户信息处理相关的
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-11
 */
const express = require('express');
const User = require('../controller/v2/user');

const router = express.Router();

// router.get('/index_entry', Entry.getEntry);
// router.get('/pois/:geohash', CityHandle.pois);
router.post('/login', () => console.log("user login ...."));                         // 用户登录
//router.get('/signout', User.signout);                      // 用户退出
// router.post('/changepassword', User.chanegPassword);

module.exports = router;