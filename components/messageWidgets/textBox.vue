<template>
  <view class="text-box">
    <message-container :message="message" :is-owned="isOwned" @retry="retry">
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
  methods: {
    retry() {
      this.$messageManager.sendText(this.message)
    }
  }
}
</script>
<style lang="scss" scoped>
text {
  color: #000;
}
</style>
