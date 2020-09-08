export default {
    data() {
        return {
            mixin_colorTheme: 'rgb(5, 192, 96)',
            mixin_colorGray: '#b5b5b5'
        }
    },
    methods: {
        $_setClipBoardData(data) {
            wx.setClipboardData({
                data: data
            })
        },
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
