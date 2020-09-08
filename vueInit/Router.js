/* eslint-disable no-useless-constructor */
/* eslint-disable no-trailing-spaces */
/*
 * @Author: zhang zhipeng
 * @Date: 2020-02-05 10:40:09
 * @Last Modified by: zhang zhipeng
 * @Last Modified time: 2020-09-03 09:49:40
 * 
 * 小程序中不能使用vue的router，这里新建一个Router类代替vue中的router
 */
import { isPlainObject, transformPath } from '@/common/utils/index'

/**
 * Router类
 * 该Router使用方式类似于Vue的router，提供一系列小程序下的api
 * @property {Router} _router _router属性挂载在Vue.property._router
 * @type Router:
 *  @property push(string | object) => void
 *  @property replace(string | object) => void
 *  @property back(number) => void
 *  @property switchTab(string | object) => void
 *  @property relaunch(string | object) => void
 */
export default class Router {
    constructor() {
        // ...
    }
    @transformConfig
    push(config) {
        uni.navigateTo(config)
    }
    @transformConfig
    replace(config) {
        uni.redirectTo(config)
    }
    back(delta = 1) {
        uni.navigateBack({
            delta
        })
    }
    @transformConfig
    switchTab(config) {
        uni.switchTab(config)
    }
    @transformConfig
    reLaunch(config) {
        uni.reLaunch(config)
    }
}

// 合并配置
function transformConfig(target, name, descriptor) {
    var oldValue = descriptor.value
    descriptor.value = function(...args) {
        let _config = {}
        const config = args[0]
        if (typeof config === 'string') {
            _config = {
                url: config
            }
        }
        if (isPlainObject(config)) {
            _config = Object.assign(config, { url: transformPath(config.path, config.params) })
        }
        return oldValue.apply(this, [_config])
    }
    return descriptor
}

