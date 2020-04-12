/**
 * @fileoverview 用户类封装着用户相关的属性和方法操作: 用户登录、注销、改密、用户信息查询相关操作
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-11
 */
'use strict';
const formidable = require('formidable');
const crypto = require('crypto');

/**
 * @class 用户功能相关的模块
 * @description 用户相关属性和方法的定义
 * @date 2020-04-09
 */
class User{
    constructor(){  
        this.login = this.login.bind(this);                         // 登录状态
		// this.encryption = this.encryption.bind(this);               // 登录加密
        //this.chanegPassword = this.chanegPassword.bind(this);       // 改变密码
        this.changePassword = this.changePassword;
		// this.updateAvatar = this.updateAvatar.bind(this);           // 更新用户名
    }
    
    /**
     * @method 登录中间件函数
     * @description 首先检查验证码是否失效, 然后检查用户名和密码是否正确
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async login(request, response, next){
        try {
            /**
             * cap是保存在cookie上的验证码，当用户获取到验证码，也会发送一份验证码到cookie，
             * 过期时间为30s，如果我们这里获取到cookie上的验证码为空，表示验证码已经失效
             */
            const cap = request.cookies.cap;
            if (!cap){
                console.log('Login User Modules: 验证码失效');
                response.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码失效'
                });
                return;
            }
        } catch(err) {
            console.log(`error message: 未获取code_is_timeout到这个cookie ... ${err.message}`);
            response.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码失效'
            });
            return;
        }
          
        // 外部库 formidable 构造表单对象获取字段，fields 包含着所有请求体的表单数据
        const form = new formidable.IncomingForm();
        form.parse(request, async (err, fields, files) => {
            const {username ,password, captcha_code} = fields;
            // 如果用户名密码为空情况,则抛出为空的字段错误
            try {
                if (!username) {
                    throw new Error('用户名参数错误');
                }else if(!password){
                    throw new Error('密码参数错误');
                }else if(!captcha_code){
                    throw new Error('验证码参数错误');
                }
            }catch(err){
                console.log('登陆参数错误', err);
                response.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err.message
                })
                return;
            }
            // 检查验证码是否正确 cap.toString() !== captcha_code.toString()
            if ("4669" !== captcha_code.toString()) {
                response.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码不正确'
                });
                return;
            }
            // 返回用户md5加密后的密码
            const newpassword = this.encryption(password);
            try {
                // mongodb 查询用户, 如果为空就创建一个新账号, 如果不为空判断密码是否正确
                // const user = await UserModel.findOne({username});
                const psword = this.encryption("zzhstlove1314");
                const user = "zouzhuQcom@163.com";
                if (!user) {
            
                    // }else if (user.password.toString() !== newpassword.toString()) {
                } else if (psword.toString() !== newpassword.toString()) {
                    console.log('用户登录密码错误');
                    response.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码错误'
                    });
                    return;
                } else {
                    // 如果密码正确则查询用户的相关信息并响应 userinfo 数据
                    //request.session.user_id = user.user_id;
                    //const userinfo = await UserInfoModel.findOne({user_id: user.user_id}, '-_id');
                    // response.send(userinfo);
                    response.send({
                        message: "登录成功"
                    });
                }
            } catch(err) {
                // 登录期间登录出现任何异常,则登录失败
                console.log('用户登录失败', err);
                response.send({
                            status: 0,
                            type: 'SAVE_USER_FAILED',
                            message: '登陆失败',
                });
            }
        });
    }


    /**
     * @method 用户密码加密
     * @description 返回加密后的密码,这里加密了3次,数据库保存的都是经过md5加密后的密码
     * @param {*} password 密码
     */
    encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
    }

    
    /**
     * @methid Md5密码加密
     * @description crypto是一个js加密库,我们通过它实现密码的md5加密
     * @param {*} password 
     */
    Md5(password){
        // 创建hash函数
        const md5 = crypto.createHash('md5');
        // 数据加密输入并输出
		return md5.update(password).digest('base64');
	}
}


module.exports = new User();

