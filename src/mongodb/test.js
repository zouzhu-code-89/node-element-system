/** 测试数据库模块
 * 
 * @fileoverview 当连接数据库后对数据进行一次查询，保证数据正常输入输出
 * @author zouzhuQcom@163.com
 * @time 2020-04-17
 */
'use strict'

const mongoose = require('mongoose');
const chalk = require('chalk');

const testSchema = mongoose.Schema({
    message: String
});
const Test = mongoose.model("test", testSchema);

Test.find(function(error, value){
    if(error){
        console.log(chart.red(`find data error : ${error}`));
        return;
    }
    console.log(chalk.green(`2.mongodb database connectiofind data test success : ${value[0].message}`));
})








