<script>
export default {
  globalData: {}
}
</script>

<style lang="scss">
/*每个页面公共css */
/* page{
  background-color: #eeeeee;
} */
* {
  font-size: 14px;
}
/* 箭头 */
.icon.triangle {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #aeaeae;
  &.active {
    border-top: 6px solid $color-theme;
  }
}
img {
  width: auto;
  height: auto;
}

button::after {
  border: none;
}
.c-button,
.auth-button,
button {
  transition: 0.2s;
  &:active {
    transform: scale(0.95);
  }
}
/**按钮 */
.button-primary {
  width: 100%;
  background-color: $color-theme;
  color: #fff;
  border: none;
  border-radius: 2px;
  font-size: 16px;
}
.button-plain {
  width: 100%;
  background-color: $color-theme-l;
  border: 1px solid $color-theme;
  color: $color-theme;
  border-radius: 2px;
  font-size: 16px;
}
.extend-click::after {
  content: '';
  position: absolute;
  left: -10px;
  right: -10px;
  bottom: -10px;
  top: -10px;
  opacity: 0;
}
</style>
