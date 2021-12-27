<template>
  <div class="login-container">
    <el-container class="box-wrapper">
      <el-aside></el-aside>
      <el-main >
        
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
        <div class="tit">用户登录</div>
          <el-form-item prop="username">
          
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Email"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              @input="usernameInput"
              @change="errmsg=false"
            />
          </el-form-item>

          <el-form-item prop="password">
            
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @input="passwordInput"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <p class="error" v-if="errmsg">
            <span>{{ errmsg || ''}}</span> 
            <router-link to="/register/step2?resend" class="link-button" v-if="reactive" replace>[重发激活邮箱]</router-link>
            <el-button class="link-button" @click="gotoMailServer" v-if="reactive" size="mini" type="text" :center="true">[去邮箱激活]</el-button>
          </p>
          <el-button
            :loading="loading"
            :disabled="lock"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >登录</el-button>
          <el-row>
            <el-col :span="8" :offset="4"><router-link to="/forget/index">忘记密码</router-link></el-col>
            <el-col :span="8"><router-link to="/register">免费注册</router-link></el-col>
          </el-row>
          <el-divider>第三方登录</el-divider>
          <div style="text-align:center">
              <span class="wx-svg-container" @click="thirdHandleClick('wechat_open')"><svg-icon icon-class="wechat" class="icon" /></span>
              <span class="imp-svg-container" @click="thirdHandleClick('imp')"><svg-icon icon-class="imp" class="icon" /></span>
              <!-- <span class="tt-svg-container" @click="thirdHandleClick('facebook')"><svg-icon icon-class="twitter" class="icon" /></span> -->
          </div>
        </el-form>
        
      </el-main>
      
    </el-container>
    <div class="footer">

    </div>
      <el-dialog
        title="绑定"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
        class="bind-dialog"
        >
        <div class="body">
          <p><i class="el-icon-warning-outline"/></p>
          <p>该帐号暂未绑定楼兰平台帐号</p>
          <p>您可以选择绑定已有帐号或者创建新帐号</p>
        </div>
        
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="goBind">绑定已有帐号</el-button>
          <el-button @click="goRegister">注册新帐号</el-button>
          
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import openWindow from '@/utils/open-window'
import Cookies from 'js-cookie'
import oauthMap from '@/utils/oauthMap'
import local from '@/utils/local'
import UrlSearch from '@/utils/urlSearch'

export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      lock: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'change', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'change', validator: validatePassword }
        ]
      },
      loading: false,
      showDialog: false,
      passwordType: 'password',
      redirect: undefined,
      errmsg: undefined,
      reactive: false,
      //三方登录
      centerDialogVisible: false,
      oauthUserId:'',
      urlPars: null
    }
  },
  created() {
    var self = this
    window.handleOauthLoginCallback = function(id) {
      self.handleOauthLoginCallback(id,self)
    }
    
    let urlPars = new UrlSearch();
    if (urlPars.article_id) {
      local.set(urlPars.pl, urlPars);
    }

  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      var self = this;
      var urlPars = new UrlSearch();
      this.$refs.loginForm.validate((valid) => {
        this.reactive = false;
        if (valid) {
          this.loginForm.username = this.loginForm.username.toLowerCase()
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              if (urlPars.article_id) {
                this.$router.push({path: 'push'})
              }
              else {
                this.$router.push({ path: this.redirect || '/' })
              }
              this.loading = false

            })
            .catch(res => {
              this.errmsg = res.msg
              if(res.data && res.data === "unActived" ) {
                this.reactive = true;
              }
              console.log(res)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getMailServer(email){
        if(email){
            return `http://mail.${email.substr(email.indexOf("@")+1)}`
        }
        return null
    },
    gotoMailServer(){
        window.top.location = this.getMailServer(this.loginForm.username)
    },
    usernameInput() {
      this.errmsg = false;
    },
    passwordInput() {
      this.errmsg = false;
    },
//  三方登录 
    
    thirdHandleClick(authType) {
      const redirectUrl = encodeURIComponent(window.location.origin + '/#/oauth-login-redirect')
      const url = `${process.env.VUE_APP_BASE_API}/oauth_login/${authType}?returnUrl=${redirectUrl}`
      openWindow(url, authType, 540, 540)
    },
    handleOauthLoginCallback(id,self) {
      id = unescape(id)
      debugger
      
      //未绑定，提示用户绑定
      if(id.startsWith("unbind:")) {
        console.log(id)
        self.oauthUserId = id.substr(id.indexOf(":")+1)
        self.centerDialogVisible = true
        return
      }
      //已绑定，调用登录方法
      if(id.startsWith("bind:")) {
        self.oauthUserId = id.substr(id.indexOf(":")+1)
        self.$store
            .dispatch('user/oauthLogin', self.oauthUserId)
            .then(() => {

              debugger;
              let urlPars = new UrlSearch();
              if (urlPars.article_id) {
                self.$router.push({ path: '/push' })
              } 
              else {
                self.$router.push({ path: self.redirect || '/' })
              }
              
              self.loading = false
            })
        return
      }
      //用户未激活
      if(id.startsWith("unactive")) {
        self.$alert('请先激活您的邮箱，再登录！')
        return
      }
      //用户被锁定
      if(id.startsWith("locked")) {
        self.$alert('此帐号已经被锁定，不能登录！')
        return
      }
      //已绑定其它同源三方帐号
      if(id.startsWith("hasbind:")) {
        let source = id.substr(id.indexOf(":")+1)
        self.centerDialogVisible = true
        self.$alert('请先解除绑定的其他'+oauthMap[source]+'帐号,再进行绑定'+oauthMap[source]+'操作！')
        return
      }
      if(id.startsWith("err:")) {
        self.$alert(id)
        return
      }
    },
    goBind(){
      this.centerDialogVisible = false;
      this.$router.replace({ path: '/login/bind?oauthId='+this.oauthUserId })
    },
    goRegister(){
      this.centerDialogVisible = false;
      this.$router.replace({ path: '/register?oauthId='+this.oauthUserId })
    },
    
  }
}
</script>
<style lang="scss" scoped>
@import "./login.scss";
</style>
