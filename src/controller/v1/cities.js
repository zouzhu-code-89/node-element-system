/**首页城市信息加载模块
 * 
 * @fileoverview 首页我们会让用户进行定位,这个模块就是用于获取所有的城市信息(热门城市和所有城市)
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-12
 */
'use strict'
const AddressComponent = require("../../prototype/addressComponent");


class CityHandle extends AddressComponent{
    constructor(){
        super();
		this.testData = "测试数据";
		this.getCity = this.getCity.bind(this);
		this.getCityName = this.getCityName.bind(this);
    }



    /**
     * @method getCityName
     * @scription 获取定位到的城市名称
     * @param {*} req 
     * @return {String} option 城市名称
     */
	async getCityName(req){
        console.log("getCityName ------");
		try{
			const cityInfo = await this.guessPosition(req);
			/*
			汉字转换成拼音
			 */
	    const pinyinArr = pinyin(cityInfo.city, {
		  	style: pinyin.STYLE_NORMAL,
			});
			let cityName = '';
			pinyinArr.forEach(item => {
				cityName += item[0];
			})
			return cityName;
		}catch(err){
			return '北京';
		}
	}

    testCity(){
        console.log("hahahah ......");
    }

    /**获取城市数据
     *
     * @description 根据用户的请求类型,发送响应的城市信息,包括热门城市、精准定位城市、字母排序城市
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async getCity(request, response, next){
        // 获取GET请求参数City的类型
        const type = request.query.type; 
		let cityInfo;
		
		try {
			switch (type) {
				case 'guess': {
					const city = await this.getCityName(request);
                    // cityInfo = await Cities.cityGuess(city);
				}
				case 'hot': {
					console.log(".......", type);
				}
				case 'group': {
					console.log(".......", type);
				}
				default: {
					console.log(".......", type);
				}
					
			}
		} catch(e) {
			
		}
        // try {
        //     switch (type){
        //         // 精准定位用户
        //         case 'guess':  
        //             console.log("type : ->" ,this.name);
        //             // console.log("guess ....." + this.name);  
        //             // const city = await this.getCityName(request);
        //             // cityInfo = await Cities.cityGuess(city);
        //             break;
        //         // 热门城市
        //         case 'hot':
        //             cityInfo = await Cities.cityHot();
        //             break;
        //         // 按字母排序城市
        //         case 'group':
        //             cityInfo = await Cities.cityGroup();
        //             break;
        //         default:
        //             response.json({
        //                 name: 'ERROR_QUERY_TYPE',
        //                 message: '参数错误'
        //             })
        //     }
        // }catch(err){
        //     response.send({
        //         name: 'ERROR_DATA',
        //         message: '获取数据失败'
        //     });
        // }
    }








    async getCityById(req, res, next){
		const cityid = req.params.id;
		if (isNaN(cityid)) {
			res.json({
				name: 'ERROR_PARAM_TYPE',
				message: '参数错误',
			})
			return
		}
		try{
			const cityInfo = await Cities.getCityById(cityid);
			res.send(cityInfo);
		}catch(err){
			res.send({
				name: 'ERROR_DATA',
				message: '获取数据失败',
			});
		}
    }
    
    
	async getExactAddress(req, res, next){
		try{
			const position = await this.geocoder(req)
			res.send(position);
		}catch(err){
			console.log('获取精确位置信息失败');
			res.send({
				name: 'ERROR_DATA',
				message: '获取精确位置信息失败',
			});
		}
	}
	async pois(req, res, next){
		try{
			const geohash = req.params.geohash || '';
			if (geohash.indexOf(',') == -1) {
				res.send({
					status: 0,
					type: 'ERROR_PARAMS',
					message: '参数错误',
				})
				return;
			}
			const poisArr = geohash.split(',');
			const result = await this.getpois(poisArr[0], poisArr[1]);
			const address = {
				address: result.result.address,
				city: result.result.address_component.province,
				geohash,
				latitude: poisArr[0],
				longitude: poisArr[1],
				name: result.result.formatted_addresses.recommend,
			}
			res.send(address);
		}catch(err){
			console.log('getpois返回信息失败', err);
			res.send({
				status: 0,
				type: 'ERROR_DATA',
				message: '获取数据失败',
			})
		}
	}







}


module.exports = new CityHandle();