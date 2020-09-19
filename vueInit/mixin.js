export default {
    data() {
        return {
            mixin_colorTheme: 'rgb(106, 86, 181)'
        }
    },
    methods: {
        $_setTabBarIndex(index) {
            if (typeof this.$mp.page.getTabBar === 'function' &&
                this.$mp.page.getTabBar()) {
                this.$mp.page.getTabBar().setData({
                    selected: index
                })
            }
        }
    }
}
