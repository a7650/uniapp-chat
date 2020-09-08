<template>
  <view class="class">
    <message-container
      :sender-avatar-url="message.senderAvatarUrl"
      :sender-name="message.senderName"
      :is-owned="isOwned"
    >
      <u-image
        :src="message.content"
        width="150rpx"
        mode="widthFix"
        @click="preview"
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
    }
  }
}
</script>
<style lang="scss" scoped></style>
