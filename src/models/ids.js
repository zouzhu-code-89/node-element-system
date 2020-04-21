/** Ids 文档操作
 * @fileoverview 该集合保存着所有文档的ID，形成表与表之间的关联关系，这个模块就是对它的操作
 * @time 2020-04-19
 */
'use strict';

const mongoose = require('mongoose');


const idsSchema = mongoose.Schema({
    restaurant_id: Number,
    food_id: Number,
    order_id: Number,
    user_id: Number,
    address_id: Number,
    cart_id: Number,
    img_id: Number,
    category_id: Number,
    item_id: Number,
    sku_id: Number,
    admin_id: Number,
    statis_id: Number
});
const Ids = mongoose.model('Id', idsSchema);

// Ids返回为空的话，则初始化它，保存一条文档
Ids.findOne((err, data) => {
    if (!data) {
        const newIds = new Ids({
			restaurant_id: 0,
			food_id: 0,
			order_id: 0,
			user_id: 0,
			address_id: 0,
			cart_id: 0,
			img_id: 0,
			category_id: 0,
			item_id: 0,
			sku_id: 0, 
			admin_id: 0,
			statis_id: 0,
        });
        newIds.save();
    }
});


module.exports = Ids;