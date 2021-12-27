<template>
  <div class="login-container">
    <el-container class="box-wrapper">
      <el-header>
        <el-steps :active="0" align-center>
          <el-step title="邮箱注册" ></el-step>
          <el-step title="邮箱激活" ></el-step>
          <el-step title="完善信息" ></el-step>
        </el-steps>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="12" style="height:400px" class="reg-left"></el-col>
          <el-col :span="12" class="reg-right">
             <el-form ref="regForm" :model="regForm" :rules="loginRules" class="reg-form" 
             auto-complete="on" 
             label-position="left"
             :v-loading="loading"
             >
              <el-form-item prop="username">
                <el-input
                  ref="username"
                  v-model="regForm.username"
                  placeholder="Email"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="regForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                />
              </el-form-item>

              <el-form-item prop="confirmPassword">
              
                <el-input
                  :key="passwordType"
                  ref="confirmPassword"
                  v-model="regForm.confirmPassword"
                  :type="passwordType"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  tabindex="3"
                />
              </el-form-item>
              <el-form-item prop="slideVerify">
                <drag-verify
                  ref="dragVerify"
                  :width="300"
                  :isPassing.sync="regForm.slideVerify"
                  text="请按住滑块拖动"
                  successText="验证通过"
                  handlerIcon="el-icon-d-arrow-right"
                  successIcon="el-icon-circle-check"
                >
                  <i
                    v-show="!regForm.slideVerify"
                    slot="textBefore"
                    class="el-icon-lock"
                  ></i>
                </drag-verify>
              </el-form-item>
              <el-form-item prop="agreement" style="border:none" :required="true">
                <el-checkbox v-model="regForm.agreement" >我已阅读并接受</el-checkbox><span class="agreement" @click="showAgreement">《楼兰用户协议》</span>
              </el-form-item>
              <el-button :loading="loading" :disabled='!regForm.agreement' type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
              <span class="route-link">
                <router-link to="/login">[已有用户，直接登录]</router-link>
              </span>
              <!-- <div class="tips">
                <span style="margin-right:20px;">username: admin</span>
                <span> password: any</span>
              </div> -->

            </el-form>
          </el-col>
        </el-row>
      </el-main>
      
    </el-container>
    <el-dialog id="contract" :title="'用户协议'" :visible.sync="showDialog" :width="'600px'" :center='true'  >
      <contract></contract>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="disAgree">不同意</el-button>
        <el-button
          type="primary"
          @click="setAgree"
        >我已阅读并同意</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import valid from "@/utils/user-valid"
import contract from "./contract"
import dragVerify from "vue-drag-verify2"
import Cookies from 'js-cookie'
import { register } from "@/api/register"

export default {
  name: 'Register',
    components:{ dragVerify, contract},
  data() {
    return {
      isPassing: false,
      //form
      regForm: {
        username: '',
        password: '',
        confirmPassword: '',
        slideVerify: false,
        agreement: false
      },
      loginRules: {
        username: [ { required: true, trigger: 'change', validator: valid.validateUsername } ],
        password: [ { required: true, trigger: 'change', validator: valid.validatePassword } ],
        confirmPassword: [
          { required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!value || value !== this.regForm.password ) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            } 
          }
        ],
        slideVerify: [{ required:true, trigger: 'blur', validator: (rule, value, callback) =>{
            if(!value) {
              callback(new Error('请拖动滑块进行验证！'))
            } else {
              callback()
            }
          } 
        }],
        agreement: [{ required:true, trigger: 'blur', validator: (rule, value, callback) =>{
            if(!value) {
              callback(new Error('阅读并接受协议才能注册本平台!'))
            } else {
              callback()
            }
          } 
        }]
      },
      loading: false,
      passwordType: 'password',
      //对话框
      showDialog: false
    }
  },
  methods: {
    showAgreement() {
      this.showDialog = true
    },
    setAgree(){
      this.showDialog = false
      this.regForm.agreement = true
    },
    disAgree(){
      this.showDialog = false
      this.regForm.agreement = false
    },
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
    handleRegister() {
      this.$refs.regForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.regForm.username = this.regForm.username.toLowerCase()
          register(this.regForm).then(() => {
            Cookies.set("regEmail",this.regForm.username)
            this.$router.push({ path: '/register/step2' })
          }).catch(() => {
            this.resetVerify()
            this.loading = false
          })
        } else {
          this.resetVerify()
          console.log('error submit!!')
          return false
        }
      })
    },
    resetVerify(){
      this.regForm.slideVerify = false
      this.$refs.dragVerify.reset()
    },
    
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
