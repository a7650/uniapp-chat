/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-01 17:26:58
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-09-09 18:38:36
 */
import moment from '@/vueInit/momentConfig'
import ImageHelpers from './imageHelpers'

const _toString = Object.prototype.toString

const dateTemplete = {
    ymd: 'YYYY-MM-DD',
    md: 'MM-DD',
    mdText: 'MM月DD日',
    week: 'ddd'
}

// 是否为object类型
export function isPlainObject(val) {
    return _toString.call(val) === '[object Object]'
}

// 获取随机字符串
export function getRandomStr() {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
}

// path后加参数
export function transformPath(path = '', params = {}) {
    if (typeof path !== 'string') {
        return ''
    }
    if (!isPlainObject(params)) {
        return path
    }
    let paramsStr = ''
    Object.keys(params).forEach(key => {
        paramsStr += `&${key}=${typeof params[key] === 'string' ? params[key] : JSON.stringify(params[key])}`
    })
    paramsStr = paramsStr.substr(1)
    return `${path}${path.indexOf('?') > -1 ? '&' : '?'}${paramsStr}`
}

// 将日期转化为dateTemplete
export function getDate(date) {
    const result = {}
    const momentObj = moment(date)
    for (const key in dateTemplete) {
        result[key] = momentObj.format(dateTemplete[key])
    }
    return result
}

// 获取和date相差delta天数的日期
export function getDeltaDate(date, delta = 0, unit = 'days') {
    const result = {}
    const momentObj = moment(date).add(delta, unit)
    for (const key in dateTemplete) {
        result[key] = momentObj.format(dateTemplete[key])
    }
    return result
}

export function getCoverImg(goods) {
    let img = goods
    return (img && (img = img.cover) && (img = img.url)) || ''
}

export function arrayBufferToPath(...args) {
    return ImageHelpers.arrayBufferToPath(...args)
}

/**
 * 将金额格式化
 * 大于零且最多两位小数
 * @param {String | Number} value
 * @returns {String | Number}
 */
export function amountFormat(value) {
    value = String(value).replace(/[^\d.]/g, '')
    const _v = parseFloat(value)
    if (!value || (!_v && _v !== 0) || _v < 0) {
        return ''
    }
    if (value.split('.').length > 2) {
        return _v.toFixed(2)
    }
    const str = value.indexOf('.')
    let numlen = 0
    if (str > -1) {
        numlen = value.substring(str + 1, value.length).length
    }
    if (numlen <= 2) {
        return value
    } else {
        return parseFloat(value).toFixed(2)
    }
}

export function getImageInfo(src) {
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

