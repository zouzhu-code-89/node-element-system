'use strict';
/** 封装着活动相关的的数据
 *  
 */
const mongoose = requeore('mongoose');
const entryData = require('../../InitData/entry');

const Schema = mongoose.Schema;

const entrySchema = new Schema({
	id: Number, 						// 活动编号
	is_in_serving: Boolean,				// 活动是否正在进行
	description: String,				// 活动描述
	title: String,						// 活动标题
	link: String,						// 活动的链接
	image_url: String,					// 活动图片
	icon_url: String,					// 活动图标
	title_color: String					// 活动标题颜色
});
const Entry = mongoose.model('Entry', entrySchema)

// Entry文档为空时，将InitData.entry中的数据保存数据库中
Entry.findOne((err, data) => {
	if (!data) {
		for (let i = 0; i < entryData.length; i++) {
			Entry.create(entryData[i]);
		}
	}
})

module.exports = Entry;