'use strict';
/**
 * @class User
 * @description 用户相关属性和方法的定义: 登录、改密、。。。
 * @time 2020-04-09
 */

const AddressComponent = require('../../prototype/addressComponent');

class User extends AddressComponent{
    constructor(){  
		super()
		this.login = this.login;                         // 登录状态
		this.encryption = this.encryption;               // 登录加密
		this.chanegPassword = this.chanegPassword;       // 改变密码
		this.updateAvatar = this.updateAvatar;           // 更新用户名
    }
    
    /**
     * @method 登录中间件函数
     * @description 首先检查验证码是否失效, 然后检查用户名和密码是否正确
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async login(request, response){
        // 首先获取请求中的验证码是否失效,如果失效则响应错误状态
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
        // 外部库 formidable 构造表单对象,获取字段
        const form = new formidable.IncomingFrom();
        form.parse(request, async (err, fields, files) => {
            const {username ,password, captcha_code} = fields;
            // 抛出为空的字段
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
            // 验证码是否正确
            if (cap.toString() !== captcha_code.toString()) {
                response.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码不正确'
                });
                return;
            }
            // 返回用户md5加密后的密码
            const newpassword = this.encryption(password);
            try{
                // mongodb 查询用户, 如果为空就创建一个新账号, 如果不为空判断密码是否正确
                const user = await UserModel.findOne({username});
                if (!user) {
                    // 1.获取一个未使用的USERID
                    const user_id = await this.getId('user_id');       
                    // 2.获取用户当前的城市位置
                    const cityInfo = await this.guessPosition(request);
                    // 3.用户注册账号的时间
                    const registe_time = dtime().format('YYYY-MM-DD HH:mm');
                    // 4.创建用户账号
                    const newUser = {username, password: newpassword, user_id};
                    UserModel.create(newUser);
                    // 5.创建用户信息
					const newUserInfo = {username, user_id, id: user_id, city: cityInfo.city, registe_time, };
					const createUser = new UserInfoModel(newUserInfo);
                    const userinfo = await createUser.save();
                    // 6.获取用户session
                    request.session.user_id = user_id;
                    // 7.返回用户信息
					response.send(userinfo);
                }else if (user.password.toString() !== newpassword.toString()) {
                    console.log('用户登录密码错误');
                    response.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码错误'
                    });
                    return;
                }else{
                    // 如果密码正确则查询用户的相关信息并响应 userinfo 数据
                    request.session.user_id = user.user_id;
                    const userinfo = await UserInfoModel.findOne({user_id: user.user_id}, '-_id');
                    response.send(userinfo);
                }
            }catch(err){
                // 登录期间登录出现任何异常,则登录失败
                console.log('用户登录失败', err);
                response.send({
                    status: 0,
                    type: 'SAVE_USER_FAILED',
                    message: '登陆失败',
                })
            }
        });
    }







    async getInfo(req, res, next){
		const sid = req.session.user_id;
		const qid = req.query.user_id;
		const user_id = sid || qid;
		if (!user_id || !Number(user_id)) {
			// console.log('获取用户信息的参数user_id无效', user_id)
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过session获取用户信息失败',
			})
			return 
		}
		try{
			const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
			res.send(userinfo) 
		}catch(err){
			console.log('通过session获取用户信息失败', err);
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过session获取用户信息失败',
			})
		}
	}
	async getInfoById(req, res, next){
		const user_id = req.params.user_id;
		if (!user_id || !Number(user_id)) {
			console.log('通过ID获取用户信息失败')
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过用户ID获取用户信息失败',
			})
			return 
		}
		try{
			const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
			res.send(userinfo) 
		}catch(err){
			console.log('通过用户ID获取用户信息失败', err);
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过用户ID获取用户信息失败',
			})
		}
	}
	async signout(req, res, next){
		delete req.session.user_id;
		res.send({
			status: 1,
			message: '退出成功'
		})
	}
	async chanegPassword(req, res, next){
		const cap = req.cookies.cap;
		if (!cap) {
			console.log('验证码失效')
			res.send({
				status: 0,
				type: 'ERROR_CAPTCHA',
				message: '验证码失效',
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {username, oldpassWord, newpassword, confirmpassword, captcha_code} = fields;
			try{
				if (!username) {
					throw new Error('用户名参数错误');
				}else if(!oldpassWord){
					throw new Error('必须添加旧密码');
				}else if(!newpassword){
					throw new Error('必须填写新密码');
				}else if(!confirmpassword){
					throw new Error('必须填写确认密码');
				}else if(newpassword !== confirmpassword){
					throw new Error('两次密码不一致');
				}else if(!captcha_code){
					throw new Error('请填写验证码');
				}
			}catch(err){
				console.log('修改密码参数错误', err);
				res.send({
					status: 0,
					type: 'ERROR_QUERY',
					message: err.message,
				})
				return
			}
			if (cap.toString() !== captcha_code.toString()) {
				res.send({
					status: 0,
					type: 'ERROR_CAPTCHA',
					message: '验证码不正确',
				})
				return
			}
			const md5password = this.encryption(oldpassWord);
			try{
				const user = await UserModel.findOne({username});
				if (!user) {
					res.send({
						status: 0,
						type: 'USER_NOT_FOUND',
						message: '未找到当前用户',
					})
				}else if(user.password.toString() !== md5password.toString()){
					res.send({
						status: 0,
						type: 'ERROR_PASSWORD',
						message: '密码不正确',
					})
				}else{
					user.password = this.encryption(newpassword);
					user.save();
					res.send({
						status: 1,
						success: '密码修改成功',
					})
				}
			}catch(err){
				console.log('修改密码失败', err);
				res.send({
					status: 0,
					type: 'ERROR_CHANGE_PASSWORD',
					message: '修改密码失败',
				})
			}
		})
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
    




    async getUserList(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await UserInfoModel.find({}, '-_id').sort({user_id: -1}).limit(Number(limit)).skip(Number(offset));
			res.send(users);
		}catch(err){
			console.log('获取用户列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取用户列表数据失败'
			})
		}
	}
	async getUserCount(req, res, next){
		try{
			const count = await UserInfoModel.count();
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取用户数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_USER_COUNT',
				message: '获取用户数量失败'
			})
		}
	}
	async updateAvatar(req, res, next){
		const sid = req.session.user_id;
		const pid = req.params.user_id;
		const user_id = sid || pid;
		if (!user_id || !Number(user_id)) {
			console.log('更新头像，user_id错误', user_id)
			res.send({
				status: 0,
				type: 'ERROR_USERID',
				message: 'user_id参数错误',
			})
			return 
		}

		try{
			const image_path = await this.getPath(req);
			await UserInfoModel.findOneAndUpdate({user_id}, {$set: {avatar: image_path}});
			res.send({
				status: 1,
				image_path,
			})
		}catch(err){
			console.log('上传图片失败', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				message: '上传图片失败'
			})
		}
	}
	async getUserCity(req, res, next){
		const cityArr = ['北京', '上海', '深圳', '杭州'];
		const filterArr = [];
		cityArr.forEach(item => {
			filterArr.push(UserInfoModel.find({city: item}).count())
		})
		filterArr.push(UserInfoModel.$where('!"北京上海深圳杭州".includes(this.city)').count())
		Promise.all(filterArr).then(result => {
			res.send({
				status: 1,
				user_city: {
					beijing: result[0],
					shanghai: result[1],
					shenzhen: result[2],
					hangzhou: result[3],
					qita: result[4],
				}
			})
		}).catch(err => {
			console.log('获取用户分布城市数据失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_USER_CITY',
				message: '获取用户分布城市数据失败'
			})
		})
	}









}

module.exports = new User();