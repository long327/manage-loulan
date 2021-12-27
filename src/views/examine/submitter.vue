<template>
  <div class="app-container">
    <div id="topic-list" v-loading="listLoading" element-loading-text="拼命加载中...">
      <div class="leeshenhe">贴文审核</div>
      <div class="filterContainer">
        <span style="margin-top:10px;">筛选：</span>
        <el-select 
          @change="selectStatus" 
          v-model="listQuery.editorId" 
          :clearable="true"
          placeholder="全部成员"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          class="select-myteams"
          v-model="listQuery.teamId"
          :clearable="true"
          placeholder="全部团队"
        >
          <el-option
            v-for="item in myteams"
            :key="item.id"
            :label="item.teamName"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <el-input
          class="search-input"
          v-model="listQuery.title"
          style="width:170px;margin:0 1em"
          size="large"
          placeholder="请输入主题关键词"
          @keyup.enter.native="handleFilter"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="serarch">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" class="fr" type="primary" @click="refresh">刷新</el-button> -->
      </div>

      <el-row>
        <el-col style="margin:25px 0;"></el-col>
      </el-row>
      <el-row>
        <el-col v-for="(item, index) in list" :key="index" style="margin-bottom:10px;">
          <el-card class="box-card">
            <div class="article-wrap">
              <div class="article-header">
                <div class="left-wrap fl">
                  <div class="title" @click="openList(item, index)">
                    <!-- <el-checkbox></el-checkbox> -->
                    <i class="list-open" v-if="item.isOpen"></i>
                    <i class="list-close" v-else></i>
                    <a class="title-topics" :title="item.title">{{item.title}}</a>
                  </div>
                  <div class="tiems">
                    {{formatDate(item.createdTime)}}
                  </div>
                </div>
                <div class="right-wrap fr">
                  <div class="user-wrap fl">
                    <div class="user-inner-wrap">
                      <div v-for="pushLists in item.pushContents" :key="pushLists.id" class="fl">
                        <div v-for="user in filteredOauthUsers" :key="user.id">
                          <div v-show="pushLists.socialAccountId == user.id">
                            <div class="left-wrap fl">
                              <div class="top-wrap">
                                <el-avatar :size="40" :src="user.avatar"></el-avatar>
                                <svg-icon
                                  :icon-class="user.oauthType.toLowerCase()"
                                  :class="'badge '+user.oauthType.toLowerCase()"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="btn-wrap fr">
                    <el-button
                      v-if="item.isOpen"
                      @click="openList(item, index)"
                      type="text"
                      class="openList"
                      size="mini"
                      icon="el-icon-arrow-down"
                    >更多操作</el-button>
                    <el-button
                      v-else
                      @click="closeList(item, index)"
                      type="text"
                      class="closeList"
                      size="mini"
                      icon="el-icon-arrow-down"
                    >更多操作</el-button>
                  </div> -->
                  <div class="clear"></div>
                </div>
                <div class="clear"></div>
              </div>
              <div class="article-box" v-show="!item.isOpen">
                <div v-for="pushLists in item.pushContents" :key="pushLists.id">
                  <div v-for="user in filteredOauthUsers" :key="user.id">
                    <div v-show="pushLists.socialAccountId == user.id" class>
                      <el-scrollbar style="height:100%">
                        <el-card class="box-card" style="margin:10px 10px 0px 0px;">
                          <div class="left-wrap fl">
                            <div class="top-wrap">
                              <el-avatar :size="40" :src="user.avatar"></el-avatar>
                              <svg-icon
                                :icon-class="user.oauthType.toLowerCase()"
                                :class="'badge '+user.oauthType.toLowerCase()"
                              />
                              <span class="page_name" v-bind:class="user.oauthType">{{ user.nick }}</span>
                            </div>
                            <div class="bottom-wrap">
                              <div style="margin:10px 0px;">
                                <p>{{pushLists.content}}</p>
                              </div>

                              <div class="imgs-wrap" v-if="pushLists.contentType == 'image'">
                                <viewer :images="pushLists.resourcesUrl"
                                    class="viewer"
                                    @inited="inited"
                                    ref="viewer"
                                >
                                  <template scope="scope">
                                    <span
                                      v-for="(img, idx) in scope.images"
                                      :key="idx"
                                      style="margin-right: 10px"
                                    >
                                      <img
                                        :src="img"
                                        alt=""
                                        class="previews-imgs"
                                      />
                                    </span>
                                  </template>
                                </viewer>
                              </div>
                              <div class="imgs-wrap" v-if="pushLists.contentType == 'video'">
                                <video
                                  width="200"
                                  height="120"
                                  :src="pushLists.resourcesUrl[0]"
                                  preload="auto"
                                  controls
                                />
                              </div>

                              <!--audio-->
                              <div
                                v-if="pushLists.resourceInfos != null &&
                                 pushLists.resourceInfos.length > 0 &&
                                  pushLists.hasOwnProperty('resourceInfos')"
                              >
                                <div
                                  class="imgs-wrap"
                                  v-if="pushLists.resourceInfos[0].resourceType == 'AUDIO' || pushLists.contentType == 'audio'"
                                >
                                  <audio
                                    width="200"
                                    height="auto"
                                    :src="pushLists.resourceInfos[0].url"
                                    preload="auto"
                                    controls
                                  ></audio>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- 数据互动 -->
                          <div class="fr">
                            <div class="leehandel">
                              <div class="leehandel_header" style="height:180px">
                                <!-- 改版v1.3 -->
                                <!-- <p>
                                  <i class="el-icon-s-promotion"></i>
                                  <span>审核通过后立即发布</span>
                                </p>
                                <div class="center">
                                  <span class="left">{{pushLists.socialAccount.charAt(0)}}</span>
                                  <span class="right">{{pushLists.socialAccount}}</span>
                                </div>
                                <p
                                  style="margin:10px 0 0 44px;"
                                >{{formatDate(pushLists.createdTime)}}</p> -->
                                <!-- 改版v1.4 -->
                                <span>{{pushLists.editorNickName}}</span>
                                <span style="display:inline-block;width:10px;"></span>
                                <span>{{formatDate(pushLists.createdTime)}}</span>
                                <span style="display:inline-block;width:10px;"></span>
                                <span>提审</span>
                              </div>
                              <div class="top">
                                <el-button
                                  size="mini"
                                  class="adopt"
                                  @click="tongguo(pushLists.id,pushLists.editorId,pushLists.editorNickName)"
                                  icon="el-icon-check"
                                  round
                                >通过</el-button>
                                <el-button
                                  size="mini"
                                  class="refuse"
                                  icon="el-icon-close"
                                  @click="jujie(pushLists.id,pushLists.editorId,pushLists.editorNickName, pushLists.topicId)"
                                  round
                                >拒绝</el-button>
                              </div>
                            </div>
                          </div>
                          <div class="clear"></div>
                        </el-card>
                      </el-scrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <pagination
        style="padding:10px"
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        :layout="'total, prev, pager, next, slot'"
        @pagination="getList"
      >
        <template v-slot:input>
          <div class="input-wrap-currentPage">
            <span>前往</span>
            <el-input class="slot-input-currentPage" v-model.number="currentPage"></el-input>
            <span>页</span>
          </div>
        </template>
        <template v-slot:jumpPage>
          <div class="jumpPage-wrap">
            <el-button class="jumpPage" @click="jumpPage">跳转</el-button>
          </div>
        </template>
      </pagination>
    </div>
    <el-dialog title="拒绝理由"
      width="560px;" 
      :visible.sync="dialogFormVisible"
      @close="dialogClose"
    >
      <div class="jujieCenter">
        <div class="jujieCenter_top">
          <span class="reviewer-tips">提审人：</span>
          <!-- <span class="span_2">{{leeUserInfoOne}}</span> -->
          <em class="reviewer-name">{{leeUserInfo}}</em>
        </div>
        <div>
          <el-input
            style="padding: 0px"
            v-model="leeContent"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10 }"
            maxlength="2000"
            show-word-limit
            class="radius radius-30 textarea-content"
            placeholder="请输入拒绝理由"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" class="dialogCancel" @click="dialogFormVisible = false">取 消</el-button>
        <div style="display:inline-block;width:100px;"></div>
        <el-button type="primary" class="dialogConfirm" @click="subumitModify">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>   

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  queryPendingPushContent,
  getMemberList,
  pushcheckPass,
  pushcheckNoPass
} from "@/api/examin";
import { queryMyteams } from "@/api/team";
import Vviewer from "@/mixins/Vviewer";

export default {
  name: "submitter",
  mixins: [Vviewer],
  components: { Pagination },
  data() {
    return {
      currentPage: "",
      tableKey: 0,
      listLoading: false,
      list: null,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 5,
        title: "",
        teamId: '',
        editorId: "" //用户id
      },
      html: "",
      pushStatus: false,
      openActive: "",
      disabled: false,
      //lee
      leeContent: "", //提交拒绝
      leeUserInfo: "",
      options: [],
      dialogFormVisible: false,
      tiewenID: "",
      tiewenUserId: "",
      //lee end
      myteams: [],
      topicId: ''
    };
  },
  filters: {
    oauthTypeFilter(otype) {
      switch (otype) {
        case "WEIBO":
          return "微博";
          break;
        case "WECHAT":
          return "微信";
          break;
        case "FACEBOOK":
          return "f";
          break;
        case "LINKEDIN":
          return "in";
          break;
        case "TWITTER":
          return "t";
          break;
        default:
          break;
      }
      //return statusMap[status];
    }
  },
  mounted() {
    //已读状态
    // document.querySelector('.submitterRemind .svg-icon').style.display = 'none';
  },
  computed: {
    ...mapGetters(["oauthUsers", "id"]),
    filteredOauthUsers() {
      if (this.listQuery.type) {
        return this.oauthUsers.filter(
          u => u.oauthType === this.listQuery.type.toUpperCase()
        );
      } else {
        return this.oauthUsers;
      }
    },
    leeUserInfoOne: function() {
      return this.leeUserInfo.charAt(0);
    }
  },
  methods: {
    //close dialog
    dialogClose() {
      this.dialogFormVisible = false;
      this.leeContent = '';
      this.leeUserInfo = '';
    },
    refresh() {
      this.disabled = true;
      this.getList();
    },
    handleFilter(type) {
      this.listQuery.page = 1;
      this.getList();
    },
    //查询我的审核列表
    getList(type) {
      let relayArr = [];
      this.listLoading = true;
      var _this = this;
      queryPendingPushContent(this.listQuery).then(response => {
        response.data.list.forEach(item => {
          item.isOpen = true;
        });
        _this.list = response.data.list;
        _this.total = response.data.total;
        _this.listLoading = false;
      });
    },
    formatDate(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    //展开收起
    openList(item, idx) {
      this.list[idx].isOpen = !this.list[idx].isOpen;
    },
    closeList(item, idx) {
      this.list[idx].isOpen = !this.list[idx].isOpen;
    },
    //list 用户
    selectStatus(val) {
      const newDate = Object.assign({}, this.listQuery, {
        editorId: val
      });
      this.listQuery = Object.assign({}, this.listQuery, newDate);
    },
    //list搜索
    serarch() {
      const newDate = Object.assign({}, this.listQuery, {
        page: 1
      });
      this.listQuery = Object.assign({}, this.listQuery, newDate);
      this.getList();
    },
    jumpPage() {
      if (this.currentPage != "" && typeof this.currentPage == "number") {
        this.listQuery.page = this.currentPage;
        this.getList();
        scrollTo(0, 800);
        this.currentPage = "";
      }
    },
    //选择团队
    getItems() {
      let _this = this;
      let userId = this.$store.getters.id;
      getMemberList({
        memberRole: {
          name: null
        }
      })
        .then(function(response) {
          const newData = response.data;
          newData.forEach(item => {
            _this.options.push({
              value: item.userId,
              label: item.nickname
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //lee
    jujie(id, userId, name, topicId) {
      this.dialogFormVisible = true;
      this.tiewenID = id;
      this.tiewenUserId = userId;
      this.leeUserInfo = name;
      this.topicId = topicId;
    },
    //tongguo
    tongguo(id, userId, name) {
      let _this = this;
      pushcheckPass({
        pushContentId: id,
        letter: {
          type:1,
          receiveId: userId,
          receiveName: name
        }
      })
        .then(function(response) {
          _this.getList();
          _this.$message.success("通过审核成功");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //拒绝理由提交
    subumitModify() {
      if (this.leeContent == "") {
        this.$message.error("请填写拒绝理由");
        return false;
      }
      const newData = {
        pushContentId: this.tiewenID,
        rejectedContent: this.leeContent,
        topicId: this.topicId,
        letter: {
          type:1,
          receiveId: this.tiewenUserId,
          receiveName: this.leeUserInfo,
        }
      };
      let _this = this;
      pushcheckNoPass(newData)
        .then(function(response) {
          _this.getList();
          //关闭
          _this.dialogFormVisible = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    formatDate(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  created() {
    this.getItems();
    this.getList();

    //全部团队
    queryMyteams()
      .then((res) => {
        this.myteams = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
</script>
<style lang="scss" scoped>
@import "./reviewer.scss";
.leehandel ::v-deep {
  .leehandel_header{
    color:#47289b;
    font-size: 14px;
    text-align: right;
    background-color: unset;
    padding: 0;
  }
  .top {
    right: 16px;
  }
}
.adopt{
  margin-right: 30px;
}
.adopt,.refuse{
  width: 100px;
}

</style>

<style lang="scss">

.viewer-container{
  .viewer-button.viewer-close::before {
      bottom: 10px!important;
      left: 10px!important;
      position: absolute;
  }
  .viewer-button.viewer-close {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    cursor: pointer;
    height: 40px!important;
    width: 40px!important;
    overflow: hidden;
    position: absolute;
    right: 20%!important;
    top: 10%!important;
    -webkit-transition: background-color 0.15s;
    transition: background-color 0.15s;
    -moz-transition: background-color 0.15s;
    -ms-transition: background-color 0.15s;
    -o-transition: background-color 0.15s;
  }
}

</style>