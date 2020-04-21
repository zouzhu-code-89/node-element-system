/** config-lite 配置文件
 * 
 *  @fileoverview mongodb、session的相关配置
 *  @author zouzhuQcom@163.com
 *  @time 2020-04-16
 */
'use strict';

module.exports = {
	port: parseInt(process.env.PORT, 10) || 8001,
	url: 'mongodb://localhost:27017/node-element-system-test',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
	        secure: false,
	        maxAge: 365 * 24 * 60 * 60 * 1000,
		}
	}
}