<template>
  <div class="reg-container">
    <el-container class="box-wrapper">
      <el-header>
        <el-steps :active="2" align-center>
          <el-step title="邮箱注册" ></el-step>
          <el-step title="邮箱激活" ></el-step>
          <el-step title="完善信息" ></el-step>
        </el-steps>
      </el-header>
      <el-main>
        <el-card style="font-size:14px">
            <div >
                <p class="email-icon"><i class="el-icon-circle-check" /></p>
                <span class="email-info">恭喜，您已成功激活邮箱！</span>
            </div>
            <p style="text-align:center"><el-button @click="gotoLogin" type="primary" :center="true">现在去登录完善信息</el-button></p> 
            
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'actived',
  data() {
    return {
      
    }
  },
  
  methods: {
    gotoLogin(){
      this.$router.replace("/login")
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
        margin: 0 10px 0 0;
        float:left;
        border-radius: 20px;
        i {
            line-height: 40px;
            font-size:40px;
            color:green
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
