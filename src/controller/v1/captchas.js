/**
 * @fileoverview 图形验证码生成器
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-12
 */
'use strict'

const captchapng = require('captchapng');

class Captchas{
    constructor(){

    }
     
    /**生成数字随机数图片验证码
     * 
     * @description 仅支持生成随机数数字图片验证码
     * @param {*} request   请求对象
     * @param {*} response  响应对象
     * @param {*} next      下一个中间件
     */
    async getCaptchas(request, response, next){
        // 生成一个随机数
        const cap = parseInt(Math.random()*9000+1000);
        // 图片的宽度、图片的高度、随机数字
        const p = new captchapng(80,30, cap);
        // 图片的背景色
        p.color(0, 0, 0, 0);
        // 数字的颜色
        p.color(80, 80, 80, 225);
        // 转换成base64
        const base64 = p.getBase64();
        // 将生成的验证码数字和过期时间发送到COOKIE
        response.cookie('cap', cap, { maxAge: 300000, httpOnly: true });
        // img标签能渲染base64编码的图片
        response.send({
            status: 1,
            code: 'data:image/png;base64,' + base64
        });
    }
}


module.exports = new Captchas();