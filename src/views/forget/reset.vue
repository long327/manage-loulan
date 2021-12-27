<template>
  <div class="reg-container">
    <el-container class="box-wrapper">

      <el-main>
        <el-card style="font-size:14px; width:420px; margin:0 auto" >
            <h3 style="text-align:center">重置密码</h3>
            <el-form ref="dataForm" 
            :model="dataForm" 
            v-if="dataForm.ticket"
            :rules="rules" class="reg-form" label-position="left" label-width="80px">
              <el-form-item prop="password" label="新密码">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="dataForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                />
              </el-form-item>

              <el-form-item prop="confirmPassword" label="再次输入">
              
                <el-input
                  :key="passwordType"
                  ref="confirmPassword"
                  v-model="dataForm.confirmPassword"
                  :type="passwordType"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  tabindex="3"
                />
              </el-form-item>

              
              <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleSendEmail">提交</el-button>
              <!-- <div class="tips">
                <span style="margin-right:20px;">username: admin</span>
                <span> password: any</span>
              </div> -->

          </el-form>
          <p v-if="!dataForm.ticket" style="padding:2em">
            链接失效，如需重置密码，请移步 <router-link to="/forget/index" class="link">[重置密码]</router-link>
          </p>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import valid from "@/utils/user-valid"
import {resetPassword} from "@/api/forget"
export default {
  name: 'resetPassword',
  data() {
    return {
      dataForm: {
        ticket: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        password: [ { required: true, trigger: 'change', validator: valid.validatePassword } ],
        confirmPassword: [
          { required: true, trigger: 'change', validator: (rule, value, callback) => {
              if (!value || value !== this.dataForm.password ) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            } 
          }
        ],
       
      },
      loading: false,
      passwordType: 'password',
      
    }
  },
  created(){
    var hash = window.location.hash
    var index = hash.indexOf("?")
    if(index > 0){
      var ticket = hash.substr(index+1)
      if(ticket || ticket.length === 32){
        this.dataForm.ticket = ticket
        return
      }
    }
  },
  methods: {
    handleSendEmail(){
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          resetPassword(this.dataForm).then(() => {
            this.$message({ duration: 1000, message: "重置密码成功，请登录！", type: "success"})
            setTimeout(() => {
              this.$router.push({ path: '/login' })
            }, 2000)
            this.loading = false
          }).catch((res) => {
            this.$message(res.msg)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
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
$warning: #FFAA00;
$err: #e42807;
.reg-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .box-wrapper {
    max-width: 800px;
    margin: 3em auto;
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
        margin: 0 10px 0 0;
        float:left;
        border-radius: 20px;
        i {
            line-height: 40px;
            font-size:40px;
            color:$err
        }
    }
    .email-info{
        line-height: 3em;
    }
  }
  
  .link {
      color:$primary;
  }
  

}
</style>
