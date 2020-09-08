import Router from './Router'
import moment from './momentConfig'

export default function(Vue) {
    Vue.prototype.$moment = moment

    Vue.prototype.$setStorage = function(key, data) {
        return uni.setStorageSync(key, data)
    }

    Vue.prototype.$getStorage = function(key) {
        return uni.getStorageSync(key)
    }

    Vue.prototype.$toast = function(title, duration = 1500, icon = 'none') {
        // type icon = "success" | "loading" | none
        setTimeout(() => {
            uni.showToast({
                title,
                duration,
                icon
            })
        }, 200)
    }

    Vue.prototype.$showLoading = function(title = '正在加载', mask = true) {
        uni.showLoading({
            title,
            mask
        })
    }

    Vue.prototype.$hideLoading = function() {
        uni.hideLoading()
    }

    Vue.prototype._router = new Router()

    Vue.prototype.$getPageInstance = function(delta = -1) {
        if (delta > -1) {
            return
        }
        const pages = getCurrentPages()
        const index = Math.max(0, pages.length + delta - 1)
        return pages[index] && pages[index].$vm
    }

    Vue.prototype.$onLaunched = new Promise(resolve => {
        Vue.prototype.$isResolve = resolve
    })

    Vue.prototype.$uToast = function(title, type = 'default', duration = 1500) {
        if (!title) {
            return
        }
        const toastRef = this.$refs.uToast
        if (!toastRef) {
            return
        }
        toastRef.show({
            title,
            type
        })
    }

    Vue.prototype.$messageType = {
        text: 'text',
        image: 'image',
        voice: 'voice'
    }
}
