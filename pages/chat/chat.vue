<template>
  <view
    class="chat-page"
    :style="{ paddingBottom: keyboardHeight + 65 + 'px' }"
  >
    <chat-head />
    <view class="chat-main">
      <view v-for="item in messageList" :key="item.id" class="message">
        <text-box
          v-if="item.contentType === messageType.text"
          :message="item"
          @sendMessageComplete="sendMessageComplete"
          @sendMessageSuccess="sendMessageSuccess"
          @sendMessageFail="sendMessageFail"
        />
        <voice-box
          v-else-if="item.contentType === messageType.voice"
          :message="item"
          :voice-playing-id="voicePlayingId"
          @sendMessageComplete="sendMessageComplete"
          @sendMessageSuccess="sendMessageSuccess"
          @sendMessageFail="sendMessageFail"
          @playVoiceMessage="playVoiceMessage"
        />
        <image-box
          v-else-if="item.contentType === messageType.image"
          :message="item"
          @sendMessageComplete="sendMessageComplete"
          @sendMessageSuccess="sendMessageSuccess"
          @sendMessageFail="sendMessageFail"
        />
      </view>
    </view>
    <message-input
      :keyboard-height.sync="keyboardHeight"
      @sendMessageComplete="sendMessageComplete"
      @sendMessageSuccess="sendMessageSuccess"
      @sendMessageFail="sendMessageFail"
      @stopVoiceMessage="stopVoiceMessage"
    />
  </view>
</template>

<script>
import chatHead from './head'
import messageInput from './messageInput'
import textBox from '@/components/messageWidgets/textBox'
import voiceBox from '@/components/messageWidgets/voiceBox'
import imageBox from '@/components/messageWidgets/imageBox'

export default {
  components: { chatHead, messageInput, textBox, voiceBox, imageBox },
  data() {
    return {
      messageList: [],
      messageType: this.$messageType,
      keyboardHeight: 0,
      audioPlayer: uni.createInnerAudioContext(),
      voicePlayingId: '' // 当前正在播放的语音消息的id
    }
  },
  watch: {
    keyboardHeight() {
      this.seekPageToBottom()
    }
  },
  created() {
    this.audioPlayer.onStop(() => {
      this.voicePlayingId = ''
    })
    this.audioPlayer.onEnded(() => {
      this.voicePlayingId = ''
    })
    this.audioPlayer.onError(() => {
      this.voicePlayingId = ''
    })
  },
  methods: {
    playVoiceMessage(messageInstance) {
      if (!messageInstance) {
        return
      }
      const play = () => {
        this.voicePlayingId = messageInstance.id
        this.audioPlayer.src = messageInstance.content
        this.audioPlayer.play()
      }
      if (!this.audioPlayer.paused) {
        if (this.voicePlayingId === messageInstance.id) {
          this.stopVoiceMessage()
        } else {
          play()
        }
      } else {
        play()
      }
    },
    stopVoiceMessage() {
      if (!this.audioPlayer.paused) {
        this.audioPlayer.stop()
      }
    },
    sendMessageComplete(messageInstance) {
      if (!this.replaceMessageItem(messageInstance)) {
        this.addMessage(messageInstance)
        setTimeout(() => {
          const newMessage = {
            ...messageInstance,
            id: String(Math.random()),
            senderId: 'service'
          }
          if (newMessage.contentType === 'text') {
            const content = newMessage.content
            newMessage.content = content
              .replace('你', '我')
              .replace('吗', '')
              .replace('为什么', '')
              .replace('谁', '客服')
              .replace('?', '!')
          }
          this.addMessage(newMessage)
        })
      }
    },
    sendMessageSuccess(messageInstance) {
      this.replaceMessageItem(messageInstance)
    },
    sendMessageFail(messageInstance) {
      this.replaceMessageItem(messageInstance)
    },
    replaceMessageItem(messageInstance) {
      const n = this.messageList.findIndex(
        (item) => item.id === messageInstance.id
      )
      if (n > -1) {
        this.messageList.splice(n, 1, messageInstance)
        return true
      }
      return false
    },
    addMessage(messageInstance) {
      this.messageList.push(messageInstance)
      this.seekPageToBottom()
    },
    seekPageToBottom() {
      this.seekScrollTimer && clearTimeout(this.seekScrollTimer)
      this.seekScrollTimer = setTimeout(() => {
        uni.pageScrollTo({
          scrollTop: 99999,
          duration: 100
        })
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-page {
  padding: 60rpx 0 130rpx 0;
}
</style>
