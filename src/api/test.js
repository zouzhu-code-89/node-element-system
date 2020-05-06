/**
 * @description test axios request api .
 * @time 2020.05.06
 */

import api from './index.js';
import chalk from 'chalk';

async function requestDataTest(){
    const data = await api("https://apis.map.qq.com/ws/location/v1/ip", {key: "5WTBZ-2CGWW-GYORE-OUKPL-US4JV-B2F2N"});
    const {status, message, result} = data;
    if (status == 0) {
        console.log(chalk.green('tenxun : api test data resolve success ...... ' + result.ad_info.nation));
    } else {
        console.log(chalk.red('tenxun : api test data resolve Failure ......'));
    }
}

requestDataTest();