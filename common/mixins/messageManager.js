import { mapGetters } from 'vuex'
import { sendMessage } from '@/common/api/chat'

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
      const sendText = (text) => {
        if (!text) return
        let params
        if (typeof text === 'string') {
          params = {
            id: String(Date.now()),
            content: text,
            senderAvatarUrl:
              'https://wx.qlogo.cn/mmhead/bj9JGugn6Uc7bSuicaFZ6CuZnkSUYOIAOygSiaTvhN71ib9vdSicVRqdfg/0',
            senderId: this.ownedId,
            senderName: '张志鹏',
            createTime: Date.now(),
            contentType: this.$messageType.text
          }
        } else {
          params = text
        }
        this.$_sendMessage(params)
      }
      const sendVoice = (voicePath, duration = 0 /** s */) => {
        if (!voicePath) return
        let params
        if (typeof voicePath === 'string') {
          params = {
            id: String(Date.now()),
            content: voicePath,
            senderAvatarUrl:
              'https://wx.qlogo.cn/mmhead/bj9JGugn6Uc7bSuicaFZ6CuZnkSUYOIAOygSiaTvhN71ib9vdSicVRqdfg/0',
            senderId: this.ownedId,
            senderName: '张志鹏',
            createTime: Date.now(),
            contentType: this.$messageType.voice,
            duration
          }
        } else {
          params = voicePath
        }
        this.$_sendMessage(params)
        this.$_sendMessageComplete(params)
      }
      const sendImage = (imagePath) => {
        if (!imagePath) return
        let params
        if (typeof imagePath === 'string') {
          params = {
            id: String(Date.now()),
            content: imagePath,
            senderAvatarUrl:
              'https://wx.qlogo.cn/mmhead/bj9JGugn6Uc7bSuicaFZ6CuZnkSUYOIAOygSiaTvhN71ib9vdSicVRqdfg/0',
            senderId: this.ownedId,
            senderName: '张志鹏',
            createTime: Date.now(),
            contentType: this.$messageType.image
          }
        } else {
          params = imagePath
        }
        this.$_sendMessage(params)
        this.$_sendMessageComplete(params)
      }
      const messageManager = {
        sendText,
        sendVoice,
        sendImage
      }
      this.$messageManager = messageManager
    },
    $_sendMessage(messageInstance) {
      sendMessage(messageInstance).then(
        () => {
          this.$_sendMessageSuccess(messageInstance)
        },
        () => {
          this.$_sendMessageFail(messageInstance)
        }
      )
      this.$_sendMessageComplete(messageInstance)
    },
    $_sendMessageComplete(messageInstance) {
      messageInstance.loading = true
      messageInstance.isSent = false
      this.$emit('sendMessageComplete', messageInstance)
    },
    $_sendMessageSuccess(messageInstance) {
      messageInstance.loading = false
      messageInstance.isSent = true
      this.$emit('sendMessageSuccess', messageInstance)
    },
    $_sendMessageFail(messageInstance) {
      messageInstance.loading = false
      messageInstance.isSent = false
      this.$emit('sendMessageFail', messageInstance)
    }
  }
}
