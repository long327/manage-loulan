<template>
  <div>
    <el-main v-loading="listLoadingText" element-loading-text="拼命加载中...">
      <div class="filterContainer">
        <div class="filter-container fl">
          <span>筛选：</span>
          <div class="filter-btn" @click.stop="handleFilter('')">
            <span
              :class="filtersAll ? 'all-select-container' : 'all-container'"
            >
              <!-- <svg-icon icon-class="all" class="icon" /> -->
            </span>
          </div>
          <div class="filter-btn" @click.stop="handleFilter('facebook')">
            <span :class="filtersFB ? 'fb-select-container' : 'fb-container'">
              <!-- <svg-icon icon-class="facebook" class="icon" /> -->
            </span>
          </div>
          <div class="filter-btn" @click.stop="handleFilter('twitter')">
            <span :class="filtersTW ? 'tt-select-container' : 'tt-container'">
              <!-- <svg-icon icon-class="twitter" class="icon" /> -->
            </span>
          </div>

          <div
            class="filter-btn isYoutube-authorized"
            @click.stop="handleFilter('google')"
          >
            <span
              :class="
                filtersYTB ? 'youtube-select-container' : 'youtube-container'
              "
            >
              <!-- <svg-icon icon-class="twitter" class="icon" /> -->
            </span>
          </div>

          <div class="filter-btn" @click.stop="handleFilter('podcast')">
            <span
              :class="
                filtersPCT ? 'podcast-select-container' : 'podcast-container'
              "
            >
              <!-- <svg-icon icon-class="twitter" class="icon" /> -->
            </span>
          </div>
        </div>

        <div class="fr" style="margin-top: 15px">
          <el-select
            class="select-state"
            v-model="articleListQuery.socialAccountId"
            @change="socialUser(value)"
            :clearable="true"
            placeholder="全部社交账号"
          >
            <el-option
              v-for="item in socialAccount"
              :key="item.id"
              :label="
                item.id == 100
                  ? item.nick
                  : item.nick + ' - [' + item.oauthType + ']'
              "
              :value="item.id"
            >
            </el-option>
          </el-select>

          <el-select
            class="select-state"
            :clearable="true"
            @change="pushState"
            v-model="articleListQuery.pushStatus"
            placeholder="全部发布状态"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-select
            class="select-state"
            style="width:170px"
            v-model="articleListQuery.id"
            @change="chQueryMyteams"
            :clearable="true"
            placeholder="请选择团队或个人"
          >
            <el-option
              v-for="(item, idx) in myteams"
              :key="item.id"
              :label="item.teamName"
              :value="idx"
            >
            </el-option>
          </el-select>

          <el-date-picker
            style="width: 238px"
            v-model="articleListQuery.timeRange"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
          <el-input
            v-model="articleListQuery.title"
            style="width: 170px; margin: 0 1em"
            size="large"
            placeholder="请输入贴文关键词"
            @keyup.enter.native="enterFilter"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button type="primary" @click="serarch">搜索</el-button>
        </div>
        <!-- <el-button style="margin-top:15px;" class="fr" icon="el-icon-refresh" type="primary" @click="refresh">刷新</el-button> -->
        <div class="clear"></div>
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
          v-for="(item, index) in articleList"
          :key="index"
          class="essay-list"
          style="margin-bottom: 10px"
        >
          <el-card class="box-card">
            <div class="article-wrap">
              <div class="article-header" style="border: none">
                <div class="tiems fl" style="margin-top: 10px">
                  {{ formatDate(item.createdTime) }}
                </div>
                <div class="fl title">
                  <!-- <el-checkbox></el-checkbox> -->
                  <span
                    class="fl"
                    v-if="item.pushStatus == -1"
                    :class="'pushState' + item.pushStatus"
                  >
                    发布失败
                  </span>
                  <span
                    class="fl"
                    v-else-if="item.pushStatus == 0"
                    :class="'pushState' + item.pushStatus"
                  >
                    推送中...
                  </span>
                  <span
                    v-else-if="item.pushStatus == 1"
                    class="fl"
                    :class="'pushState' + item.pushStatus"
                  >
                    已发布
                  </span>
                  <span
                    v-else-if="item.pushStatus == 2"
                    class="fl"
                    :class="'pushState' + item.pushStatus"
                  >
                    待发布
                  </span>
                  <span v-else class="fl" :class="'pushState-1'">
                    取消发布
                  </span>
                  <span class="article-box-title fl"
                    >所在主题：<a :title="item.topicTitle">{{ item.topicTitle }}</a></span
                  >
                  <div class="clear"></div>
                </div>

                <div class="clear"></div>
              </div>

              <div
                class="box-card"
                style="margin: 10px 0px; position: relative"
              >
                <div class="left-wrap fl">
                  <div class="top-wrap">
                    <div v-for="user in filteredOauthUsers" :key="user.id">
                      <div
                        style="position: relative"
                        v-show="item.socialAccountId == user.id"
                      >
                        <el-avatar :size="40" :src="user.avatar"> </el-avatar>
                        <svg-icon
                          :icon-class="user.oauthType.toLowerCase()"
                          :class="'badge ' + user.oauthType.toLowerCase()"
                        />
                        <span class="page_name" v-bind:class="user.oauthType">{{
                          user.nick
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="bottom-wrap">
                    <div style="margin: 10px 0px">
                      <p>{{ item.content }}</p>
                    </div>

                    <div class="imgs-wrap" v-if="item.contentType == 'image'">
                      <viewer :images="item.resourcesUrl"
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
                    <div class="imgs-wrap" v-if="item.contentType == 'video'">
                      <video
                        width="200"
                        height="120"
                        :src="item.resourcesUrl[0]"
                        preload="auto"
                        controls
                      />
                    </div>

                    <div
                      v-if="
                        item.resourceInfos != null &&
                        item.resourceInfos.length > 0 &&
                        item.hasOwnProperty('resourceInfos')
                      "
                    >
                      <div
                        class="imgs-wrap"
                        v-if="
                          item.resourceInfos[0].resourceType == 'AUDIO' ||
                          item.contentType == 'audio'
                        "
                      >
                        <audio
                          width="200"
                          height="auto"
                          :src="item.resourceInfos[0].url"
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
                    v-if="item.socialPlatform != 'PODCAST'"
                  >
                    <div class="data-wrap data-wrap-show" style="width: 300px">
                      <div class="data-wrap-show-title">贴文统计</div>
                      <ul 
                        v-if="item.socialPlatform.toLowerCase() == 'facebook'"
                      >
                        <!-- <li>
                            <span>展示</span>
                            <span class="zs-progress"></span>
                          </li> -->
                        <li>
                          <span class="txt">心情</span>
                          <span
                            class="dz-progress"
                            :style="{ width: item.favouriteCount + 'px' }"
                          ></span>
                          <span class="num">
                            {{ item.favouriteCount }}
                          </span>
                        </li>

                        <li>
                          <span class="txt">分享</span>
                          <span
                            class="zf-progress"
                            :style="{ width: item.shareCount + 'px' }"
                          ></span>
                          <span class="num">
                            {{ item.shareCount }}
                          </span>
                        </li>

                        <li>
                          <span class="txt">评论</span>
                          <span
                            class="hf-progress"
                            :style="{ width: item.replayCount + 'px' }"
                          ></span>
                          <span class="num">
                            {{ item.replayCount }}
                          </span>
                        </li>
                        <!-- v1.4 点击 -->
                        <li>
                          <span class="txt">点击</span>
                          <span
                            class="dj-progress"
                            :style="{ width: item.clicksCount + 'px' }"
                          ></span>
                          <span class="num">
                            {{ item.clicksCount }}
                          </span>
                        </li>
                      </ul>

                      <ul
                        v-if="item.socialPlatform.toLowerCase() == 'twitter'"
                      >
                        <li>
                          <span class="txt">喜欢</span>
                          <span
                            class="dz-progress"
                            :style="{ width: item.favouriteCount + 'px' }"
                          ></span>
                          <span class="num">
                            {{ item.favouriteCount }}
                          </span>
                        </li>

                        <li>
                          <span class="txt">转发</span>
                          <span
                            class="zf-progress"
                            :style="{ width: item.shareCount + 'px' }"
                          ></span>
                          <span class="num">
                            {{ item.shareCount }}
                          </span>
                        </li>

                        <li>
                          <span class="txt">回复</span>
                          <span
                            class="hf-progress"
                            :style="{ width: item.replayCount + 'px' }"
                          ></span>
                          <span class="num">
                            {{ item.replayCount }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 发布操作 -->
                  <div v-if="item.socialPlatform != 'PODCAST'">
                    <div
                      class="pushBtn"
                      v-if="item.pushStatus == -1"
                      style="margin-top: 20px"
                    >

                      <el-button 
                        size="mini"
                        class="post-views"
                        @click="previews(item, index)"
                        round
                      >
                        预览
                      </el-button>

                      <el-button
                        size="mini"
                        @click="deleListItem(item, index)"
                        round
                        >删除贴文</el-button
                      >
                      <!-- <el-button 
                            v-if="item.resourceInfos || item.resourceInfos.length"
                            size="mini" 
                            type="primary" 
                            icon="el-icon-edit" 
                            round
                            @click="pushListItem(pushLists, index)"
                          >编辑</el-button> -->

                      <!-- <el-button 
                            size="mini" 
                            type="primary" 
                            icon="el-icon-s-promotion" 
                            @click="pushListItem(pushLists, index)"
                          >再次发帖</el-button> -->
                    </div>
                    <div
                      class="pushBtn"
                      v-if="item.pushStatus == 1"
                      style="margin-top: 20px"
                    >
                      <el-button 
                        size="mini" 
                        class="post-views"
                        @click="previews(item, index)"
                        round
                      >
                        预览
                      </el-button>
                      <el-button
                        size="mini"
                        @click="deleListItem(item, index)"
                        round
                        >删除贴文</el-button
                      >
                    </div>
                  </div>
                  <div v-else>
                    <div
                      class="pushBtn pushBtn-podcast"
                      style="position: absolute; bottom: 26px; right: 30px"
                    >
                      <el-button 
                        size="mini" 
                        class="post-views"
                        @click="previews(item, index)"
                        round
                      >
                        预览
                      </el-button>
                      <el-button
                        size="mini"
                        @click="deleListItem(item, index)"
                        round
                        >删除</el-button
                      >
                      <!-- <el-button 
                            v-if="item.resourceInfos || item.resourceInfos.length"
                            size="mini" 
                            type="primary" 
                            icon="el-icon-edit" 
                            round
                            @click="pushListItem(pushLists, index)"
                          >编辑</el-button> -->

                      <!-- <el-button 
                            size="mini" 
                            type="primary" 
                            icon="el-icon-s-promotion" 
                            @click="pushListItem(pushLists, index)"
                          >再次发帖</el-button> -->
                    </div>
                  </div>
                </div>
                <div class="clear"></div>
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
        :total="total"
        :page.sync="articleListQuery.page"
        :limit.sync="articleListQuery.limit"
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
    </el-main>
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
  queryPushTopic,
  querypushcontentsocialcount,
  deletePushContent,
  pushContent,
  queryPushContents,
} from "@/api/pusher";
import { scrollTo } from "@/utils/scroll-to";
import previewPc from "../push/components/previewPc";
import previewMobile from "../push/components/previewMobile";
import { queryMyteams } from "@/api/team";

export default {
  name: "essay",
  mixins: [Previews, Vviewer],
  components: { Pagination, previewPc, previewMobile },
  data() {
    return {
      tableKey: 0,
      currentPage: "",
      listLoadingText: true,
      list: null,
      articleList: null,
      total: 0,
      articleListQuery: {
        page: 1,
        limit: 5,
        title: "",
        type: "",
        timeRange: [],
        socialAccountId: null,
        pushStatus: "",
        platform: "",
        teamId: ''
      },
      html: "",
      pushStatus: false,
      activeName: "first",
      openActive: "",
      disabled: false,
      options: [
        {
          value: "2",
          label: "待发布",
        },
        {
          value: "1",
          label: "已发布",
        },
        {
          value: "0",
          label: "推送中",
        },
        {
          value: "-1",
          label: "发布失败",
        },
        {
          value: "102",
          label: "取消发布",
        },
      ],
      socialAccount: [],
      socialAccountInit: {
        id: 100,
        nick: "全部社交账号",
      },
      value: "",
      filtersAll: true,
      filtersFB: false,
      filtersTW: false,
      filtersYTB: false,
      filtersPCT: false,
      initUsers: true,
      myteams: [],
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
        case "facebook":
          return "f";
          break;
        case "LINKEDIN":
          return "in";
          break;
        case "twitter":
          return "t";
          break;
        default:
          break;
      }
      return statusMap[status];
    },
  },
  computed: {
    ...mapGetters(["oauthUsers"]),
    filteredOauthUsers() {
      if (this.articleListQuery.type) {
        return this.oauthUsers.filter(
          (u) => u.oauthType === this.articleListQuery.type.toUpperCase()
        );
      } else {
        if (this.initUsers) {
          this.oauthUsers.forEach((item) => {
            this.socialAccount.push({
              id: item.id,
              nick: item.nick,
              oauthType: item.oauthType,
            });
          });
          // this.socialAccount.unshift(this.socialAccountInit);
          this.initUsers = false;
        }
        return this.oauthUsers;
      }
    },
  },
  created() {
    this.getList();
    this.initSocial();
  },
  mounted() {
    queryMyteams()
      .then((res) => {
        this.myteams = res.data;
        //个人
        this.filteredOauthUsers.forEach(v => {
          this.myteams.push({teamName: v.nick, id: v.id, fic_id: 'false'})
        })
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    chQueryMyteams(idx) {
      if (this.myteams[idx].hasOwnProperty('fic_id')) {
        this.articleListQuery.teamId = this.myteams[idx].fic_id;
      }
      else {
        this.articleListQuery.teamId = this.myteams[idx].id;
      }

      this.articleListQuery.page = 1;
      this.getList();
    },
    initSocial() {},
    socialUser(val) {
      this.articleListQuery.page = 1;
      this.getList();
    },
    pushState(val) {
      this.articleListQuery.page = 1;
      this.getList();
    },
    refresh() {
      this.disabled = true;
      this.getList();
    },
    _refresh() {
      this.disabled = true;
      this.getList();
    },
    handleFilter(type) {
      let arr = [];
      this.filtersAll = false;
      this.filtersFB = false;
      this.filtersTW = false;
      this.filtersYTB = false;
      this.filtersPCT = false;
      this.articleListQuery.socialAccountId = "";
      this.articleListQuery.pushStatus = "";
      if (type == "") {
        this.filtersAll = true;
      }

      if (type == "facebook") {
        this.filtersFB = true;
      }

      if (type == "twitter") {
        this.filtersTW = true;
      }

      if (type == "google") {
        this.filtersYTB = true;
      }

      if (type == "podcast") {
        this.filtersPCT = true;
      }

      this.filteredOauthUsers.forEach((item) => {
        if (item.oauthType.toLowerCase() == type) {
          arr.push(item);
        }
      });

      if (type == "") {
        this.socialAccount = this.filteredOauthUsers;
      } else {
        this.socialAccount = arr;
      }
      // this.socialAccount.unshift(this.socialAccountInit);

      this.articleListQuery.page = 1;
      this.articleListQuery.platform = type;
      this.getList();
    },
    pushState() {
      this.articleListQuery.page = 1;
      this.getList();
    },
    enterFilter() {
      this.articleListQuery.page = 1;
      this.getList();
    },
    serarch() {
      this.articleListQuery.page = 1;
      this.getList();
    },
    //切换内容
    handleClick() {
      this.getList();
    },
    //贴文排行
    getList() {
      this.listLoadingText = true;
      queryPushContents(this.articleListQuery)
        .then((response) => {
          response.data.list.forEach((content) => {
            querypushcontentsocialcount({ id: content.id })
              .then((res) => {
                content.favouriteCount = res.data.favouriteCount;
                content.replayCount = res.data.replayCount;
                content.shareCount = res.data.shareCount;
              })
              .catch((err) => {
                this.listLoadingText = false;
              });
          });

          this.articleList = response.data.list;
          this.total = response.data.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoadingText = false;
          }, 1.5 * 1000);
        })
        .then(() => {
          // if (type == "query") {
          //   console.log(this.articleList);
          //   this.articleList.forEach((val, idx) => {
          //     queryTopicPageViews({id: val.id}).then(res => {
          //       this.articleList[idx].pageviews = res.data.pageviews;
          //     })
          //     .catch(e => {
          //       console.log(e);
          //     })
          //   })
          // }
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
    serarch() {
      this.articleListQuery.page = 1;
      this.getList();
    },
    selectedPushState() {
      console.log(this.value);
    },
    jumpPage() {
      if (this.currentPage != "" && typeof this.currentPage == "number") {
        this.articleListQuery.page = this.currentPage;
        this.getList();
        scrollTo(0, 800);
        this.currentPage = "";
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./index.scss";

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

$width: 36px;
$height: 36px;
$display: inline-block;
$cursor: pointer;

@mixin social {
  width: $width;
  height: $height;
  display: $display;
  cursor: $cursor;
  border-radius: 50%;
}

.filter-container {
  & > span {
    vertical-align: middle;
  }
  .all-container {
    background: url("../../assets/images/all.png") no-repeat;
    @include social;
  }
  .fb-container {
    background: url("../../assets/images/facebook.png") no-repeat;
    @include social;
  }
  .tt-container {
    background: url("../../assets/images/twitter.png") no-repeat;
    @include social;
  }
  .youtube-container {
    background: url("../../assets/images/youtube.png") no-repeat;
    @include social;
  }
  .podcast-container {
    background: url("../../assets/images/podcast.png") no-repeat;
    @include social;
  }

  .all-select-container {
    background: url("../../assets/images/all-selected.png") no-repeat;
    @include social;
  }
  .fb-select-container {
    background: url("../../assets/images/facebook-selected.png") no-repeat;
    @include social;
  }
  .tt-select-container {
    background: url("../../assets/images/twitter-selected.png") no-repeat;
    @include social;
  }
  .youtube-select-container {
    background: url("../../assets/images/youtube-selected.png") no-repeat;
    @include social;
  }
  .podcast-select-container {
    background: url("../../assets/images/podcast-selected.png") no-repeat;
    @include social;
  }
}

.data-wrap {
  background-color: #f2f6fc;
  height: 200px;
  width: 200px;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
}
.article-wrap ::v-deep {
  .article-header .article-box-title {
    max-width: 516px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    -o-border-radius: 3px;
    padding: 10px;
    background-color: #f2f2fe;
    color: #7e7ef4;
  }
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
.essay-list .el-card:hover{
  border: 1px solid #7e7ef4;
}

.pc-wrap ::v-deep .content-wrap{
  width: 418px;
  margin: 0 auto!important;
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