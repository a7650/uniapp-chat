<template>
  <view class="text-box">
    <message-container
      :sender-avatar-url="message.senderAvatarUrl"
      :sender-name="message.senderName"
      :is-owned="isOwned"
    >
      <template>
        <text user-select>{{ message.content }}</text>
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
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped></style>
