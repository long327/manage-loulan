<template>
  <div class="reg-container">
    <el-container class="box-wrapper">
      <el-header>
        <el-steps :active="1" align-center>
          <el-step title="邮箱注册" ></el-step>
          <el-step title="邮箱激活" ></el-step>
          <el-step title="完善信息" ></el-step>
        </el-steps>
      </el-header>
      <el-main>
        <el-card style="font-size:14px; width:420px; margin:0 auto" v-if="!emailSend">
            <h3 style="text-align:center">重新发送邮件</h3>
            <el-form ref="emailForm" 
            
            :model="emailForm" :rules="rules" class="reg-form" label-position="left" label-width="80px">
              <el-form-item prop="email" label="邮箱">
                <el-input
                  ref="email"
                  v-model="emailForm.email"
                  placeholder="您的email"
                  name="email"
                  type="text"
                  tabindex="1"
                />
              </el-form-item>

              <el-form-item prop="slideVerify" label="验证">
                <drag-verify
                  ref="dragVerify"
                  :width="300"
                  :isPassing.sync="emailForm.slideVerify"
                  text="请按住滑块拖动"
                  successText="验证通过"
                  handlerIcon="el-icon-d-arrow-right"
                  successIcon="el-icon-circle-check"
                  style="border:#ddd solid 1px"
                >
                  <i
                    v-show="!emailForm.slideVerify"
                    slot="textBefore"
                    class="el-icon-lock"
                  ></i>
                </drag-verify>
              </el-form-item>
              <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleSendEmail" :disabled="sending">发送</el-button>
              <!-- <div class="tips">
                <span style="margin-right:20px;">username: admin</span>
                <span> password: any</span>
              </div> -->

          </el-form>
        </el-card>
        <el-card style="font-size:14px"  v-if="emailSend">
            <div >
                <p class="email-icon"><svg-icon icon-class="email" class="icon" /></p>
                <span class="email-info">我们已经向您的邮箱 <b>{{email}}</b> 发送了一封激活邮件，请点击邮件中的链接完成注册！</span>
            </div>
            <p style="text-align:center"><el-button @click="gotoMailServer" type="primary" :center="true">立即登录邮箱</el-button></p> 
            <hr>
            <p>没有收到邮件？</p>
            <p>1. 请检查邮箱地址是否正确，你可以返回 <router-link class="link" to="/register">重新填写</router-link> </p>
            <p>2. 检查你的邮件垃圾箱</p>
            <p>3. 若仍未收到确认，请尝试 <el-button type="text" size="medium" @click="reset" >重新发送</el-button> </p>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import valid from "@/utils/user-valid"
import dragVerify from "vue-drag-verify2"
import { sendEmail } from "@/api/register"
import { getMailServer } from "@/utils/email"

export default {
  name: 'reg_step_2',
  components:{ dragVerify},
  data() {
    return {
      email: Cookies.get("regEmail"),
      sending: false,
      loading: false,
      emailSend: true,
      emailForm:{
        email: Cookies.get("regEmail"),
        slideVerify: false
      },
      rules: {
        email: [ { required: true, trigger: 'change', validator: valid.validateEmail } ],
        slideVerify: [{ required:true, trigger: 'blur', validator: (rule, value, callback) =>{
            if(!value) {
              callback(new Error('请拖动滑块进行验证！'))
            } else {
              callback()
            }
          } 
        }],
      },
    }
  },
  created(){
    var hash = window.location.hash
    var index = hash.indexOf('?')
    if( index != -1 ){ 
      var oper = hash.substr(index+1)
      if( oper === "resend" ){
        this.emailSend = false
      }
    }
  },
  methods: {
    gotoMailServer(){
        window.top.location = getMailServer(this.email)
    },
    handleSendEmail(){
      this.$refs.emailForm.validate(valid => {
        if (valid) {
          this.emailForm.email = this.emailForm.email.toLowerCase()
          this.loading = true
          sendEmail(this.emailForm.email).then((res) => {
            this.emailSend = true
            this.loading = false
          }).catch((res) => {
            this.$message(
              {
                  message: res.msg,
                  type: 'error'
              }
            )
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
      this.$refs.dragVerify.reset()
      this.emailForm.slideVerify = false
    },
    reset(){
      this.emailSend = false
      this.$nextTick(() => {
       this.resetVerify()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#f5f6fa;
$dark_gray:#ccc;
$light_gray:#fff;
$primary:#7E7EF4;
.reg-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .box-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    height: 600px;
  }
  .el-header {
    padding: 50px 0;
    margin-bottom: 30px;
  }
  .el-main {
    width: 600px;
    
  //   border:red solid 1px;
    margin:10px auto;
  }
  .el-card {
    border-radius: 6px;
    .email-icon{
        font-size:28px;
        width:40px;
        height: 40px;
        padding:4px 6px;
        margin: 0 10px 0 0;
        float:left;
        border-radius: 20px;
        background-color: #7E7EF4;
        .icon {
            line-height: 40px;
            color: #FFAA00;
        }
    }
    .email-info{
        line-height: 1.5em;
    }
  }

  
  .link {
      color:$primary;
  }
  hr {
      color:$dark_gray;
      border-top: 1px solid $dark_gray;
      background-color: none;
  }

}
</style>
