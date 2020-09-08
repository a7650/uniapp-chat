import { mapGetters } from 'vuex'

export default {
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['ownedId'])
    },
    created() {
        this.$_initMessageManager()
    },
    methods: {
        /**
         * 初始化消息管理器
         * @return {MessageManager} vm.$messageManager
         */
        $_initMessageManager() {
            const sendText = (text = '') => {
                const params = {
                    id: String(Date.now()),
                    content: text,
                    senderAvatarUrl: 'https://wx.qlogo.cn/mmhead/bj9JGugn6Uc7bSuicaFZ6CuZnkSUYOIAOygSiaTvhN71ib9vdSicVRqdfg/0',
                    senderId: this.ownedId,
                    senderName: '张志鹏',
                    createTime: Date.now(),
                    contentType: this.$messageType.text,
                    isSent: false,
                    loading: true
                }
                console.log(params)
                this.$_sendMessageComplete(params)
            }
            const sendVoice = (voicePath = '', duration = 0/** s */) => {
                const params = {
                    id: String(Date.now()),
                    content: voicePath,
                    senderAvatarUrl: 'https://wx.qlogo.cn/mmhead/bj9JGugn6Uc7bSuicaFZ6CuZnkSUYOIAOygSiaTvhN71ib9vdSicVRqdfg/0',
                    senderId: this.ownedId,
                    senderName: '张志鹏',
                    createTime: Date.now(),
                    contentType: this.$messageType.voice,
                    isSent: false,
                    loading: true,
                    duration
                }
                console.log(params)
                this.$_sendMessageComplete(params)
            }
            const sendImage = (imagePath = '') => {
                const params = {
                    id: String(Date.now()),
                    content: imagePath,
                    senderAvatarUrl: 'https://wx.qlogo.cn/mmhead/bj9JGugn6Uc7bSuicaFZ6CuZnkSUYOIAOygSiaTvhN71ib9vdSicVRqdfg/0',
                    senderId: this.ownedId,
                    senderName: '张志鹏',
                    createTime: Date.now(),
                    contentType: this.$messageType.image,
                    isSent: false,
                    loading: true
                }
                console.log(params)
                this.$_sendMessageComplete(params)
            }
            const messageManager = {
                sendText,
                sendVoice,
                sendImage
            }
            this.$messageManager = messageManager
        },
        $_sendMessageComplete(messageInstance) {
            messageInstance.loading = true
            messageInstance.sent = false
            this.$emit('sendMessageComplete', messageInstance)
        },
        $_sendMessageSuccess(messageInstance) {
            messageInstance.loading = false
            messageInstance.sent = true
            this.$emit('sendMessageSuccess', messageInstance)
        },
        $_sendMessageFail(messageInstance) {
            messageInstance.loading = false
            messageInstance.sent = false
            this.$emit('sendMessageFail', messageInstance)
        }
    }
}
