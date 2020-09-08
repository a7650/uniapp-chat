<template>
  <view class="voice-box" @click="playVoiceMessage">
    <message-container
      :sender-avatar-url="message.senderAvatarUrl"
      :sender-name="message.senderName"
      :is-owned="isOwned"
    >
      <template>
        <view class="voice-content" :class="{ owned: isOwned }">
          <view class="duration">
            {{ parseInt(message.duration / 1000) }}"
          </view>
          <view
            class="voice-icon"
            :class="{
              'voice-icon-right': isOwned,
              'voice-icon-left': !isOwned,
              'voice-icon-right-an': isOwned && isPlaying,
              'voice-icon-left-an': !isOwned && isPlaying
            }"
          />
        </view>
      </template>
    </message-container>
  </view>
</template>

<script>
import commonMixin from './commonMixin'
import messageContainer from './messageContainer'

export default {
  components: { messageContainer },
  mixins: [commonMixin],
  props: {
    voicePlayingId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    isPlaying() {
      return this.voicePlayingId === this.message.id
    }
  },
  methods: {
    playVoiceMessage() {
      this.$emit('playVoiceMessage', this.message)
    }
  }
}
</script>
<style lang="scss" scoped>
.voice-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;
  height: 18px;
  padding: 0 4px;
  &.owned {
    flex-direction: row;
    justify-content: flex-end;
  }
}
.voice-icon {
  width: 36px;
  background-repeat: no-repeat;
  background-size: auto 18px;
}
.voice-icon-right {
  background-image: url('/static/images/voice-left-3.png');
  background-position: right center;
  margin-left: 10px;
}
.voice-icon-left {
  background-image: url('/static/images/voice-right-3.png');
  background-position: left center;
  margin-right: 10px;
}
.voice-icon-right-an {
  animation: voiceAnRight 1s linear infinite;
}
.voice-icon-left-an {
  animation: voiceAnLeft 1s linear infinite;
}
@keyframes voiceAnRight {
  0% {
    background-image: url('/static/images/voice-left-1.png');
  }
  50% {
    background-image: url('/static/images/voice-left-2.png');
  }
  100% {
    background-image: url('/static/images/voice-left-3.png');
  }
}
@keyframes voiceAnLeft {
  0% {
    background-image: url('/static/images/voice-right-1.png');
  }
  50% {
    background-image: url('/static/images/voice-right-2.png');
  }
  100% {
    background-image: url('/static/images/voice-right-3.png');
  }
}
</style>
