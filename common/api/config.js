/* eslint-disable new-cap */
/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-01 17:23:52
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-09-18 16:23:11
 * request配置
 */

import request from '../request'
import { TOKEN_KEY } from '@/common/utils/storageKeys'
import { ENV } from '@/common/utils/dataConfig'

const REST_TEST_URL = '' // 测试环境url
const REST_PRODUCTION_URL = '' // 生产环境url

export const gql = new request.graphQL({
    url: ENV === 'development' ? '' : '',
    custom: false, // 是否关闭编译器的编译，即手动写query语句
    logger: ENV === 'development' // 是否打印请求日志
})

const URLs = {
    development: REST_TEST_URL,
    production: REST_PRODUCTION_URL
}

let networkConnected = true

const gqlErrorIgnore = [] // 忽略error

/**
 * 该方法只设置普通rest请求的url
 * @param {String} env
 */
export const setBaseURL = (env) => (request.defaults.baseURL = URLs[env])

setBaseURL(ENV)

// 监听网络状态
uni.onNetworkStatusChange(res => {
    networkConnected = res.isConnected
})

// 发送请求的时候会加上authKey的请求头
gql.client.defaults.authKey = request.defaults.authKey = 'X-Authorization'

/**
 * @returns {String}
 */
gql.client.defaults.auth = request.defaults.auth = function() {
    const token = uni.getStorageSync(TOKEN_KEY)
    return token ? `Bearer ${uni.getStorageSync(TOKEN_KEY)}` : null
}

// exclusive属性包含的url将不会添加authKey请求头
request.defaults.authURL.exclusive = null /** @property {String[] | null} */

function toast(title) {
    setTimeout(() => {
        uni.showToast({
            title,
            duration: 2000,
            icon: 'none'
        })
    }, 100)
}

const responseErrorHandler = {
    statusCode500(config) {
        toast('服务异常')
    },
    statusCode401(config) {
        console.log(config)
    },
    statusCode498(config) {
        console.log(config)
    },
    statusOffline() {
        toast('网络异常，请连接网络再试')
    }
}

const interceptorRequest = [
    config => {
        if (!networkConnected) {
            responseErrorHandler.statusOffline()
            return Promise.reject()
        } else {
            return Promise.resolve(config)
        }
    }
]

const interceptorResponse = [
    res => {
        const { statusCode, data, config } = res
        let errorHandler = responseErrorHandler[`statusCode${statusCode}`]
        if (statusCode >= 500) {
            errorHandler = responseErrorHandler['statusCode500']
        }
        if (errorHandler) {
            // 如果需要对特定的状态码处理，在responseErrorHandler里处理
            errorHandler(config)
            return Promise.reject(data)
        }
        return Promise.resolve(config.isGql ? res : data)
    },
    err => {
        if (!networkConnected) {
            responseErrorHandler.statusOffline()
        }
        return Promise.reject(err)
    }
]

const gqlErrorHandler = res => {
    const { data, config } = res
    if (config.gql && config.gql.length > 0 && gqlErrorIgnore.includes(config.gql[0].operationName)) {
        return Promise.resolve(data)
    }
    if (data.errors && data.errors.length > 0) {
        const errMsg = data.errors[0].message
        toast(errMsg && errMsg.length < 50 ? errMsg : '服务异常')
        return Promise.reject(data)
    }
    // debugger
    if (data.data) {
        return Promise.resolve(data)
    } else {
        return Promise.reject(data)
    }
}

request.interceptors.request.use(...interceptorRequest)
gql.client.interceptors.request.use(...interceptorRequest)
request.interceptors.response.use(...interceptorResponse)
gql.client.interceptors.response.use(...interceptorResponse)
gql.client.interceptors.response.use(gqlErrorHandler)

export default request

