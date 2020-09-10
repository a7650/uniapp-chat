import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from './logger'
import { ENV } from '@/common/utils/dataConfig'
import chat from './modules/chat'

Vue.use(Vuex)

const debug = ENV !== 'production'

export default new Vuex.Store({
    modules: {
        chat
    },
    actions,
    getters,
    state,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
