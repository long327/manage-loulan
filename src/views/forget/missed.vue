<template>
  <div class="reg-container">
    <el-container class="box-wrapper">
      <!-- <el-header>
        <el-steps :active="1" align-center>
          <el-step title="邮箱注册" ></el-step>
          <el-step title="邮箱激活" ></el-step>
          <el-step title="完善信息" ></el-step>
        </el-steps>
      </el-header> -->
      <el-main>
        <el-card style="font-size:14px">
            <div >
                <p class="email-icon"><i class="el-icon-warning-outline" /></p>
                <span class="email-info">您的激活链接已失效！</span>
            </div>
            <p style="text-align:center"><router-link to="/forget/index" class="link">重新发送邮件</router-link></p> 
            
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'missed',
  data() {
    return {
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
