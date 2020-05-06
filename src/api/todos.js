'use strict';

import http from './http';

 /**
  * 
  * @param {*} type 
  * @param {*} reqType 
  * @param {*} data 
  */
const todos = async (url, data = {}, type = 'GET') => {
    type = type.toUpperCase();

    if (url) {
        if (type == "GET") {
            await requestGetUrlParam(url, data);
        } else {
            console.log("功能暂时还未写 .........");
        }
    }
}


/**
 * GET 请求
 * @param {*} url 
 * @param {*} data 
 */
async function requestGetUrlParam(url, data){
    let paramUrl = '';
    Object.keys(data).forEach(key => {
        paramUrl += `${key}=${data[key]}&`; 
    });   
    paramUrl = paramUrl.substr(0, paramUrl.lastIndexOf('&'));
    url += `?${paramUrl}`;
    
    console.log("url: " + url);

    http.get(url).then(function(response){
        console.log('腾讯地图服务器响应了 ..........');
        console.log(response.data);
        return response.data;
    });
}



export default todos;

