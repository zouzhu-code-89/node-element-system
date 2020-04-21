/**首页城市信息加载模块
 * 
 * @fileoverview 首页我们会让用户进行定位,这个模块就是用于获取所有的城市信息(热门城市和所有城市)
 * 
 * @author zouzhuQcom@163.com
 * @time   2020-04-12
 */
'use strict'

// class CityHandle extends AddressComponent{
class CityHandle{

    constructor(){

    }

    /**获取城市数据
     *
     * @description 根据用户的请求类型,发送响应的城市信息,包括热门城市、精准定位城市、字母排序城市
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async getCity(request, response, next){
        console.log("/getCity : ....");
        // 获取GET请求参数City的类型
        // const type = request.query.type; 
        // let cityInfo;
        // try {
        //     switch (type){
        //         // 精准定位用户
        //         case 'guess':       
        //             const city = await this.getCityName(request);
        //             cityInfo = await Cities.cityGuess(city);
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

}


module.exports = new CityHandle();