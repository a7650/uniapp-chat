import Vue from 'vue'
import App from './App'
import store from './store/index'
import VueInit from './vueInit/index'
import uView from 'uview-ui'

Vue.use(uView)

Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(VueInit)

const app = new Vue({
    ...App,
    store
})
app.$mount()
