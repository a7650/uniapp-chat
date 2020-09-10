/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-01 17:26:51
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-08-25 10:44:55
 */

export const ENV = 'test' // 当前环境 test/production

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
