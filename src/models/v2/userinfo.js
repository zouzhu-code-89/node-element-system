/**
 * @fileoverview mongoose dao 主要用于查询用户的相关信息 userInfo 并返回
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-11
 */
'use strict';

const mongoose = require('mongoose');


const userInfoSchema = new Schema({
	avatar: {type: String, default: 'default.jpg'},                    // 用户头像
	balance: {type: Number, default: 0},                               //  
	brand_member_new: {type: Number, default: 0},                      // 品牌新会员
	current_address_id: {type: Number, default: 0},                    // 当前地址ID
	current_invoice_id: {type: Number, default: 0},                    // 当前发票ID
	delivery_card_expire_days: {type: Number, default: 0},             // 交互卡到期时间
	email: {type: String, default: ''},                                // 用户邮箱
	gift_amount: {type: Number, default: 3},                           // 礼品数量
	city: String,                                                      // 当前城市
	registe_time: String,                                              // 记录时间                        
	id: Number,                                                        // ID
	user_id: Number,                                                   // USER_ID
	is_active: {type: Number, default: 1},                             // 是否活跃
	is_email_valid: {type: Boolean, default: false},                   // 邮箱是否是有效的
	is_mobile_valid: {type: Boolean, default: true},                   //
	mobile: {type: String, default: ''},
	point: {type: Number, default: 0},                                 // 重点
	username: String,                                                  // 用户名
	column_desc: {
		game_desc: {type: String, default: '玩游戏领红包'},
		game_image_hash: {type: String, default: '05f108ca4e0c543488799f0c7c708cb1jpeg'},
		game_is_show: {type: Number, default: 1},
		game_link: {type: String, default: 'https://gamecenter.faas.ele.me'},
		gift_mall_desc: {type: String, default: '0元好物在这里'},
	},
})
// 创建索引、提高检索的速度
userInfoSchema.index({id: 1});
const UserInfo = mongoose.model('UserInfo', userInfoSchema);


module.exports = UserInfo;