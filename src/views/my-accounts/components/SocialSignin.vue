<template>
  <div class="social-signup-container">
    <p class="info">授权添加我的社交号，添加后即可通过本平台向社交平台发贴、监控社交号数据</p>
    <p class="warning"><i class="el-icon-warning" style="color:orange;font-size:18px" />
      Facebook、Twitter <!-- 、Youtube --> 需要特殊网络环境，请先确认网络畅通  
    </p>
    <div class="sign-btn" @click="thirdHandleClick('facebook')">
      <span class="fb-svg-container"><svg-icon icon-class="facebook" class="icon" /></span>
      <p>去Facebook授权</p>
    </div>
    <div class="sign-btn" @click="thirdHandleClick('twitter')">
      <span class="tt-svg-container"><svg-icon icon-class="twitter" class="icon" /></span>
      <p>去Twitter授权</p>
    </div>
    <div class="sign-btn isYoutube-authorized" @click="thirdHandleClick('google')">
      <span class="youtube-svg-container"><svg-icon icon-class="google" class="icon" /></span>
      <p>去Youtube授权</p>
    </div>
    <!-- <div class="sign-btn" @click="thirdHandleClick('wechat')">
      <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span>
      WeChat
    </div>
    <div class="sign-btn" @click="thirdHandleClick('weibo')">
      <span class="wb-svg-container"><svg-icon icon-class="weibo" class="icon" /></span>
      weibo
    </div> -->
  </div>
</template>

<script>
import openWindow from '@/utils/open-window'
export default {
  name: 'SocialSignin',
  methods: {
    thirdHandleClick(authType) {
      this.$store.dispatch("user/isAlive")
      .then(res => {
            const redirectUrl = encodeURIComponent(window.location.origin + '/#/auth-redirect')
            const url = `${process.env.VUE_APP_BASE_API}/oauth/${authType}?returnUrl=${redirectUrl}`
            openWindow(url, authType, 800, 700)
          
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/styles/variables.scss';
  .social-signup-container {
    margin:0;
    font-size:12px;
    .info {
      color:$primary_dark;
    }
    .sign-btn {
      display: inline-block;
      cursor: pointer;
      width:100px;
      text-align: center;
      border: #eee solid 1px;
      border-radius: 5px;
      margin:10px;
      position: relative;
      height:100px;
      transform: scale(.88);
      &:hover {
        border-color:$primary;
        box-shadow: 0 0  5px 0px $primary;
        p {
          background-color: $primary;
          color:white;
        }
      }
      p {
        position: absolute;
        bottom:0;
        left:0;
        margin:0;
        padding:5px 0;
        width:100%;
        background-color: $bg;
      }
    }
    .icon {
      color: #fff;
      font-size: 28px;
      margin-top: 4px;
    }
    .wx-svg-container,
    .fb-svg-container,
    .tt-svg-container,
    .wb-svg-container,
    .youtube-svg-container {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      padding-top: 2px;
      border-radius: 20px;
      margin-top:18px;
    }
    .wx-svg-container {
      background-color: $wechat_open;
    }
    .wb-svg-container {
      background-color: orangered;
    }
    .fb-svg-container {
      background-color: $facebook;
    }
    .tt-svg-container {
      background-color: $twitter;
    }
    .youtube-svg-container {
      background-color: $google;
    }
  }
</style>
