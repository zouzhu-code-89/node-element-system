'use strict';

/** 腾讯地图和百度地图统一调配组件
 * 
 * 	@fileoverview 当需要获取地理位置相关的数据时则调用这个类里面相关的方法
 *  @time 2020-04-21
 */
const BaseComponent = require('./baseComponent');


class AddressComponent extends BaseComponent {
	constructor(){
		/**
		 * @param {String} tencenkey 腾讯地图开发者钥匙，只有是开发者才能使用它的接口
		 */
		super();
		this.tencentkey = 'RLHBZ-WMPRP-Q3JDS-V2IQA-JNRFH-EJBHL';
		this.tencentkey2 = 'RRXBZ-WC6KF-ZQSJT-N2QU7-T5QIT-6KF5X';
		this.tencentkey3 = 'OHTBZ-7IFRG-JG2QF-IHFUK-XTTK6-VXFBN';
		this.tencentkey4 = 'Z2BBZ-QBSKJ-DFUFG-FDGT3-4JRYV-JKF5O';
		this.baidukey = 'fjke3YUipM9N64GdOIh1DNeK2APO2WcT';
	}
	
	
	/** IP非精准定位
	 * 	@method guessPosition
	 *  @description 根据请求数据报中的IP地址、获取用户的非精准定位
	 *  @param  {Object} request 请求对象 
	 *  @return {Promise} 返回一个城市信息对象、包括经纬度和所在地级市 
	 */
	async guessPosition(request){
		return new Promise(async (resolve, reject) => {
			// 开发模式下使用固定的默认IP地址，只有在生产模式下才会获取用户的IP地址
			let ip;
			const defaultIp = '180.158.102.141';
			console.log(process.env.NODE_ENV);
	 		if (process.env.NODE_ENV == 'development') {
	 			ip = defaultIp;
	 		} else {
	 			try {
					// ip = request.headers['x-forwarded-for'] || 
			 		// request.connection.remoteAddress || 
			 		// request.socket.remoteAddress ||
			 		// request.connection.socket.remoteAddress;
			 		// const ipArr = ip.split(':');
					 // ip = ipArr[ipArr.length -1] || defaultIp;
					 ip = defaultIp;
				} catch (e) {
					ip = defaultIp;
				}
			 }
			console.log("guess position : " + ip);
			// 通过腾讯的接口获取用户当前的位置信息，当返回状态不是0时，重复对接口发起请求，这里设计者可能认为是开发者密钥的原因
	 		try{
		 		let result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
		 			ip,
		 			key: this.tencentkey,
		 		})
		 		if (result.status != 0) {
		 			result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
			 			ip,
			 			key: this.tencentkey2,
			 		})
		 		}
		 		if (result.status != 0) {
		 			result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
			 			ip,
			 			key: this.tencentkey3,
			 		})
		 		}
		 		if (result.status != 0) {
		 			result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {
			 			ip,
			 			key: this.tencentkey4,
			 		})
				 }
				// 当状态返回成功时，说明我们成功获取到了定位的JSON数据，然后我们进一步处理 resolve 返回
		 		if (result.status == 0) {
		 			const cityInfo = {
		 				lat: result.result.location.lat,
		 				lng: result.result.location.lng,
		 				city: result.result.ad_info.city,
		 			}
		 			cityInfo.city = cityInfo.city.replace(/市$/, '');
		 			resolve(cityInfo)
		 		}else{
		 			console.log('定位失败', result)
		 			reject('定位失败');
		 		}
	 		}catch(err){
	 			reject(err);
	 		}
		})
	}
	

	/** 搜索地址
	 *  @method searchPlace
	 *  @description 根据地域进行定位搜索
	 *  @param {String} keyword 
	 *  @param {String} cityName 
	 *  @param {String} type 
	 */
	async searchPlace(keyword, cityName, type = 'search'){
		try{
			const resObj = await this.fetch('http://apis.map.qq.com/ws/place/v1/search', {
				key: this.tencentkey,
				keyword: encodeURIComponent(keyword),
				boundary: 'region(' + encodeURIComponent(cityName) + ',0)',
				page_size: 10,
			});
			if (resObj.status == 0) {
				return resObj
			}else{
				throw new Error('搜索位置信息失败');
			}
		}catch(err){
			throw new Error(err);
		}
	}



	/**距离测量
	 * 
	 * @param {*} from 
	 * @param {*} to 
	 * @param {*} type 
	 */
	async getDistance(from, to, type){
		try{
			let res
			res = await this.fetch('http://api.map.baidu.com/routematrix/v2/driving', {
				ak: this.baidukey,
				output: 'json',
				origins: from,
				destinations: to,
			})
			// if(res.status !== 0){
			// 	res = await this.fetch('http://api.map.baidu.com/routematrix/v2/driving', {
			// 		ak: this.baidukey2,
			// 		output: 'json',
			// 		origins: from,
			// 		destinations: to,
			// 	})
			// }
			if(res.status == 0){
				const positionArr = [];
				let timevalue;
				res.result.forEach(item => {
					timevalue = parseInt(item.duration.value) + 1200;
					let durationtime = Math.ceil(timevalue%3600/60) + '分钟';
					if(Math.floor(timevalue/3600)){
						durationtime = Math.floor(timevalue/3600) + '小时' + durationtime;
					}
					positionArr.push({
						distance: item.distance.text,
						order_lead_time: durationtime,
					})
				})
				if (type == 'tiemvalue') {
					return timevalue
				}else{
					return positionArr
				}
			}else{
				if (type == 'tiemvalue') {
					return 2000;
				} else {
					throw new Error('调用百度地图测距失败');
				}
			}
		}catch(err){
			console.log('获取位置距离失败');
			throw new Error(err);
		}
	}


	/** 通过IP地址获取精准位置
	 *  @method geocoder
	 *  @description
	 *  @param {Object} request 
	 */
	async geocoder(req){
		try{
			const address = await this.guessPosition(req);
			const params = {
				key: this.tencentkey,
				location: address.lat + ',' + address.lng
			};
			let res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
			if (res.status != 0) {
				params.key = this.tencentkey2;
	 			res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
	 		}
	 		if (res.status != 0) {
	 			params.key = this.tencentkey3;
	 			res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
	 		}
	 		if (res.status != 0) {
	 			params.key = this.tencentkey4;
	 			res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
	 		}
			if (res.status == 0) {
				return res
			}else{
				throw new Error('获取具体位置信息失败');
			}
		}catch(err){
			console.log('geocoder获取定位失败', err);
			throw new Error(err);
		}
	}


	/** 通过geohash获取精确位置
	 * 	@method getpois
	 *  @param {Double} lat 经度 
	 *  @param {Double} lng 纬度
	 */
	async getpois(lat, lng){
		try{
			const params = {
				key: this.tencentkey,
				location: lat + ',' + lng
			};
			let res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
			if (res.status != 0) {
				params.key = this.tencentkey2;
	 			res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
	 		}
	 		if (res.status != 0) {
	 			params.key = this.tencentkey3;
	 			res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
	 		}
	 		if (res.status != 0) {
	 			params.key = this.tencentkey4;
	 			res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', params);
	 		}
			if (res.status == 0) {
				return res
			}else{
				throw new Error('通过获geohash取具体位置失败');
			}
		}catch(err){
			console.log('getpois获取定位失败', err)
			throw new Error(err);
		}
	}
}

module.exports = AddressComponent;