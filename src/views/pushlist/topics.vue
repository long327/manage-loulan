<template>
  <div
    id="topic-list"
    v-loading="listLoading"
    element-loading-text="拼命加载中..."
  >
    <div class="filterContainer">
      <span style="margin-top: 10px"> 筛选： </span>

      <el-select
        class="select-myteams"
        v-model="listQuery.id"
        @change="chQueryMyteams"
        :clearable="true"
        placeholder="请选择团对或个人"
      >
        <el-option
          v-for="(item, idx) in myteams"
          :key="item.teamId"
          :label="item.teamName"
          :value="idx"
        >
        </el-option>
      </el-select>

      <el-date-picker
        style="width: 238px"
        class="picker"
        v-model="listQuery.timeRange"
        type="datetimerange"
        align="right"
        size="samll"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      >
      </el-date-picker>
      <el-input
        class="search-input"
        v-model="listQuery.title"
        style="width: 170px; margin: 0 1em"
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
      <el-col style="margin: 30px 0">
        <!-- <el-checkbox>全选</el-checkbox> -->
        共<span>{{ total }}</span
        >条
      </el-col>
    </el-row>
    <el-row>
      <el-col
        v-for="(item, index) in list"
        :key="index"
        class="topics-list"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card">
          <div class="article-wrap">
            <div class="article-header">
              <div class="left-wrap fl">
                <div class="title" @click="openList(item, index)">
                  <!-- <el-checkbox></el-checkbox> -->
                  <i class="list-open" v-if="item.isOpen"></i>
                  <i class="list-close" v-else></i>
                  <a class="title-topics" :title="item.title">{{ item.title }}</a>
                </div>
                <div class="tiems">
                  {{ formatDate(item.createdTime) }}
                </div>
              </div>
              <div class="right-wrap fl">
                <div class="user-wrap fl">
                  <div class="user-inner-wrap">
                    <div
                      v-for="pushLists in item.pushContents"
                      :key="pushLists.id"
                      class="fl"
                    >
                      <div v-for="user in filteredOauthUsers" :key="user.id">
                        <div v-show="pushLists.socialAccountId == user.id">
                          <div class="left-wrap fl">
                            <div class="top-wrap">
                              <el-avatar :size="40" :src="user.avatar">
                              </el-avatar>
                              <svg-icon
                                :icon-class="user.oauthType.toLowerCase()"
                                :class="'badge ' + user.oauthType.toLowerCase()"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="btn-wrap fr">
                  <el-button
                    v-if="item.isOpen"
                    @click="moreHandleFn(index)"
                    type="text"
                    class="openList"
                    size="mini"
                    icon="el-icon-arrow-down"
                    >更多操作</el-button
                  >

                  <div v-if="item.moreHandle" class="moreHandleBox">
                    <el-button class="delTopic" type="text" @click="delTopics(item)">删除</el-button>
                  </div>
                  <!-- <el-button
                    v-else
                    @click="closeList(item, index)"
                    type="text"
                    class="closeList"
                    size="mini"
                    icon="el-icon-arrow-down"
                    >更多操作</el-button
                  > -->
                </div>
                <div class="clear"></div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="article-box" v-show="!item.isOpen">
              <div v-for="pushLists in item.pushContents" :key="pushLists.id">
                <div v-for="user in filteredOauthUsers" :key="user.id">
                  <div v-show="pushLists.socialAccountId == user.id" class="">
                    <el-scrollbar style="height: 100%">
                      <el-card class="box-card" style="margin: 10px 20px 10px 0">
                        <div class="left-wrap fl">
                          <div class="top-wrap">
                            <el-avatar :size="40" :src="user.avatar">
                            </el-avatar>
                            <svg-icon
                              :icon-class="user.oauthType.toLowerCase()"
                              :class="'badge ' + user.oauthType.toLowerCase()"
                            />

                            <span
                              class="page_name"
                              v-bind:class="user.oauthType"
                              >{{ user.nick }}</span
                            >
                            <span
                              v-if="pushLists.pushStatus == -1"
                              :class="'pushState' + pushLists.pushStatus"
                            >
                              发布失败
                            </span>
                            <span
                              v-else-if="pushLists.pushStatus == 0"
                              :class="'pushState' + pushLists.pushStatus"
                            >
                              推送中...
                            </span>
                            <span
                              v-else-if="pushLists.pushStatus == 1"
                              :class="'pushState' + pushLists.pushStatus"
                            >
                              已发布
                            </span>
                            <span
                              v-else-if="pushLists.pushStatus == 2"
                              :class="'pushState' + pushLists.pushStatus"
                            >
                              待发布
                            </span>
                            <span v-else class="pushState-1">
                              取消发布
                            </span>
                          </div>
                          <div class="bottom-wrap">
                            <div style="margin: 10px 0px">
                              <p>{{ pushLists.content }}</p>
                            </div>

                            <div
                              class="imgs-wrap"
                              v-if="pushLists.contentType == 'image'"
                            >
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
                            <div
                              class="imgs-wrap"
                              v-if="pushLists.contentType == 'video'"
                            >
                              <div v-show="pushLists.contentType == 'isPlay'">
                                <el-image
                                  :src="
                                    pushLists.resourcesUrl[0] +
                                    '?x-oss-process=video/snapshot,t_3000,f_jpg,w_240,m_fast'
                                  "
                                  alt=""
                                  @error="error(scope.$index, scope.row)"
                                >
                                  <span slot="placeholder">
                                    <i class="el-icon-picture-outline"></i>
                                  </span>
                                </el-image>
                                <i
                                  class="el-icon-video-play"
                                  v-if="list"
                                  @click="play(scope.$index, scope.row)"
                                ></i>
                              </div>
                              <div>
                                <video
                                  width="200"
                                  height="120"
                                  :poster="
                                    pushLists.resourcesUrl[0] +
                                    '?x-oss-process=video/snapshot,t_3000,f_jpg,w_200,h_120,m_fast'
                                  "
                                  :src="pushLists.resourcesUrl[0]"
                                  preload="auto"
                                  controls
                                />
                              </div>
                            </div>

                            <div
                              v-if="
                                pushLists.resourceInfos != null &&
                                pushLists.resourceInfos.length > 0 &&
                                pushLists.hasOwnProperty('resourceInfos')
                              "
                            >
                              <div
                                class="imgs-wrap"
                                v-if="
                                  pushLists.resourceInfos[0].resourceType ==
                                    'AUDIO' || pushLists.contentType == 'audio'
                                "
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
                          <div
                            class="right-wrap"
                            v-if="pushLists.socialPlatform != 'PODCAST'"
                          >
                            <div 
                              class="data-wrap-show">
                              <div class="data-wrap-show-title">贴文统计</div>
                              <!-- <li>
                                  <span>展示</span>
                                  <span class="zs-progress"></span>
                                </li> -->
                              <ul 
                                v-if="pushLists.socialPlatform.toLowerCase() == 'facebook'">
                                <li>
                                  <span class="txt">心情</span>
                                  <span
                                    class="dz-progress"
                                    :style="{
                                      width: pushLists.favouriteCount + 'px',
                                    }"
                                  ></span>
                                  <span class="num">
                                    {{ pushLists.favouriteCount }}
                                  </span>
                                </li>

                                <li>
                                  <span class="txt">分享</span>
                                  <span
                                    class="zf-progress"
                                    :style="{
                                      width: pushLists.shareCount + 'px',
                                    }"
                                  ></span>
                                  <span class="num">
                                    {{ pushLists.shareCount }}
                                  </span>
                                </li>

                                <li>
                                  <span class="txt">评论</span>
                                  <span
                                    class="hf-progress"
                                    :style="{
                                      width: pushLists.replayCount + 'px',
                                    }"
                                  ></span>
                                  <span class="num">
                                    {{ pushLists.replayCount }}
                                  </span>
                                </li>
                                <!-- v1.4 点击 -->
                                <li>
                                  <span class="txt">点击</span>
                                    <span
                                      class="dj-progress"
                                      :style="{
                                        width: pushLists.clicksCount + 'px',
                                      }"
                                    ></span>
                                    <span class="num">
                                      {{ pushLists.clicksCount }}
                                    </span>
                                </li>
                              </ul>
                              <ul
                                v-if="pushLists.socialPlatform.toLowerCase() == 'twitter'"
                              >
                                <li>
                                    <span class="txt">喜欢</span>
                                    <span
                                      class="dz-progress"
                                      :style="{
                                        width: pushLists.favouriteCount + 'px',
                                      }"
                                    ></span>
                                    <span class="num">
                                      {{ pushLists.favouriteCount }}
                                    </span>
                                  </li>

                                  <li>
                                    <span class="txt">转发</span>
                                    <span
                                      class="zf-progress"
                                      :style="{
                                        width: pushLists.shareCount + 'px',
                                      }"
                                    ></span>
                                    <span class="num">
                                      {{ pushLists.shareCount }}
                                    </span>
                                  </li>

                                  <li>
                                    <span class="txt">回复</span>
                                    <span
                                      class="hf-progress"
                                      :style="{
                                        width: pushLists.replayCount + 'px',
                                      }"
                                    ></span>
                                    <span class="num">
                                      {{ pushLists.replayCount }}
                                    </span>
                                  </li>
                              </ul>
                            </div>

                          </div>
                          <!-- 发布操作 -->
                          <div v-if="pushLists.socialPlatform != 'PODCAST'">
                            <div
                              class="pushBtn"
                              v-if="pushLists.pushStatus == -1"
                              style="margin-top: 20px"
                            >
                              <el-button
                                size="mini"
                                class="post-views"
                                @click="previews(pushLists, index)"
                                round
                              >
                                预览
                              </el-button>

                              <el-button
                                size="mini"
                                @click="deleListItem(pushLists, index)"
                                round
                                >删除贴文</el-button
                              >

                              <template v-if="pushLists.resourceInfos">
                                <el-button
                                  v-if="pushLists.resourceInfos.length"
                                  size="mini"
                                  icon="el-icon-edit"
                                  round
                                  @click="pushListItem(pushLists, index)"
                                  >编辑</el-button
                                >
                              </template>

                              <!-- <el-button size="mini" type="primary" icon="el-icon-s-promotion" @click="pushListItem(pushLists, index)">再次发帖</el-button> -->
                            </div>
                            <div
                              class="pushBtn"
                              v-if="pushLists.pushStatus == 1"
                              style="margin-top: 20px"
                            >
                              <el-button
                                size="mini"
                                class="post-views"
                                @click="previews(pushLists, index)"
                                round
                              >
                                预览
                              </el-button>
                              <el-button
                                size="mini"
                                @click="deleListItem(pushLists, index)"
                                round
                                >删除贴文</el-button
                              >
                            </div>
                          </div>
                          <div v-else>
                            <div
                              class="pushBtn pushBtn-podcast"
                              style="
                                position: absolute;
                                bottom: 26px;
                                right: 30px;
                              "
                            >
                              <el-button
                                size="mini"
                                class="post-views"
                                @click="previews(pushLists, index)"
                                round
                              >
                                预览
                              </el-button>
                              <el-button
                                size="mini"
                                style="width: 80px"
                                type="primary"
                                @click="deleListItem(pushLists, index)"
                                round
                                >删除</el-button
                              >
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

    <el-dialog :visible.sync="dialogPreviewsVisible" @close="dialogClose">
      <div v-loading="previewsLoading">
        <div class="platform-type">
          <span
            class="pc el-icon-monitor"
            :class="{ isPhone: ispcTophone == 'isPC' }"
            @click="pcTophone('isPC')"
          ></span>
          <span>|</span>
          <span
            class="mobile el-icon-mobile-phone"
            :class="{ isPhone: ispcTophone == 'isPhone' }"
            @click="pcTophone('isPhone')"
          ></span>
        </div>
        <div class="push-container left-container">
          <div class="right-container">
            <el-row
              v-for="(user, index) in finalCheckedUsers"
              :key="user.id"
              type="flex"
              justify="center"
              style="margin: 25px 0px"
            >
              <!-- pc -->
              <el-col
                :span="16"
                v-show="ispcTophone == 'isPC'"
                class="cards pc-wrap"
                style="margintop: 20px"
              >
                <preview-pc
                  :pushObj="pushObj"
                  :CfinalCheckedUsers="finalCheckedUsers"
                  :editItem="editItem"
                  :isEdit="isEdit"
                  :video="video"
                  :audio="audio"
                  :index="index"
                  :showupload="showupload"
                  :user="user"
                  :CfileListGifImgs="fileListGifImgs"
                  :CfileListImgs="fileListImgs"
                  :showuploadVideo="showuploadVideo"
                  :videoResources="videoResources"
                  :showuploadImg="showuploadImg"
                  :pushActive="pushActive"
                  :saveActive="saveActive"
                  :cancelActive="cancelActive"
                  :editActive="editActive"
                  :active="active"
                  :storageArr="storageArr"
                  :publishing="publishing"
                  :isPreviews="isPreviews"
                >
                </preview-pc>
              </el-col>
              <!-- mobile -->
              <el-col :span="16" v-show="ispcTophone == 'isPhone'">
                <preview-mobile
                  :pushObj="pushObj"
                  :finalCheckedUsers="finalCheckedUsers"
                  :editItem="editItem"
                  :isEdit="isEdit"
                  :video="video"
                  :audio="audio"
                  :index="index"
                  :showupload="showupload"
                  :user="user"
                  :CfileListGifImgs="fileListGifImgs"
                  :CfileListImgs="fileListImgs"
                  :showuploadVideo="showuploadVideo"
                  :showuploadImg="showuploadImg"
                  :videoResources="videoResources"
                  :isPreviews="isPreviews"
                >
                </preview-mobile>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-dialog>

    <pagination
      style="padding: 10px"
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
          <el-input
            class="slot-input-currentPage"
            v-model.number="currentPage"
          ></el-input>
          <span>页</span>
        </div>
      </template>
      <template v-slot:jumpPage>
        <div class="jumpPage-wrap">
          <el-button class="jumpPage" @click="jumpPage"> 跳转 </el-button>
        </div>
      </template>
    </pagination>
  </div>
</template>   

<script>
import { mapGetters } from "vuex";
import Previews from "@/mixins/Previews";
import Vviewer from "@/mixins/Vviewer";
import moment from "moment";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  queryPushContent,
  pushTopic,
  queryTopicPageViews,
  querypushcontentsocialcount,
  queryPushTopic,
  deletePushContent,
  deletePushTopic,
  pushContent,
  queryPushContents,
} from "@/api/pusher";
import { queryMyteams } from "@/api/team";
import previewPc from "../push/components/previewPc";
import previewMobile from "../push/components/previewMobile";

export default {
  name: "topics",
  mixins: [Previews, Vviewer],
  components: { Pagination, previewPc, previewMobile },
  data() {
    return {
      currentPage: "",
      tableKey: 0,
      listLoading: false,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 5,
        type: "",
        title: "",
        timeRange: [],
        pushStatus: "",
        teamId: "",
      },
      html: "",
      pushStatus: false,
      openActive: "",
      disabled: false,
      myteams: []
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
    },
  },
  computed: {
    ...mapGetters(["oauthUsers", "nick", "id"]),
    filteredOauthUsers() {
      if (this.listQuery.type) {
        return this.oauthUsers.filter(
          (u) => u.oauthType === this.listQuery.type.toUpperCase()
        );
      } else {
        return this.oauthUsers;
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    queryMyteams()
      .then((res) => {

        res.data.forEach(v => {
          v.teamId = v.id;
        })
        this.myteams = res.data;
        //个人
        this.myteams.push({teamName: this.nick, id: this.id, teamId: 'false'})
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    moreHandleFn(idx) {
      this.list[idx].moreHandle = !this.list[idx].moreHandle;
    },
    delTopics(item) {

      let deleObj = {
        id: null,
      };
      deleObj.id = item.id;
      this.$confirm("是否确定删除该主题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePushTopic(deleObj)
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "消息",
                  message: "删除成功!",
                  type: "success",
                  duration: 1000,
                });
                this.getList();
              }
              if (res.data.code == 500) {
                this.$notify({
                  title: "消息",
                  message: "删除失败!",
                  type: "error",
                  duration: 1000,
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    chQueryMyteams(idx) {
      if (typeof idx == 'number') {
        if (this.myteams[idx].teamId == 'false') {
          this.listQuery.teamId = 'false';
        }
        else {
          this.listQuery.teamId = this.myteams[idx].teamId;
        }
      }
      this.listQuery.page = 1;
      this.getList();
    },
    refresh() {
      this.disabled = true;
      this.getList();
    },
    handleFilter(type) {
      this.listQuery.page = 1;
      this.getList();
    },
    query() {
      this.getList("query");
    },
    //主题排行
    getList(type) {
      let relayArr = [];
      this.listLoading = true;
      queryPushTopic(this.listQuery)
        .then((response) => {
          response.data.list.forEach((item) => {
            item.isOpen = true;
            item.moreHandle = false;
            // item.pushContents.forEach(content => {
            //   querypushcontentsocialcount({id:content.id}).then(res => {
            //     content.favouriteCount = res.data.favouriteCount
            //     content.replayCount = res.data.replayCount
            //     content.shareCount = res.data.shareCount
            //   }).catch(err => {
            //     console.log(err)
            //   })
            // });
          });

          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;

          // Just to simulate the time of the request
          // setTimeout(() => {
          //   this.listLoading = false
          // }, 1.5 * 1000)
        })
        .then(() => {
          if (type == "query") {
            console.log(this.list);
            this.list.forEach((val, idx) => {
              queryTopicPageViews({ id: val.id })
                .then((res) => {
                  this.list[idx].pageviews = res.data.pageviews;
                })
                .catch((e) => {
                  console.log(e);
                });
            });
          }
        });
      this.disabled = false;
    },
    formatDate(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    deleListItem(item, idx) {
      let deleObj = {
        id: null,
      };
      deleObj.id = item.id;
      this.$confirm("将同步删除社交平台贴文，是否确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePushContent(deleObj)
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "消息",
                  message: "删除成功!",
                  type: "success",
                  duration: 1000,
                });
                this.getList();
              }
              if (res.data.code == 500) {
                this.$notify({
                  title: "消息",
                  message: "删除失败!",
                  type: "error",
                  duration: 1000,
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch(() => {});
    },
    pushListItem(item, idx) {
      let pushObj = {
        checkedUsers: [],
        resourcesUrl: [],
        content: "",
        linkUrl: "",
        contentType: "",
        pushType: "now",
        scheduleTime: "",
        topicId: "",
        topicTitle: "",
        id: "",
      };

      pushObj.checkedUsers.push({ id: item.socialAccountId });
      pushObj.resourcesUrl = item.resourcesUrl;
      pushObj.content = item.content;
      pushObj.linkUrl = item.linkUrl;
      pushObj.contentType = item.contentType;
      pushObj.pushType = item.pushType;
      pushObj.scheduleTime = item.scheduleTime;
      pushObj.topicId = item.topicId;
      pushObj.id = item.id;
      pushObj.topicTitle = item.topicTitle;

      pushContent(pushObj)
        .then((res) => {
          console.log(res);
          if (res.data[0].code == 200) {
            this.$notify({
              title: "消息",
              message: "发布成功!",
              type: "success",
              duration: 1000,
            });
            this.getList();
          } else {
            this.$notify({
              title: "消息",
              message: "发布失败!",
              type: "error",
              duration: 1000,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    //展开收起
    openList(item, idx) {
      this.list[idx].isOpen = !this.list[idx].isOpen;
    },
    closeList(item, idx) {
      this.list[idx].isOpen = !this.list[idx].isOpen;
    },
    serarch() {
      this.listQuery.page = 1;
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
  },
};
</script>
<style lang="scss" scoped>
@import "./topics.scss";

$fontColor606266: #606266;
$fontWeight500: 500;
.pagination-container ::v-deep {
  .input-wrap-currentPage {
    & {
      display: inline-block;
      font-size: 14px;
      color: $fontColor606266;
      font-weight: $fontWeight500;
      margin-left: 16px;
      text-align: center;
    }
    span:last-child {
      text-align: left;
      margin-left: 5px;
      min-width: 18px;
    }
    .slot-input-currentPage {
      width: 60px;
      height: 28px;
    }
    input {
      height: 28px;
      line-height: 28px;
    }
  }
  .jumpPage-wrap {
    & {
      display: inline;
    }
    .jumpPage {
      & {
        font-weight: $fontWeight500;
        color: $fontColor606266;
      }
    }
  }
}

#topic-list .article-wrap ::v-deep {
  .article-header .title {
    max-width: 800px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

#topic-list ::v-deep{
  .select-myteams {
    margin-right: 15px;
    input {
      height: 40px;
    }
  }
}

.el-input--medium .el-input__inner {
  height: 40px;
  line-height: 40px;
}

.el-dialog__wrapper ::v-deep .el-dialog .el-dialog__header {
  padding: 20px 20px;
}
.platform-type {
  text-align: center;
  .isPhone {
    color: #7e7ef4;
  }

  .pc,
  .mobile {
    display: inline-block;
    font-weight: 400;
    padding: 5px;
    cursor: pointer;
    font-size: 22px;
  }
}
#topic-list .article-wrap ::v-deep .article-header .title{
  .title{
    position: relative;
    z-index: 1;
  }
}

#topic-list ::v-deep {
  .topics-list>.box-card>.el-card__body {
    padding: 20px 20px 20px 40px;
  }
  .pc-wrap .content-wrap{
    width: 418px;
    margin: 0 auto;
  }
}

.list-open{
  background: url(../../assets/images/list-open.png) no-repeat center;
  background-size: 100%;
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  position: absolute;
  left: 18px;
  z-index: 100;
}
.list-close{
  background: url(../../assets/images/list-close.png) no-repeat center;
  background-size: 100%;
  width: 18px;
  height: 18px;
  left: 18px;
  display: inline-block;
  vertical-align: middle;
  position: absolute;
  left: 18px;
  z-index: 100;
}

.btn-wrap {
  position: relative;
}
.moreHandleBox{
  position: absolute;
  left: 25px;
  .delTopic {
    color: red;
  }
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