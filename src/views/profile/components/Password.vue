<template>
  <el-form
    ref="passwordForm"
        :rules="rules"
        :model="user"
  >
    <el-form-item label="原密码" prop="originPassword" :required="true">
          <el-input v-model="user.originPassword" placeholder="原密码" :required="true" type="password"/>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="user.password" placeholder="新密码" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" :required="true">
          <el-input v-model="user.confirmPassword" placeholder="确认密码" type="password"/>
        </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import valid from "@/utils/user-valid"
import { updatePassword } from "@/api/user"
export default {
  data() {
    const passwordRules = {
      originPassword: [
        {
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value || value.length < 6 ) {
              callback(new Error('请输入原密码'))
            } else {
              callback()
            }
          }
        }
      ],
      password: [
        { required: true, trigger: 'change', validator: valid.validatePassword }
      ],
      confirmPassword: [
        { required: true, trigger: 'change', validator: (rule, value, callback) => {
            if (!value || value !== this.user.password ) {
              callback(new Error('确认密码与新密码不一致'))
            } else {
              callback()
            }
          } 
        }
      ]
    }
    return {
      user: {
        originPassword: "",
        password: "",
        confirmPassword: ""
      },
      rules: passwordRules
    }
  },
  
  methods: {
    submit() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          updatePassword(
            this.user
          ).then( res => {
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 3 * 1000
            })
          })
        }
      })
    }
  }
}
</script>
