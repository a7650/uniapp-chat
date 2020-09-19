<template>
  <view class="chat-page" :style="{ paddingBottom: pagePaddingBottom }">
    <chat-head />
    <view class="bg" />
    <u-loadmore
      :status="loadMessageLoading ? 'loading' : hasMore ? 'loadmore':'nomore'"
      bg-color="#f7f7f7"
      :load-text="loadText"
    />
    <view class="chat-main" @touchstart="chatMainTouch">
      <view
        v-for="item in messageList"
        :id="'msg-' + item.id"
        :key="item.id"
        class="message"
      >
        <block v-if="item">
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
        </block>
      </view>
    </view>
    <message-input
      ref="messageInput"
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
import { loadMessage } from '@/common/api/chat'

export default {
  components: { chatHead, messageInput, textBox, voiceBox, imageBox },
  data() {
    return {
      messageList: [],
      messageType: this.$messageType,
      keyboardHeight: 0,
      audioPlayer: uni.createInnerAudioContext(),
      voicePlayingId: '', // 当前正在播放的语音消息的id
      hasMore: true, // 是否有更多消息
      loadMessageLoading: false,
      firstLoad: true,
      loadText: {
        nomore: '打个招呼吧',
        loadmore: '下拉加载更多',
        loading: '正在加载'
      }
    }
  },
  computed: {
    pagePaddingBottom() {
      return this.keyboardHeight + uni.upx2px(130) + 'px'
    }
  },
  watch: {
    keyboardHeight() {
      this.seekPageToBottom()
    }
  },
  created() {
    this.loadMessage()
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
      console.log('发送成功')
    },
    sendMessageFail(messageInstance) {
      this.replaceMessageItem(messageInstance)
      console.log('发送失败')
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
    },
    fixPageScroll(selector) {
      const view = uni.createSelectorQuery().in(this).select(selector)
      view
        .boundingClientRect((data) => {
          console.log(data)
          uni.pageScrollTo({
            scrollTop: data && data.top - 110,
            duration: 0
          })
        })
        .exec()
    },
    chatMainTouch() {
      if (this.keyboardHeight > 0) {
        this.$refs.messageInput.panelFocusChange(0)
      }
    },
    loadMessage() {
      if (this.hasMore && !this.loadMessageLoading) {
        let createTime = null
        if (this.messageList.length > 0) {
          createTime = this.messageList[0].createTime
        }
        this.loadMessageLoading = true
        loadMessage({ createTime })
          .then((res) => {
            const elId = this.messageList.length > 0 && this.messageList[0].id
            this.messageList.unshift(...res.messageList)
            this.hasMore = res.hasMore
            if (this.firstLoad) {
              this.firstLoad = false
              this.seekPageToBottom()
            } else {
              if (elId) {
                this.$nextTick(() => {
                  console.log(elId)
                  this.fixPageScroll(`#msg-${elId}`)
                })
              }
            }
          })
          .finally(() => {
            this.loadMessageLoading = false
          })
      }
    }
  },
  onPageScroll(e) {
    if (e.scrollTop === 0) {
      this.loadMessage()
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-page {
  padding: 60rpx 0 130rpx 0;
  .bg {
    position: fixed;
    width: 750rpx;
    height: 100vh;
    z-index: -1;
    top: 0;
    left: 0;
    background-color: #f7f7f7;
  }
  .chat-main {
    position: relative;
  }
}
</style>
