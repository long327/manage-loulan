<template>
  <div class="login-container">
    <div class="box-wrapper">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
        <div class="tit">绑定用户</div>
          <el-form-item prop="username">
          
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Email"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
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
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
         
          <el-button
            :loading="loading"
            :disabled="lock"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >登录并绑定</el-button>
        </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { bind } from '@/api/user'
import Cookies from 'js-cookie'
import local from '@/utils/local'

export default {
  name: 'oauthLoginBind',
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
      reactive: false,
      oauthId:''
    }
  },
  created() {
  },
  watch: {
    $route: {
      handler: function(route) {
        this.oauthId = route.query && route.query.oauthId
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
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loginForm.username = this.loginForm.username.toLowerCase()
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              bind(this.oauthId)
              .then(res=>{
                debugger
              })
              .catch(res=>{
                debugger
                this.$alert(res.msg)
              });
              if (local.get('imp')) {
                this.$router.push({ path: '/push' })
              }
              else {
                this.$router.push({ path: this.redirect || '/' })
              }
              
              this.loading = false
            })
            .catch(res => {
              this.$message({ duration: 1000, message: res.msg, type: "error"})
              console.log(res)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
@import "./bind.scss";
</style>
