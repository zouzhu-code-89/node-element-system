'use strict';

import mongoose from 'mongoose';
import cityData from '../../InitData/cities';
import chalk from 'chalk';


const citySchema = new mongoose.Schema({
	data: {}
});

/**根据指定的城市拼音,查询到指定的城市信息文档
 * @param name 城市的拼音(ShangHai)
 * @return {Promise} 城市文档
 */
citySchema.statics.cityGuess = function(name){
	return new Promise(async (resolve, reject) => {
		const firtWord = name.substr(0,1).toUpperCase();
		try{
			const city = await this.findOne();
			Object.entries(city.data).forEach(item => {
				if(item[0] == firtWord){	// S==S
					item[1].forEach(cityItem => {	// data
						if (cityItem.pinyin == name) {
							resolve(cityItem);
						}
					})
				}
			})
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(chalk.red(err));
		}
	})
}

/**获取热门城市信息集合
 * @return {Promise} 城市文档数组
 */
citySchema.statics.cityHot = function (){
	return new Promise(async (resolve, reject) => {
		try{
			const city = await this.findOne();
			resolve(city.data.hotCities)
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}

/**返回按首字母排序的所有城市信息列表
 * @description 返回所有的城市信息列表,但是排除掉热门城市和当前用户定位到的城市
 * @return {Promise} 城市文档数组
 */
citySchema.statics.cityGroup = function (){
	return new Promise(async (resolve, reject) => {
		try{
			const city = await this.findOne();
			const cityObj = city.data;
			delete(cityObj._id)
			delete(cityObj.hotCities)
			resolve(cityObj)
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}

/**
 * 根据城市 ID 获取对应的城市文档
 * @return {Promise} 城市文档
 */
citySchema.statics.getCityById = function(id){
	return new Promise(async (resolve, reject) => {
		try{
			const city = await this.findOne();
			Object.entries(city.data).forEach(item => {
				if(item[0] !== '_id' && item[0] !== 'hotCities'){
					item[1].forEach(cityItem => {
						if (cityItem.id == id) {
							resolve(cityItem)
						}
					})
				}
			})
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}

const Cities = mongoose.model('Cities', citySchema);

/**
 * @description 查询数据库中是否有 City 这个文档,如果没有则在里面添加我们准备好的数据
 */
Cities.findOne((err, data) => {
	if (!data) {
		Cities.create({data: cityData});
	}
});

export default Cities;