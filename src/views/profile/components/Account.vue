<template>
<div class="formList-container">
  <el-form
    ref="myinfoForm"
        :rules="rules"
        :model="user"
        :label-position="labelPosition"
  >
    <!-- <el-form-item label="用户名" prop="username" :required="true">
      <el-input v-model="user.username" placeholder="email" disabled />
    </el-form-item> -->

    <el-form-item label="昵称" prop="nick">
      <el-input v-model="user.nick" 
        :disabled="isEditNick"
        :class="{isEditNick: !isEditNick}"
        placeholder="User_123456" />
      <span class="el-icon-edit" 
        v-if="isEditNick"
        @click="modify('nick')"
      ></span>
      <span v-else>
        <el-button type="text" @click="cancel('nick')">取消</el-button>
        <el-button type="text" @click="save('nick')">保存</el-button>
      </span>
    </el-form-item>
    <!-- <el-form-item label="电话" prop="phone">
      <el-input v-model="user.phone" placeholder="电话" />
    </el-form-item> -->
    <el-form-item label="邮箱" prop="username" >
      <el-input v-model="user.username" 
        :disabled="true"
        placeholder="loulantest@cri.cn" />
    </el-form-item>
    <el-form-item label="公司" prop="company">
      <el-input v-model="user.company"
        :disabled="isEditCompany"
        :class="{isEditCompany: !isEditCompany}"
       placeholder="" />
      <span class="el-icon-edit" 
        v-if="isEditCompany"
        @click="modify('company')"
      ></span>
      <span v-else>
        <el-button type="text" @click="cancel('company')">取消</el-button>
        <el-button type="text" @click="save('company')">保存</el-button>
      </span>

    </el-form-item>

    <el-form-item label="微信" v-if="user.weChat && user.weChat.id" >
      <el-input v-model="user.weChat.nickname" 
         :disabled="true"
      placeholder="" />
      
      <el-button  type="text" @click="unbind(user.weChat.id, 'weChat')">解绑微信</el-button>
    </el-form-item>

    <el-form-item label="IMP" v-if="user.IMP && user.IMP.id" >
      <el-input  v-model="user.IMP.nickname" 
         :disabled="true"
      placeholder="" />
      
      <el-button  type="text" @click="unbind(user.IMP.id, 'IMP')">解绑IMP</el-button>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" 
        show-password
        :disabled="true"
      placeholder="******" />
      <el-button type="text" @click="dialog">修改密码</el-button>
    </el-form-item>
    <!--<el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item> -->

  </el-form>


</div>
</template>

<script>
import valid from "@/utils/user-valid"
import { updateMyInfo, unbind } from "@/api/user"

export default {
  data() {
    return {
      rules: valid.userInfoRules,
      labelPosition: 'right',
      isEditNick: true,
      isEditCompany: true,
      variable: ''
    }
  },
  inject: ["reload"],
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          nick: '',
          phone: '',
          email: '',
          company: '',
          password: '',
          weChat: {},
          IMP: {}
        }
      }
    }
  },
  methods: {
    submit(callback) {
      this.$refs['myinfoForm'].validate((valid) => {
        if (valid) {
          updateMyInfo(
            this.user
          ).then( res => {
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.$store.dispatch("user/updateInfo", res.data)
          })
          callback(true)
        }else {
          callback(false)
        }
      })
    },
    dialog() {
      this.$emit('dialogopen', true)
    },
    modify(type) {
      if (type == 'company') {
        this.isEditCompany = false;
        this.variableCompany = this.user.company;
      }
      else {
        this.isEditNick = false;
        this.variableNick = this.user.nick;
      }
    },
    cancel(type) {
      if (type == 'company') {
        this.isEditCompany = true;
        this.user.company = this.variableCompany;
      }
      else {
        this.isEditNick = true;
        this.user.nick = this.variableNick;
      }
    },
    save(type) {
      if (!this.user[type]) {
        this.$message.error('不能为空！');
        return;
      }
      var self = this;
      this.submit(function(valid){
        if(valid){
          if (type == 'company') {
            self.isEditCompany = true;
          }
          else {
            self.isEditNick = true;
          }
        }
      })
    },
    unbind(id, type) {
      unbind(id).then(res=>{
        this.$message({
              message: '解绑成功',
              type: 'success',
              duration: 3 * 1000
            })
        if (type == 'weChat') {
          this.$set(this.user.weChat, 'id', '');
        }
        if (type == 'IMP') {
          this.$set(this.user.IMP, 'id', '');
        }
        
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.formList-container ::v-deep{
  label.el-form-item__label{
    color: #909399;
    font-weight: unset;
  }
  .el-input{
    width: 20%;
  }
  .el-input input{
    border:unset;
  }
  .el-icon-edit{
    cursor: pointer;
  }
  .el-input.is-disabled .el-input__inner {
    background-color:unset;
  }
  .isEditCompany,
  .isEditNick {
    border-bottom: 1px solid #7e7ef4;
  }
}

</style>
