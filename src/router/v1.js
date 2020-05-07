/**用户数据请求路由
 * 
 * @fileoverview APP用户请求资源的集中路由模块包括: 地域、用户信息、验证码、地址等等
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-12
 */
import express from 'express';
import CityHandle from '../controller/v1/cities';
import Captchas from '../controller/v1/captchas';
import SearchPlace from '../controller/v1/search';

const router = express.Router();



router.get('/cities', CityHandle.getCity);              // 获取全部城市数据(精准定位、热门城市、字母排序城市)
router.get('/cities/:id', CityHandle.getCityById);      // 根据ID获取城市信息
router.get('/pois', SearchPlace.search);                // 根据关键字查询所有包含该关键字的地点，一个城市范围内
router.post('/captchas', Captchas.getCaptchas);         // 获取验证码(图形验证码)


module.exports = router;




