<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <i v-if="isActive" class="el-icon-s-fold hamburger" />
    <i v-else class="el-icon-s-unfold hamburger" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  color: #fff;
  font-size:20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
