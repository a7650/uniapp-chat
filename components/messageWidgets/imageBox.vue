<template>
  <view class="class">
    <message-container
      :message="message"
      :is-owned="isOwned"
      background-color="transparent"
      first-loading
      @retry="retry"
      @contentClick="preview"
    >
      <!-- <image show-menu-by-longpress :src="message.content" /> -->
      <u-image
        :src="message.content"
        width="150rpx"
        mode="widthFix"
        :show-menu-by-longpress="true"
      />
    </message-container>
  </view>
</template>

<script>
import commonMixin from './commonMixin'
import messageContainer from './messageContainer'
import ImageHelpers from '@/common/utils/imageHelpers'
export default {
  components: { messageContainer },
  mixins: [commonMixin],
  data() {
    return {}
  },
  methods: {
    preview() {
      ImageHelpers.previewImage(this.message.content)
    },
    retry() {
      this.$messageManager.sendImage(this.message)
    }
  }
}
</script>
<style lang="scss" scoped></style>
