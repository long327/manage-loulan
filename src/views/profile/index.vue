<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <h1>个人中心</h1>
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
         
            <el-tabs v-model="activeTab">
              <!-- <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane> -->
              <el-tab-pane label="帐号信息" name="account">
                 <el-card>
                    <account 
                     :user="myInfo"
                      @dialogopen="isOpenDialog"
                    >
                    </account>
                 </el-card>
              </el-tab-pane>
              <!-- <el-tab-pane label="修改密码" name="password">
                <password />
              </el-tab-pane> -->
            </el-tabs>
        </el-col>
      </el-row>

      <el-dialog
      title="密码修改"
      :visible.sync="dialogVisible"
      >
        <password />
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import Password from './components/Password'
import DefaultAvatar from "@/assets/404_images/default_avatar.jpeg"
import { getMyInfo } from "@/api/user"

export default {
  name: 'Profile',
  components: { UserCard, Account, Password },
  data() {
    return {
      user: {},
      activeTab: 'account',
      myInfo: {},
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'nick',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
    this.getUserInfo()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        cnick: this.nick,
        role: this.roles.join(' | '),
        email: this.email,
        avatar: this.avatar || DefaultAvatar,
        weChat: this.weChat,
        IMP: this.IMP,
        password: this.password
      }
    },
    getUserInfo() {
      getMyInfo().then(res=> {
        this.myInfo = res.data;
        var bindUsers = this.myInfo.bindUsers;
        if(bindUsers && bindUsers.WECHAT_OPEN){
          this.myInfo.weChat = bindUsers.WECHAT_OPEN;
        }
        if(bindUsers && bindUsers.IMP){
          this.myInfo.IMP = bindUsers.IMP;
        }
      })
    },
    isOpenDialog(msg) {
      this.dialogVisible = msg;
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-card.is-always-shadow, 
  .el-card.is-hover-shadow:focus, 
  .el-card.is-hover-shadow:hover{
    box-shadow: unset;
  }
  .el-card{
    border:unset;
  }
  .app-container {
    h1 {
      font-size: 20px;
      color: #47289b;
      font-weight: unset;
    }
    .el-tabs__item.is-active{
      font-size: 20px;
      color: #47289b;
    }
    // #tab-account{
    //   font-size: 20px;
    //   color: #47289b;
    // }
  }
</style>
