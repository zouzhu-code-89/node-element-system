/**
 * @fileoverview axios 实例
 * @time 2020.05.05
 * @description 创建一个Axios实例，并对它做相应的配置，这里包括一些默认配置和拦截器
 */

 'use strict'

 import axios from "axios";
 import chalk from "chalk";


 const http = axios.create({
     timeout: 1000 * 12
 });
 http.defaults.headers.post['Content-Type'] = "application/json";

 // 请求拦截器
 http.interceptors.request.use(
     (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
 );

 // 响应拦截器
 http.interceptors.response.use(
     (res) => {
        console.log("axios interceptors response success ....");
        return res.status == 200 ? Promise.resolve(res) : Promise.reject(res);
     },
     (error) => {
        console.log(chalk.red('axios interceptors throws error ....'));
        const {response} = error;
        if (response) {
            errorHandler(response.status, response.data.message);
            return Promise.reject(response);
        } else {

        }
     }
 );

/**
 * @description 统一错误处理(401、403、404)
 * @param {*} status 
 * @param {*} message 
 */
const errorHandler = (status, message) => {
    switch (status) {
        case 401:
            return;
        case 403:
            return;
        default:
            console.log(chalk.red(message));
    }
}

export default axios;