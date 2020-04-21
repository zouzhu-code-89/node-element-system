/** mangodb 连接文件
 * 
 *  @fileoverview mangodb 进行连接和配置
 *  @author zouzhuQcom@163.com
 *  @time 2020-04-16
 */
'use strict'

const mongoose = require('mongoose');
const config = require('config-lite')(__dirname );
const chalk = require('chalk');


mongoose.connect(config.url);           // 连接数据库
mongoose.Promise = global.Promise;
const db = mongoose.connection;         // 获取数据链接对象                      


db.once('open', () => {
    console.log(
        chalk.green("1.mongodb database connetion success... client -> db database")
    );
});
db.on('error', (error) => {
    console.log(
        chalk.red("error in mongodb connection : " + error)
    );
});
db.on('close', () => {
    console.log(
        chalk.red("mongodb database disconnect - 尝试再次连接 ....")
    );
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
});


module.exports = db;


