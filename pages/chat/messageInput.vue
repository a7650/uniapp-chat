<template>
  <view
    class="input-box"
    :style="{ bottom: currentFocus === 'input' ? keyboardHeight + 'px' : 0 }"
  >
    <view class="input-box-flex">
      <image
        v-if="chatType === messageType.text"
        class="text-voice-switch"
        src="/static/images/voice.png"
        @click="switchChatType(messageType.voice)"
      />
      <image
        v-if="chatType === messageType.voice"
        class="text-voice-switch"
        src="/static/images/keyboard.png"
        @click="switchChatType(messageType.text)"
      />
      <!-- 语音&文本输入 -->
      <view class="input-box-flex-grow">
        <input
          v-if="chatType === messageType.text"
          id="input"
          v-model="textMessageContent"
          type="text"
          class="content"
          placeholder-style="color:#DDDDDD;"
          :hold-keyboard="true"
          :confirm-type="'send'"
          :confirm-hold="true"
          :cursor-spacing="10"
          :adjust-position="false"
          @confirm="sendTextMsg"
          @keyboardheightchange="
            panelFocusChange($event.detail.height, 'input')
          "
        >
        <view
          v-if="chatType === messageType.voice"
          class="voice-title"
          :style="{ background: recording ? '#c7c6c6' : '#FFFFFF' }"
          @touchstart.stop.prevent="startVoice"
          @touchmove.stop.prevent="moveVoice"
          @touchend.stop="endVoice"
          @touchcancel.stop="cancelVoice"
        >
          {{ recording ? '正在录音' : '按住 说话' }}
        </view>
      </view>
      <!-- 扩展功能 -->
      <image
        v-if="!sendBtnVisible"
        class="function-btn"
        src="/static/images/add.png"
        @tap="switchFun"
      />
      <button
        :class="{ hide: !sendBtnVisible }"
        class="send-btn"
        @click="sendTextMsg"
      >
        发送
      </button>
    </view>

    <view class="fun-box" :class="{ 'show-fun-box': functionBoxVisible }">
      <u-grid :col="4" :border="false" @click="clickFunBox">
        <u-grid-item
          v-for="(item, index) in funList"
          :key="index"
          :index="index"
          bg-color="transparent"
        >
          <u-icon :name="item.icon" :size="40" />
          <view class="grid-text">{{ item.title }}</view>
        </u-grid-item>
      </u-grid>
    </view>

    <!-- 语音动画 -->
    <view v-if="recording" class="voice-an">
      <view class="voice-an-icon">
        <view v-for="item in 9" :key="item" class="wave" />
      </view>
      <block v-if="!isCanceledRecord">
        <view class="text">正在录音...</view>
        <view class="cancel-tip"> 手指上滑 取消发送 </view>
      </block>
      <block v-else>
        <view class="cancel-tip"> 松开手指 取消发送 </view>
      </block>
      <view class="voice-time" />
    </view>
  </view>
</template>

<script>
import messageManager from '@/common/mixins/messageManager'
import { mapGetters } from 'vuex'
export default {
  mixins: [messageManager],
  props: {
    keyboardHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    /**
     * 通过messageManager添加的属性
     * @property {MessageManager} $messageManager
     */
    return {
      messageType: this.$messageType,
      chatType: 'text', // text || voice
      textMessageContent: '',
      recording: false, // 是否处于录音状态
      recorder: uni.getRecorderManager(),
      voiceTime: 0,
      isCanceledRecord: false,
      isStopRecord: false,
      funList: [
        { type: 'photo', icon: 'photo-fill', title: '照片' },
        { type: 'camera', icon: 'camera-fill', title: '拍摄' }
      ],
      currentFocus: '' // 当前打开的面板
    }
  },
  computed: {
    ...mapGetters(['ownedId']),
    sendBtnVisible() {
      return this.chatType === this.messageType.text && this.textMessageContent
    },
    functionBoxVisible() {
      return this.currentFocus === 'funBox'
    }
  },
  watch: {
    currentFocus(newVal, oldVal) {
      if (oldVal === 'input') {
        uni.hideKeyboard()
      }
    }
  },
  created() {
    this.recorder.onStart((e) => {
      this.beginVoice()
    })
    this.recorder.onStop((res) => {
      clearInterval(this.voiceInterval)
      this.sendVoiceMsg(res)
    })
  },
  methods: {
    switchChatType(type) {
      this.chatType = type
    },
    sendTextMsg() {
      this.$messageManager.sendText(this.textMessageContent)
      this.textMessageContent = ''
    },
    sendVoiceMsg({ tempFilePath, duration }) {
      this.recording = false
      if (this.isStopRecord && !this.isCanceledRecord) {
        if (duration < 600) {
          this.$toast('说话时间过短')
          return
        }
        this.$messageManager.sendVoice(tempFilePath, duration)
      }
    },
    sendImageMsg(path) {
      this.$messageManager.sendImage(path)
    },
    switchFun() {
      this.panelFocusChange(this.functionBoxVisible ? 0 : 150, 'funBox')
    },
    startVoice(e) {
      this.$emit('stopVoiceMessage')
      uni.vibrateShort()
      this.recording = true
      this.isCanceledRecord = false
      this.isStopRecord = false
      this.recordPointY = e.touches[0].clientY
      this.voiceTime = 0
      this.recorder.start({
        format: 'mp3'
      })
    },
    beginVoice() {
      if (this.isStopRecord) {
        this.recorder.stop()
        return
      }
      this.voiceInterval = setInterval(() => {
        this.voiceTime++
      }, 1000)
    },
    moveVoice(e) {
      const recordPointY = e.touches[0].clientY
      const slideY = this.recordPointY - recordPointY
      this.isCanceledRecord = slideY > uni.upx2px(120)
    },
    endVoice() {
      this.isStopRecord = true // 该录音已完成，防止重复录制
      this.recorder.stop()
    },
    cancelVoice(e) {
      this.voiceTime = 0
      this.recorder.stop()
    },
    clickFunBox(index) {
      const type = this.funList[index].type
      if (type === 'photo') {
        this.chooseImage(['album'])
      } else if (type === 'camera') {
        this.chooseImage(['camera'])
      }
    },
    chooseImage(sourceType) {
      uni.chooseImage({
        sourceType,
        // sizeType: ['compressed'],
        success: (res) => {
          res.tempFilePaths.forEach((item) => {
            this.sendImageMsg(item)
          })
        }
      })
    },
    panelFocusChange(height, from) {
      this.$emit('update:keyboardHeight', parseInt(height) || 0)
      this.currentFocus = height > 0 ? from : ''
    }
  }
}
</script>
<style lang="scss" scoped>
$input-background: rgb(246, 246, 246);
.input-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: content-box;
  z-index: 999;
  padding-bottom: 0rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  transition: all 0.1s ease-in-out;
  &-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    padding: 14rpx 20rpx;
    box-sizing: border-box;
    z-index: 10;
    position: relative;
    background-color: $input-background;
    image {
      width: 56rpx;
      height: 56rpx;
    }
    .text-voice-switch {
      margin-right: 20rpx;
    }
    .input-box-flex-grow {
      margin-right: 20rpx;
    }
    .send-btn {
      width: 100rpx;
      height: 70rpx;
      padding: 0;
      text-align: center;
      background-color: $color-theme;
      border-radius: 12rpx;
      color: #fff;
      line-height: 70rpx;
      font-size: 14px;
      transition: 0.2s;
      &.hide {
        width: 0;
        opacity: 0;
      }
    }
    .function-btn {
    }
    &-grow {
      flex-grow: 1;

      .content {
        box-sizing: border-box;
        background-color: #fff;
        height: 70rpx;
        padding: 0 20rpx;
        border-radius: 12rpx;
        font-size: 28rpx;
        caret-color: $uni-color-success;
      }

      .voice-title {
        text-align: center;
        background-color: #ffffff;
        height: 70rpx;
        line-height: 70rpx;
        border-radius: 12rpx;
      }
    }
  }

  .fun-box {
    opacity: 0;
    transition: all 0.1s ease-in-out;
    height: 0;
    z-index: 10;
    position: relative;
    background-color: $input-background;
    .grid-text {
      padding-top: 10rpx;
      color: $color-text-l;
    }
  }
  .show-fun-box {
    opacity: 1;
    height: 150px;
  }
}

.voice-an {
  width: 750rpx;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 100rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1;
  .text {
    padding-top: 30rpx;
  }
  @keyframes runVoice {
    0% {
      height: 10%;
    }
    20% {
      height: 50%;
    }
    50% {
      height: 100%;
    }
    80% {
      height: 50%;
    }
    100% {
      height: 0%;
    }
  }
  .voice-an-icon {
    width: 200rpx;
    height: 50rpx;
    line-height: 50rpx;
    margin: 50rpx 0;
  }
  .wave {
    width: 6rpx;
    height: 100%;
    margin-left: 10rpx;
    border-radius: 50rpx;
    background-color: $color-theme;
    vertical-align: middle;
    display: inline-block;
    &:nth-child(1) {
      animation: runVoice 0.6s infinite 0.1s;
    }
    &:nth-child(2) {
      animation: runVoice 0.6s infinite 0.3s;
    }
    &:nth-child(3) {
      animation: runVoice 0.6s infinite 0.6s;
    }
    &:nth-child(4) {
      animation: runVoice 0.6s infinite 0.1s;
    }
    &:nth-child(5) {
      animation: runVoice 0.6s infinite 0.3s;
    }
    &:nth-child(6) {
      animation: runVoice 0.6s infinite 0.6s;
    }
    &:nth-child(7) {
      animation: runVoice 0.6s infinite 0.1s;
    }
    &:nth-child(8) {
      animation: runVoice 0.6s infinite 0.3s;
    }
    &:nth-child(9) {
      animation: runVoice 0.6s infinite 0.6s;
    }
  }
  .voice-time {
  }
}
</style>
