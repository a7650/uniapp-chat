/* eslint-disable no-unused-vars */
/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-01 17:26:51
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-09-19 23:00:38
 */

export const ENV = process.env.NODE_ENV // 当前环境

export const APPID = ''

function arrayToMap(arr) {
    return arr.reduce((pre, cur) => {
        pre[cur.value] = cur.label
        return pre
    }, {})
}

function genFilter(dataSource) {
    return (value = '') => (dataSource[value] || value || '')
}
