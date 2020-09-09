<template>
  <view class="message-container" :class="{ owned: isOwned }">
    <image :src="message.senderAvatarUrl" class="avatar" mode="aspectFill" />
    <view class="content" @click="contentClick">
      <!-- <view class="name">
        {{ senderName }}
      </view> -->
      <view class="arrow" :class="[isOwned ? 'right' : 'left']" />
      <view class="message">
        <slot />
      </view>
      <view
        v-if="retryLoading && message.loading && !message.isSent"
        class="retry-loading"
      >
        <u-loading mode="circle" color="red" size="30" />
      </view>
      <view v-if="!message.loading && !message.isSent" class="status">
        <u-icon name="info-circle-fill" color="#f00" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default() {
        return null
      }
    },
    isOwned: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      retryLoading: false
    }
  },
  methods: {
    contentClick() {
      if (!this.message.loading && !this.message.isSent) {
        this.retryLoading = true
        this.$emit('retry')
      } else {
        this.$emit('contentClick')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.message-container {
  width: 750rpx;
  margin-bottom: 15px;
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  .content {
    /* margin: 0 10px; */
    display: flex;
    .name {
      max-width: 400rpx;
      @include no-wrap;
      font-size: 13px;
      color: $color-text-l;
      margin-bottom: 6px;
    }
    .arrow {
      /* background-color: $color-theme; */
      margin-top: 12px;
      border: 6px solid transparent;
      width: 0;
      height: 0;
      &.left {
        border-right-color: $color-theme;
      }
      &.right {
        border-left-color: $color-theme;
      }
    }
    .message {
      max-width: 400rpx;
      color: #fff;
      background-color: $color-theme;
      font-size: 14px;
      border-radius: 8px;
      padding: 4px 6px;
      word-break: break-all;
      display: flex;
      align-items: center;
    }
    .retry-loading,
    .status {
      height: 100%;
      display: flex;
      align-items: center;
      margin: 0 5px;
    }
  }
  &.owned {
    flex-direction: row-reverse;
    .content {
      flex-direction: row-reverse;
      .name {
        text-align: right;
      }
    }
  }
}
</style>
