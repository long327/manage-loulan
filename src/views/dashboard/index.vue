<template>
  <div class="dashboard-container">
    <el-container>
      <el-header>
        <div class="fl title-wrap">
          <span class="header-title">数据概览</span>
        </div>
        <div class="fr picker-time-container">
          <span class="time-title">时间：</span>
          <el-button-group class="picker-wrap">
            <el-button :class="{bg:active == 1}" @click="today(1)">今天</el-button>
            <el-button :class="{bg:active == 2}" class="yesterday" @click="yesterday(2)">昨天</el-button>
            <el-button
              :class="{bg:active == 3}"
              class="lastSevenDays"
              @click="lastSevenDays(3)"
            >最近7天</el-button>
            <el-button :class="{bg:active == 4}" @click="thirtyDays(4)">最近30天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateValue"
            class="date-picker"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            range-separator="至"
            @change="formatDate"
          ></el-date-picker>
        </div>
        <div class="clear"></div>
      </el-header>
      <el-main>
        <el-row class="overview">
          <el-col :span="6">
            <p class="number">
              <router-link to="/myaccounts">{{accountsTotal}}</router-link>
            </p>
            <p class="tip">授权社交号</p>
          </el-col>
          <el-col :span="6" class="mid">
            <p class="number">
              <router-link to="/pushlist/index">{{pushed}}</router-link>
            </p>
            <p class="tip">成功发帖</p>
          </el-col>
          <el-col :span="6" class="rig-border">
            <p class="number">{{interaction}}</p>
            <p class="tip">新增互动</p>
          </el-col>
          <el-col :span="6">
            <p class="number">{{newAddFansCount}}</p>
            <p class="tip">新增粉丝</p>
          </el-col>
        </el-row>
      </el-main>
      <el-header>
        <span class="header-title">最近使用社交号</span>
        <!-- <el-select
          v-model="listQuery.type"
          placeholder="全部"
          clearable
          style="width: 90px; "
          class="filter-item"
        >
          <el-option v-for="type in types" :key="type" :label="type" :value="type" />
        </el-select>-->
      </el-header>
      <el-main class="user-list">
        <div style="clear:both">
          <el-card key="add" style="text-align:center" class="plus-con">
            <el-button icon="el-icon-plus" type="primary" circle @click="showDialog=true" />
            <p>添加帐号</p>
          </el-card>
          <el-card v-for="user in filteredOauthUsers" :key="user.id">
            <el-avatar :size="34" :src="user.avatar" :class="user.unAuthorized?'unauth':''" />
            <svg-icon
              :icon-class="user.oauthType.toLowerCase()"
              :class="'badge '+ (user.unAuthorized?'unauth':'')+ ' ' +user.oauthType.toLowerCase()"
            />
            <span class="nick">
              <span>{{ user.nick }}</span>
            </span>
            <p>今日发帖互动量：{{user.interaction}}</p>
          </el-card>
        </div>
      </el-main>
      <!-- <el-header><span class="header-title">Twitter话题排行榜 <span style="font-size:12px;color:gray">日榜</span></span></el-header>
      <el-main>
        <div class="stars">
          <h3>全球趋势</h3>
          <p v-for="(value,key) in trends" :key="key">
            <span class="number">{{key+1}}</span>
            <span class="title">{{value.topic}}</span>
            <span class="right">
              {{value.volume | formatNumber}}
            </span>
            <span class="right-btn" @click="handleTopicClick(value.topic)">
              发布贴文
            </span>
          </p>
        </div>
      </el-main>-->
      <el-main>
        <!--lee-->
        <el-calendar v-model="calendarDatavalue" id="calendar">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" slot-scope="{date, data}">
            <!--自定义内容-->
            <div @click.stop="handleAddClick(data.day)" class="el-calendar-day">
              <div class="calendar-day">{{data.day.split('-').slice(2).join('-') }}</div>
              <div class="overflowld">
                <div v-for="(item,index) in calendarData" :key="index">
                  <div v-if="(item.year).indexOf(data.day.split('-')[0])!=-1">
                    <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                      <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                        <div style="overflow: hidden;" class="calendarbg" v-if="item.option==0">
                          <div class="calendarbg-one">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="item.things"
                              placement="right"
                            >
                              <div
                                ref="input"
                                class="is-selected lee-text"
                                @click.stop="handleEventClick(item)"
                              >{{item.things}}</div>
                            </el-tooltip>
                          </div>
                          <span @click="gotofagao(item.things)" class="gotofagao">
                            <img :src="leeIcon" />
                          </span>
                        </div>
                        <el-tooltip
                          v-if="item.option==1"
                          class="item"
                          effect="dark"
                          :content="item.things"
                          placement="right"
                        >
                          <div
                            ref="input"
                            class="is-selected is-selected-two"
                            @click.stop="handleEventClick(item)"
                          >{{item.things}}</div>
                        </el-tooltip>
                      </div>
                      <div v-else></div>
                    </div>
                    <div v-else></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-calendar>
        <el-dialog
          :title="optTitle"
          style="width:1120px;margin: 0 auto;"
          :visible.sync="dialogFormVisible"
          :before-close="cancle"
        >
          <el-input
            class="dialog-input"
            @input="searchInput"
            v-model="inputLd"
            placeholder="请输入备忘内容"
            maxlength="100"
            show-word-limit
          ></el-input>
          <div style="margin-bottom:30px">
            <el-radio-group @change="leeChangeRadio" v-model="option">
              <el-radio :label="0">发稿</el-radio>
              <el-radio :label="1">提醒</el-radio>
              <!-- <el-radio :label="2">备选项</el-radio> -->
            </el-radio-group>
          </div>
          <el-button v-if="form_id" type="warning" style="float: left;" @click="delEvent">删 除</el-button>
          <el-button style="float: rihgt;" @click="cancle">取 消</el-button>
          <el-button type="primary" @click="saveEvent">确 定</el-button>
        </el-dialog>
        <!--lee-->
      </el-main>

      <!-- <el-header class="header-news">
        <span class="header-title">新闻中心</span>
      </el-header>
      <el-main>
        <div class="stars">
          <p v-for="(value,key) in news" :key="key">
            <a :href="value.link" target="_blank" class="title">{{value.title}}</a>
            <span>{{value.datatime}}</span>
            <span class="clear"></span>
          </p>
          <div class="clear"></div>
        </div>
      </el-main>-->
    </el-container>
    <el-dialog title="添加帐号" :visible.sync="showDialog">
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getUserPushCount,
  getUserTotalSocialCount,
  getSocialAccountTodayTotalSocialCount,
  getFansCount,
  getNews
} from "@/api/pusher";
import { getActiveUsers } from "@/api/oauthUser";
import { getTrendsGlobal } from "@/api/report";
import SocialSign from "../my-accounts/components/SocialSignin";
import { handleAuthResult } from "@/utils/auth";
import {
  getCalendarCount,
  addCalendar,
  updateCalendar,
  deleteCalendar
} from "@/api/calendar";
import moment from "moment";
import axios from "axios";
import iCon from "@/assets/images/icn.png";
export default {
  name: "Dashboard",
  components: { SocialSign },
  data() {
    let that = this;
    let _minTime = null;
    let _maxTime = null;
    return {
      showDialog: false,
      listQuery: {
        type: ""
      },
      // types: ['facebook', 'twitter']
      //统计
      userPushCountToday: 0, //今日发贴
      userTodayTotalSocialCount: 0, //今日发贴总互动量
      trends: [],
      dateValue: new Date(),
      active: 1,
      viewsStatisSearch: {
        startTime: "",
        endTime: ""
      },
      params: {
        startTime: "", // 开始时间
        endTime: "" // 结束时间
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      pushed: 0,
      interaction: 0,
      newAddFansCount: 0,
      news: [],
      //lee
      leeIcon: iCon,
      option: 0,
      limitLnth: 0,
      calendarData: [],
      calendarchild: {
        eventTime: "",
        eventType: 0,
        things: []
      },
      isSure: 0,
      calendarIndex: 0,
      form_id: 0,
      optTitle: "",
      inputLd: "",
      dialogFormVisible: false,
      calendarDatavalue: new Date()
    };
  },
  created() {
    this.leeGetCalendarCount();
  },
  computed: {
    ...mapGetters([
      "name",
      // 'interaction',
      // 'pushed',
      "roles",
      "oauthUsers"
    ]),
    filteredOauthUsers() {
      var users;
      if (this.listQuery.type) {
        return this.oauthUsers.filter(
          u => u.oauthType === this.listQuery.type.toUpperCase()
        );
      } else {
        return this.oauthUsers;
      }
    },
    accountsTotal() {
      return this.oauthUsers.length;
    },
    types() {
      return Array.from(new Set(this.oauthUsers.map(u => u.oauthType)));
    }
  },
  filters: {
    formatNumber(value) {
      if (!value) return 0;
      if (value < 1000) return value;
      if (value >= 1000 && value < 10000) {
        return value.substr(0, 1) + "," + value.substr(1);
      }
      return Math.round((value / 10000) * 10) / 10 + "万";
    }
  },
  mounted() {
    var self = this;
    window.handleAuthResult = function(id) {
      handleAuthResult(id, self);
    };
    this.$store.dispatch("oauth/resetUsers").then(res => {
      // getUserPushCountToday().then(res=>{
      //   this.$store.dispatch("user/updatePushed",res.data)
      // })
      // getUserTodayTotalSocialCount().then(res=>{
      //   this.$store.dispatch("user/updateInteraction",res.data)
      // })
      getSocialAccountTodayTotalSocialCount(
        this.oauthUsers.map(u => u.id)
      ).then(res => {
        this.$store.dispatch("oauth/updateInteraction", res.data);
      });
      getActiveUsers().then(res => {
        this.$store.dispatch("oauth/sortUsers", res.data);
      });
    });

    /* 暂时取消
    getTrendsGlobal().then(res=> {
      this.trends = res.data
    })
    .catch(err => {
      console.log(err);
    })
    */

    //临时替换全球排行榜
    getNews()
      .then(res => {
        this.news = res.data;
      })
      .catch(err => {
        console.log(err);
      });

    setTimeout(() => {
      this.today(1);
      this.active = 1;
    }, 1000);
  },
  methods: {
    handleTopicClick(topic) {
      // this.$router.push("/push/index?topic="+topic.replace(/#/gi,''))
      this.$router.push({
        name: "pindex",
        params: { topic: topic.replace(/#/gi, "") }
      });
    },
    today(idx) {
      var date = moment(new Date()).format("YYYY-MM-DD 00:00:00");
      var today = moment()
        .subtract("days", 0)
        .format("YYYY-MM-DD HH:mm:ss");
      this.viewsStatisSearch.startTime = date;
      this.viewsStatisSearch.endTime = today;
      this.active = idx;
      this.getViewsData();
    },
    // 昨天
    yesterday(idx) {
      var date = moment(new Date().getTime() - 3600 * 24 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      );
      var date2 = moment()
        .subtract("days", 1)
        .format("YYYY-MM-DD 23:59:59");
      this.viewsStatisSearch.startTime = date;
      this.viewsStatisSearch.endTime = date2;
      this.active = idx;
      this.getViewsData();
    },
    // 最近七天
    lastSevenDays(idx) {
      var startDate = moment(
        new Date().getTime() - 3600 * 24 * 1000 * 6
      ).format("YYYY-MM-DD 00:00:00");
      var todayDate = moment(new Date()).format("YYYY-MM-DD 23:59:59");
      // var startDate2 = moment().subtract('days', 6).format('YYYY-MM-DD')
      this.viewsStatisSearch.startTime = startDate;
      this.viewsStatisSearch.endTime = todayDate;
      this.active = idx;
      this.getViewsData();
    },
    // 最近30天
    thirtyDays(idx) {
      const startDate =
        moment()
          .subtract("days", 29)
          .format("YYYY-MM-DD") + " 00:00:00";
      const endDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      this.viewsStatisSearch.startTime = startDate;
      this.viewsStatisSearch.endTime = endDate;
      this.active = idx;
      this.getViewsData();
    },
    timeForMat(count) {
      // 拼接时间
      let time1 = new Date();
      time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000);
      let Y1 = time1.getFullYear();
      let M1 =
        time1.getMonth() + 1 > 10
          ? time1.getMonth() + 1
          : "0" + (time1.getMonth() + 1);
      let D1 = time1.getDate() > 10 ? time1.getDate() : "0" + time1.getDate();
      let timer1 = Y1 + "-" + M1 + "-" + D1; // 当前时间
      let time2 = new Date();
      time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count);
      let Y2 = time2.getFullYear();
      let M2 =
        time2.getMonth() + 1 > 10
          ? time2.getMonth() + 1
          : "0" + (time2.getMonth() + 1);
      let D2 = time2.getDate() > 10 ? time2.getDate() : "0" + time2.getDate();
      let timer2 = Y2 + "-" + M2 + "-" + D2; // 之前的30天
      return {
        t1: timer1,
        t2: timer2
      };
    },
    getDays() {
      let timer = this.timeForMat(29);
      return timer;
    },
    getViewsData() {
      getFansCount(this.viewsStatisSearch)
        .then(res => {
          let data = res.data;
          this.newAddFansCount = 0;
          data.forEach(item => {
            this.newAddFansCount += item.newAddFansCount;
          });
        })
        .catch(err => {
          console.log("getFansCount:" + err);
        });

      getUserPushCount(this.viewsStatisSearch)
        .then(res => {
          let data = res.data;
          this.pushed = res.data;
        })
        .catch(err => {
          console.log("getUserPushCount:" + err);
        });

      getUserTotalSocialCount(this.viewsStatisSearch)
        .then(res => {
          this.interaction = res.data;
        })
        .catch(err => {
          console.log("getUserTotalSocialCount:" + err);
        });
    },
    formatDate(val) {
      if (val != null) {
        this.viewsStatisSearch.startTime = moment(val[0]).format(
          "YYYY-MM-DD 00:00:00"
        );
        this.viewsStatisSearch.endTime = moment(val[1]).format(
          "YYYY-MM-DD 23:59:59"
        );
        this.getViewsData();
      } else {
        this.today(1);
        this.active = 1;
      }
    },
    //获取数据
    leeGetCalendarCount() {
      getCalendarCount()
        .then(data => {
          const newData = data.data;
          this.getLeeCalendar(newData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //lee data
    getLeeCalendar(newData) {
      const newArray = [];
      newData.forEach(function(element) {
        const year = moment(element.eventTime)
          .format("YYYY-MM-DD")
          .split("-")[0];
        const months = moment(element.eventTime)
          .format("YYYY-MM-DD")
          .split("-")[1];
        const days = moment(element.eventTime)
          .format("YYYY-MM-DD")
          .split("-")[2];
        newArray.push({
          id: element.id,
          year: [year],
          months: [months],
          days: [days],
          option: element.eventType,
          things: element.things
        });
      });
      this.calendarData = [];
      this.calendarData = newArray;
    },
    // 新增
    handleAddClick(date) {
      this.calendarchild = {
        eventTime: moment(date).valueOf(),
        eventType: 0,
        things: ""
      };
      // this.calendarchild = Object.assign({}, this.calendarchild, newData);
      this.dialogFormVisible = true;
      this.optTitle = "新增备忘";
    },
    //输入框
    searchInput(e) {
      const newData = Object.assign({}, this.calendarchild, {
        things: e
      });
      this.calendarchild = Object.assign({}, this.calendarchild, newData);
    },
    //对象选择
    leeChangeRadio(e) {
      const newData = Object.assign({}, this.calendarchild, {
        eventType: e
      });
      this.calendarchild = Object.assign({}, this.calendarchild, newData);
    },
    //确认
    saveEvent() {
      if (this.form_id) {
        // updata
        updateCalendar(this.calendarchild)
          .then(data => {
            const newData = data.data;
            this.leeGetCalendarCount();
            this.clearText();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        //add
        addCalendar(this.calendarchild)
          .then(data => {
            const newData = data.data;
            this.leeGetCalendarCount();
            this.clearText();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //cancle
    cancle() {
      this.clearText();
    },
    //updata
    handleEventClick(info) {
      const eventTime = moment(
        `${info.year[0]}-${info.months[0]}-${info.days[0]}`
      ).valueOf();
      this.form_id = info.id;
      this.dialogFormVisible = true;
      this.optTitle = "修改或删除备忘";
      this.inputLd = info.things;
      this.option = info.option;
      this.calendarchild = {
        id: info.id,
        eventTime,
        eventType: info.option,
        things: info.things
      };
    },
    //删除提醒
    delEvent() {
      deleteCalendar({ id: this.form_id })
        .then(data => {
          const newData = data.data;
          this.leeGetCalendarCount();
          this.clearText();
        })
        .catch(err => {
          console.log(err);
        });
      this.clearText();
    },
    clearText() {
      this.dialogFormVisible = false;
      this.inputLd = "";
      this.optTitle = "";
      this.form_id = 0;
      this.option = 0;
      const newData = Object.assign({}, this.calendarchild, {
        eventTime: "",
        eventType: 0,
        things: []
      });
      this.calendarchild = Object.assign({}, this.calendarchild, newData);
    },
    gotofagao(name) {
      this.$router.push({
        name: "pindex",
        params: { topicTitle: name.replace(/#/gi, "") }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.calendar-day {
  text-align: center;
  color: #202535;
  line-height: 30px;
  font-size: 12px;
}
.calendarbg {
  display: flex;
  background: rgb(126, 126, 244, 0.1);
  padding: 0 10px;
  height: 24px;
  margin-bottom: 6px;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 4px;
  .calendarbg-one {
    width: 90%;
  }
}
.is-selected {
  font-size: 10px;
  line-height: 24px;
  height: 24px;
  color: #7e7ef4;
  border-radius: 4px;
  margin-bottom: 6px;
}
.lee-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gotofagao {
  height: 16px;
  line-height: 16px;
  margin-top: 4px;
  img {
    width: 16px;
    height: 16px;
  }
}
.is-selected-two {
  background: #7e7ef4;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
}
#calendar
  .el-button-group
  > .el-button:not(:first-child):not(:last-child):after {
  content: "当月";
}
.dialog-input {
  margin: 20px 0 30px 0;
}
.overflowld {
  overflow-y: auto;
  height: 120px;
  margin-top: 12px;
}
#calendar {
  width: 100%;
}
#calendar ::v-deep .calendar-day[data-v-106c86ed] {
  text-align: center;
  color: #999;
  line-height: 20px;
  font-size: 14px;
}
#calendar ::v-deep .el-calendar-table thead th {
  padding: 12px 0;
  color: #7e7ef4;
  font-weight: 400;
}
#calendar ::v-deep .el-calendar-table .el-calendar-day {
  height: 180px;
  padding: 8px 5%;
}
@media screen and (max-width: 1930px) {
  #calendar ::v-deep .el-calendar-table .el-calendar-day {
    height: 120px;
    padding: 4px 5%;
  }
  .overflowld {
    overflow-y: auto;
    height: 72px;
    margin-top: 6px;
  }
  .calendarbg {
    padding: 0 5px;
    height: 20px;
    margin-bottom: 4px;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 4px;
    .calendarbg-one {
      width: 80%;
    }
  }

  .is-selected {
  line-height: 20px;
  height: 20px;
  border-radius: 4px;
  margin-bottom: 4px;
}
}
</style>

<style>
.el-tooltip__popper {
  max-width: 280px;
  line-height: 20px;
  background: rgba(0, 0, 0, 0.65) !important;
  border-top-color: #595959 !important;
}
.el-calendar-table:not(.is-range) td.next,
.el-calendar-table:not(.is-range) td.prev {
  color: #c0c4cc;
  background-color: rgb(250, 250, 250);
}
.el-calendar-table thead {
  background: #f1f0fe;
  color: #7e7ef4;
}
.el-calendar__header .el-calendar__title {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  font-size: 20px;
  color: #462798;
}
.el-calendar-table thead th:before {
  content: "星期";
}
</style>
    if(this.$route.params.topicTitle){
      this.topicTitle = this.$route.params.topicTitle;
     }
