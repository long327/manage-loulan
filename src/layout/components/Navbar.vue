<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="app-title">{{title}}</div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar" />
          <img v-else src="@/assets/404_images/default_avatar.jpeg" class="user-avatar" />
          <i class="el-icon-caret-bottom" style="color:white" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <router-link to="/profile/index">
            <el-dropdown-item divided>个人中心</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--消息-->
    <div class="leeTopNews">
      <el-dropdown class="avatar-container" trigger="click">
        <div>
          <span class="span" v-if="newsTotal>0">{{newsTotal}}</span>
          <img src="@/assets/images-lee/news.png" class="leeTopNews-img" />
          <el-dropdown-menu slot="dropdown">
            <div class="lee_tant_news">
              <div class="leeNewsheader">
                <span class="leeNewsheader_left">
                  我的消息
                  <em v-if="newNum>0">({{newNum}})</em>
                </span>
                <span class="leeNewsheader_right">
                  <el-dropdown-item>
                    <i class="el-dialog__close el-icon el-icon-close"></i>
                  </el-dropdown-item>
                </span>
              </div>
              <div class="leeNewsTanTop">
                <span @click="leeNewsHandle" v-if="newsData.length">全部标记为已读</span>
              </div>
              <ul class="leeNewsTanCenter" v-if="newsData.length">
                <li v-for="item in newsData.slice(0,4)" :key="item.id">
                  <h4>
                    <p>{{item.content}}</p>
                  </h4>
                  <div>
                    <p>{{item.createTime}}</p>
                  </div>
                </li>
              </ul>
              <div class="leeNewsTanCenterNo" v-else>暂无数据</div>
              <div class="leeNewsTanBom">
                <router-link to="/message/center">
                  <el-dropdown-item divided>查看全部消息</el-dropdown-item>
                </router-link>
              </div>
            </div>
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>
    <!--消息 end-->
    <div class="leeItem" v-if="leeTeamAble">
      <div class="leeItemTop">
        <span>团队邀请</span>
        <!-- <em  @click="leeTeamCanle">x</em> -->
      </div>
      <div class="itemNotice">{{leeTeamSendName}} 邀请您加入 TA的团队 {{leeGroupName}}</div>
      <div class="dialog-footer">
        <span class="left" @click="addItem">加入团队</span>
        <span class="right" @click="leeTeamCanle">拒绝加入</span>
      </div>
    </div>

    <div class="leeItem" v-if="leeTeamgo">
      <div class="leeItemTop2">团队邀请</div>
      <div class="itemNotice">
        加入团队
        <span>{{leeGroupName}}</span> 成功,是否切换账户到该团队
      </div>
      <div class="dialog-footer">
        <span class="left" @click="sure">确定</span>
        <span class="right" @click="cancle">取消</span>
      </div>
    </div>
    <div class="leeTopAccout">
      <img @click="gotoAccout" src="@/assets/images-lee/item.png" class="leeTopNews-img" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import defaultSettings from "@/settings";
import { mapGetters } from "vuex";
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from "@/components/Hamburger";
import {
  getListNotice,
  readNotice,
  inviteNotice,
  isAccept
} from "@/api/notice";
export default {
  data() {
    return {
      title: defaultSettings.title,
      leeTeamAble: false,
      userId: 0, //用户id
      leeGroupId: 0, //组id
      messageId: 0,
      leeTeamSendName: "", //邀请人名字
      leeGroupName: "", //组名字
      leeTeamgo: false,
      newsData: [],
      newsTotal: 0,
      newNum: 0
    };
  },
  components: {
    // Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "id"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login`);
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    leeNewsHandle() {
      const newArry = [];
      this.newsData.forEach(element => {
        if (element.read == 0) {
          newArry.push(element.id);
        }
      });
      let _this = this;
      console.log(newArry);
      readNotice({ letterIds: newArry })
        .then(function(response) {
          _this.newsData = [];
          _this.newNum = 0;
          _this.newsTotal = 0;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //设置
    gotoAccout() {
      this.$router.push(`/account`);
    },
    addItem() {
      let team = {
        id: this.leeGroupId
      };
      var _this = this;
      isAccept({
        userId: this.userId,
        messageId: this.messageId,
        team,
        invitationStatus: "IN"
      })
        .then(function(res) {
          _this.leeTeamAble = false;
          _this.leeTeamgo = true;
          _this.$message.success("操作成功");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    leeTeamCanle() {
      let team = {
        id: this.leeGroupId
      };
      var _this = this;
      isAccept({
        userId: this.userId,
        messageId: this.messageId,
        team,
        invitationStatus: "OUT"
      })
        .then(function(res) {
          _this.leeTeamAble = false;
          _this.$message.success("操作成功");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    sure() {
      this.$router.push(`/account`);
      this.leeTeamgo = false;
    },
    cancle() {
      this.leeTeamgo = false;
    }
  },
  created() {
    this.userId = this.$store.getters.id;
    let _this = this;
    getListNotice({ read: false, size: 100, sort: "-createTime" })
      .then(res => {
        _this.newNum = res.data.response.list.length;
        _this.newsData = res.data.response.list;
        _this.newsTotal = res.data.response.total;
      })
      .catch(err => {
        console.log(err);
      });
    inviteNotice()
      .then(res => {
        if (res.data.response.length) {
          _this.leeTeamAble = true;
          _this.leeTeamSendName = res.data.response[0].sendName;
          _this.leeGroupName = res.data.response[0].groupName;
          _this.leeGroupId = res.data.response[0].groupId;
          _this.messageId = res.data.response[0].id;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: $primary;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding-left: 20px;
  .app-title {
    font-size: 22px;
    float: left;
    color: #fff;
    line-height: 60px;
  }
  .hamburger-container {
    line-height: 56px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  // .breadcrumb-container {
  //   float: left;
  // }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 10px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .leeTopAccout {
    float: right;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 20px;
    width: 20px;
    height: 50px;
    .leeTopNews-img {
      width: 20px;
      height: auto;
    }
  }
  .leeTopNews {
    float: right;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 50px;
    position: relative;
    width: 20px;
    height: 50px;
    .span {
      position: absolute;
      top: -12px;
      right: -14px;
      background: red;
      color: #fff;
      height: 14px;
      border-radius: 7px;
      line-height: 14px;
      font-size: 12px;
      padding: 0 4px;
      text-align: center;
    }
    .leeTopNews-img {
      width: 20px;
      height: auto;
    }
  }
}
.leeItem {
  position: fixed;
  top: 80px;
  right: 30px;
  z-index: 2022;
  background: #fff;
  width: 380px;
  padding: 20px;
  border-radius: 10px;
  .leeItemTop {
    color: #7e7ef4;
    line-height: 20px;
    font-size: 16px;
    overflow: hidden;
    span {
      float: left;
    }
    em {
      float: right;
      font-size: 24px;
      color: #7e7ef4;
      line-height: 20px;
      font-style: normal;
      padding: 0;
      cursor: pointer;
    }
  }
  .leeItemTop2 {
    color: #7e7ef4;
    line-height: 20px;
    font-size: 16px;
    overflow: hidden;
    text-align: center;
  }
  .itemNotice {
    padding: 40px 0;
    font-size: 16px;
    color: #303133;
    line-height: 1.625;
    text-align: center;
    width: 320px;
    margin: 0 auto;
    span {
      color: blue;
    }
  }
  .dialog-footer {
    overflow: hidden;
    width: 320px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left {
      width: 130px;
      height: 50px;
      line-height: 50px;
      background: #7e7ef4;
      color: #fff;
      text-align: center;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
    }
    .right {
      width: 128px;
      height: 48px;
      line-height: 50px;
      background: #7e7ef4;
      color: #fff;
      text-align: center;
      border: 1px solid #7e7ef4;
      color: #7e7ef4;
      background: #fff;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
    }
  }
}
</style>
<style lang="scss">
.lee_tant_news {
  padding: 0 20px;
  width: 380px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 9px 24.03px 2.97px rgba(126, 126, 244, 0.3);

  .leeNewsheader {
    border-bottom: 1px solid #dcdfe6;
    color: #7e7ef4;
    line-height: 20px;
    padding: 10px 0;
    font-size: 16px;
    overflow: hidden;
    .leeNewsheader_left {
      float: left;
      em {
        font-style: normal;
        color: #f66767;
        margin-left: 4px;
      }
    }
    .leeNewsheader_right {
      float: right;

      .el-dropdown-menu__item {
        font-size: 24px;
        color: #7e7ef4;
        line-height: 20px;
        padding: 0;
      }
    }
  }
  .leeNewsTanTop {
    margin-top: 10px;
    height: 30px;
    line-height: 30px;
    span {
      color: #7e7ef4;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .leeNewsTanCenterNo {
    text-align: center;
    color: #333;
    font-size: 14px;
  }
  .leeNewsTanCenter {
    padding: 0;
    border-bottom: 1px solid #dcdfe6;

    li {
      list-style: none;
      h4 {
        margin-bottom: 0;
        color: #666;
        font-size: 14px;
        line-height: 18px!important;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
          font-size: 14px;
          color: #333;
          font-weight:bold;
          margin: 0;
          padding: 0;
        }
      }
      div {
        color: #c0c4cc;
        font-size: 14px;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
          font-size: 12px;
          color: #c0c4cc;
        }
      }
    }
  }
  .leeNewsTanBom {
    text-align: center;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    line-height: 40px;
    padding-top: 6px;
     padding-bottom: 6px;
    span {
      color: #8787f5;
      cursor: pointer;
    }
    li{
      padding: 0!important;
      margin-top: 0!important;
    border-top: 0!important;
    color: #7e7ef4!important;
    }
  }
    
}

</style>
