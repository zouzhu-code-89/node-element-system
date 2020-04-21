/** user.js
 *  @fileoverview mongodb 查询用户名和密码
 *  @time 2020-04-16
 */
'use strict'

const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    user_id: Number,
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);
 

module.exports = User;