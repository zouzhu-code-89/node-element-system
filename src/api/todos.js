'use strict';

import http from './http';

 /**
  * 
  * @param {*} type 
  * @param {*} reqType 
  * @param {*} data 
  */
const todos = async (url, data = {}, type = 'GET') => {
    return new Promise(function(resolve, reject){
        type = type.toUpperCase();

        if (url) {
            if (type == "GET") {
                const resData = requestGetUrlParam(url, data);
                resolve(resData);
            } else {
                console.log("功能暂时还未写 .........");
            }
        }
    });
}


/**
 * GET 请求
 * @param {*} url 
 * @param {*} data 
 */
async function requestGetUrlParam(url, data){
    return new Promise(function(resolve, reject){
        let paramUrl = '';
        Object.keys(data).forEach(key => {
            paramUrl += `${key}=${data[key]}&`; 
        });   
        paramUrl = paramUrl.substr(0, paramUrl.lastIndexOf('&'));
        url += `?${paramUrl}`;
    
        console.log("url: " + url);

        http.get(url).then(function(response){
            resolve(response.data);
        });
    });
}



export default todos;

