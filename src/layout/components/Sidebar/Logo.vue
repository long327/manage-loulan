<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <a href="http://www.kroraina.com.cn" target="_blank" v-if="collapse" class="sidebar-logo-fold">
      </a>
      <a href="http://www.kroraina.com.cn" target="_blank" v-else class="sidebar-logo">
      </a>
    </transition>
    
  </div>
</template>

<script>
import defaultSettings from '@/settings'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: defaultSettings.title,
      logo: require("@/assets/images/loulan_logo.png")
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 90px;
  line-height: 90px;
  background: white;
  text-align: center;
  overflow: hidden;

    & .sidebar-logo {
      background-image: url("../../../assets/images/sidebar-logo.png");
      background-position: center;
      background-repeat: no-repeat;
      background-size: 60%;
      height:100%;
    }
    & .sidebar-logo-fold {
      background-image: url("../../../assets/images/sidebar-logo-fold.png");
      background-position: 10px 15px;
      background-repeat: no-repeat;
      background-size: 90%;
      vertical-align: middle;
      margin-right: 12px;
      height:100%;
    }
    // & .sidebar-title {
    //   display: inline-block;
    //   margin: 0;
    //   font-weight: 600;
    //   line-height: 50px;
    //   font-size: 14px;
    //   font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    //   vertical-align: middle;
    // }
 

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
