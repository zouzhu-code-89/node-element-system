/**
 * 具体什么作用这里不是很清楚, 底层类
 */
const fetch = require('node-fetch');
const { isDate } = require('util');
const qiniu = require('qiniu');

// 密钥: 公钥和私钥
qiniu.conf.ACCESS_KEY = 'Ep714TDrVhrhZzV2VJJxDYgGHBAX-KmU1xV1SQdS';
qiniu.conf.SECRET_KEY = 'XNIW2dNffPBdaAhvm9dadBlJ-H6yyCTIJLxNM_N6';

module.exports = class BaseComponent {
    constructor(){
        this.idList = [
            "restaurant_id",        // 餐厅ID
            "food_id",              // 食品ID
            "order_id",             // 订单ID
            "user_id",              // 用户ID
            "address_id",           // 地址ID
            "cart_id",              // 名字ID
            "img_id",               // 图片ID
            "category_id",          // 种类ID
            "item_id",              // 项目ID
            "sku_id",               // 
            "admin_id",             // 管理员ID
            "statis_id"             // 状态ID
        ];
        this.imgTypeList = [
            'shop',                 // 店铺图片类型
            'food',                 // 食物图片类型
            'avatar',               // ...
            'default'               // 默认图片类型
        ];
        this.uploadImg = this.uploadImg.bind(this);        
        this.qiniu = this.qiniu.bind(this);
    }



    /** ID列表获取
     *  @method getId
     *  @description 获取mongodb数据库中ids集合中所有的文档数据
     *  @param {String} type id的类型
     *  @return {String} id   
     */
	async getId(type){
		// 判断是否是存在的ID类型，否则抛出错误
		if (!this.idList.includes(type)) {
			console.log('id类型错误');
			throw new Error('id类型错误');
			return;
		}
		try{
			/**
			 * 倒序排序，第一条数据也就是最后一条数据，然后将ID加一后就形成了一条新的数据，
			 * 保存后返回新的文档对象
			 */
			const idData = await Ids.findOne();
			idData[type] ++ ;
			await idData.save();
			return idData[type]
		}catch(err){
			console.log('获取ID数据失败');
			throw new Error(err)
		}
	}


    /**上传图片
     * @method uploadImg
     * @param {*} request  
     * @param {*} responst
     * @param {*} next
     */
	async uploadImg(req, res, next){
		const type = req.params.type;
		try{
			//const image_path = await this.qiniu(req, type);
			const image_path = await this.getPath(req, res);
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


    /** 保存图片的路径
     *  @method getPath
     *  @param {*} req
     *  @param {*} res 
     */
	async getPath(req, res){
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm();
			form.uploadDir = './public/img';
			form.parse(req, async (err, fields, files) => {
				let img_id;
				try{
					img_id = await this.getId('img_id');
				}catch(err){
					console.log('获取图片id失败');
					fs.unlinkSync(files.file.path);
					reject('获取图片id失败');
				}
				const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
				const extname = path.extname(files.file.name);
				if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
					fs.unlinkSync(files.file.path);
					res.send({
						status: 0,
						type: 'ERROR_EXTNAME',
						message: '文件格式错误'
					})
					reject('上传失败');
					return 
				}
				const fullName = hashName + extname;
				const repath = './public/img/' + fullName;
				try{
					fs.renameSync(files.file.path, repath);
					gm(repath)
					.resize(200, 200, "!")
					.write(repath, async (err) => {
						// if(err){
						// 	console.log('裁切图片失败');
						// 	reject('裁切图片失败');
						// 	return
						// }
						resolve(fullName)
					})
				}catch(err){
					console.log('保存图片失败', err);
					if (fs.existsSync(repath)) {
						fs.unlinkSync(repath);
					} else {
						fs.unlinkSync(files.file.path);
					}
					reject('保存图片失败')
				}
			});
		})
	}


    /**
     * 
     * @param {*} req 
     * @param {*} type 
     */
	async qiniu(req, type = 'default'){
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm();
			form.uploadDir = './public/img';
			form.parse(req, async (err, fields, files) => {
				let img_id;
				try{
					img_id = await this.getId('img_id');
				}catch(err){
					console.log('获取图片id失败');
					fs.unlinkSync(files.file.path);
					reject('获取图片id失败')
				}
				const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
				const extname = path.extname(files.file.name);
				const repath = './public/img/' + hashName + extname;
				try{
					const key = hashName + extname;
					await fs.rename(files.file.path, repath);
					const token = this.uptoken('node-elm', key);
					const qiniuImg = await this.uploadFile(token.toString(), key, repath);
					fs.unlinkSync(repath);
					resolve(qiniuImg)
				}catch(err){
					console.log('保存至七牛失败', err);
					fs.unlinkSync(files.file.path)
					reject('保存至七牛失败')
				}
			});

		})
    }
    
    
    /**获取token
     * 
     * @param {*} bucket 
     * @param {*} key 
     */
	uptoken(bucket, key){
		var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  		return putPolicy.token();
    }
    
    
    /** 上传文件 
     * 
     * @param {*} uptoken 
     * @param {*} key 
     * @param {*} localFile 
     */
	uploadFile(uptoken, key, localFile){
		return new Promise((resolve, reject) => {
			var extra = new qiniu.io.PutExtra();
		    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
			    if(!err) {  
			    	resolve(ret.key)
			    } else {
			    	console.log('图片上传至七牛失败', err);
			    	reject(err)
			    }
		  	});

		})
	}	
}