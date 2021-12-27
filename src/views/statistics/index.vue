<template>
  <div class="app-container">
    <el-header>
      <div class="fl title-wrap">
        <span class="header-title">数据中心-工作量统计</span>
      </div>
      <div class="fr picker-time-container">
        <span class="time-title">时间：</span>
        <el-button-group class="picker-wrap">
          <el-button :class="{ bg: active == 1 }" @click="today(1)"
            >今天</el-button
          >
          <el-button
            :class="{ bg: active == 2 }"
            class="yesterday"
            @click="yesterday(2)"
            >昨天</el-button
          >
          <el-button
            :class="{ bg: active == 3 }"
            class="lastSevenDays"
            @click="lastSevenDays(3)"
            >最近7天</el-button
          >
          <el-button :class="{ bg: active == 4 }" @click="thirtyDays(4)"
            >最近30天</el-button
          >
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
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按日" name="first" :key="'first'" v-loading="listLoading">
        <!-- <statisticsByDate v-if="isFirst" /> -->
        
        <el-table :data="tableData" style="width: 100%" v-loading="listLoading">
          <el-table-column
            prop="platform"
            label="日期"
            min-width="25%"
            align="center"
          >
          <template slot-scope="scope">
            <div>
              {{scope.row.key}}
            </div>
          </template>
          </el-table-column>
          <el-table-column
            prop="volume"
            label="发帖量"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.pushContentCount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="video"
            label="视频"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.videoCount}}
              </div>
            </template>

          </el-table-column>
          <el-table-column
            prop="audio"
            label="音频"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.audioCount}}
              </div>
            </template>

          </el-table-column>
          <el-table-column
            prop="pics"
            label="图片"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.imgCount}}
              </div>
            </template>

          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="按平台" name="second" :key="'second'" v-loading="listLoading">
        <!-- <statisticsByPlatform v-if="isSecond" /> -->

        <el-table :data="tableData" style="width: 100%" v-loading="listLoading">
          <el-table-column
            prop="platform"
            label="平台"
            min-width="25%"
            align="center"
          >
          <template slot-scope="scope">
            <div>
              {{scope.row.key}}
            </div>
          </template>
          </el-table-column>
          <el-table-column
            prop="volume"
            label="发帖量"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.pushContentCount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="video"
            label="视频"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.videoCount}}
              </div>
            </template>

          </el-table-column>
          <el-table-column
            prop="audio"
            label="音频"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.audioCount}}
              </div>
            </template>

          </el-table-column>
          <el-table-column
            prop="pics"
            label="图片"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.imgCount}}
              </div>
            </template>

          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="按社交号" name="third" :key="'third'" v-loading="listLoading">
        <!-- <statisticsBySocialAccount v-if="isThird" /> -->
        <el-table :data="tableData" style="width: 100%" v-loading="listLoading">
          <el-table-column
            prop="platform"
            label="社交号"
            min-width="25%"
            align="center"
          >
          <template slot-scope="scope">
            <div>
              {{scope.row.key}}
            </div>
          </template>
          </el-table-column>
          <el-table-column
            prop="volume"
            label="发帖量"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.pushContentCount}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="video"
            label="视频"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.videoCount}}
              </div>
            </template>

          </el-table-column>
          <el-table-column
            prop="audio"
            label="音频"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.audioCount}}
              </div>
            </template>

          </el-table-column>
          <el-table-column
            prop="pics"
            label="图片"
            min-width="25%"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.imgCount}}
              </div>
            </template>

          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <pagination
      style="padding: 10px"
      v-show="total > 0"
      :total="total"
      :page.sync="viewsStatisSearch.page"
      :limit.sync="viewsStatisSearch.limit"
      :layout="'total, prev, pager, next, slot'"
      @pagination="getViewsData"
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
import moment from "moment";
import Pagination from "@/components/Pagination";
import statisticsByDate from "./components/statisticsByDate";
import statisticsByPlatform from "./components/statisticsByPlatform";
import statisticsBySocialAccount from "./components/statisticsBySocialAccount";
import {
  getStatisticsByDate,
  getStatisticsByPlatform,
  getStatisticsBySocialAccount,
} from "@/api/statistics";

export default {
  name: "Statistics",
  components: {
    statisticsByDate,
    statisticsByPlatform,
    statisticsBySocialAccount,
    Pagination,
  },
  data() {
    let that = this;
    let _minTime = null;
    let _maxTime = null;
    return {
      currentPage: "",
      tableKey: 0,
      activeName: "first",
      isFirst: true,
      isSecond: false,
      isThird: false,
      userPushCountToday: 0, //今日发贴
      userTodayTotalSocialCount: 0, //今日发贴总互动量
      trends: [],
      dateValue: new Date(),
      active: 1,
      tableData: [],
      listLoading: false,
      list: null,
      total: 0,
      viewsStatisSearch: {
        startTime: "",
        endTime: "",
        page: 1,
        limit: 20,
      },
      params: {
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        page: 1,
        limit: 20,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      pushed: 0,
      interaction: 0,
      newAddFansCount: 0,
      news: [],
    };
  },
  created() {
    this.today(1);
  },
  methods: {
    //切换内容
    handleClick() {
      this.listLoading = true;
      if (this.activeName == "first") {
        this.activeName = "first";
        this.isFirst = true;
        this.isSecond = false;
        this.isThird = false;
      } else if (this.activeName == "second") {
        this.activeName = "second";
        this.isFirst = false;
        this.isSecond = true;
        this.isThird = false;
      } else {
        this.activeName = "third";
        this.isFirst = false;
        this.isSecond = false;
        this.isThird = true;
      }
      this.getViewsData()
    },
    today(idx) {
      var date = new Date(moment().subtract(0, 'days').startOf('day').toString());
      var today = new Date();
      this.viewsStatisSearch.startTime = date;
      this.viewsStatisSearch.endTime = today;
      this.active = idx;
      this.getViewsData();
    },
    // 昨天
    yesterday(idx) {
      var date = new Date(moment().subtract(1, 'days').startOf('day').toString());
      var date2 = new Date(moment().subtract(1, 'days').endOf('day').toString());
      this.viewsStatisSearch.startTime = date;
      this.viewsStatisSearch.endTime = date2;
      this.active = idx;
      this.getViewsData();
    },
    // 最近七天
    lastSevenDays(idx) {
      var startDate = moment(
        new Date().getTime() - 3600 * 24 * 1000 * 6
      );
      var todayDate = moment(new Date());
      // var startDate2 = moment().subtract('days', 6).format('YYYY-MM-DD')
      this.viewsStatisSearch.startTime = startDate;
      this.viewsStatisSearch.endTime = todayDate;
      this.active = idx;
      this.getViewsData();
    },
    // 最近30天
    thirtyDays(idx) {
      const startDate =
        moment().subtract("days", 29);
      const endDate = moment(new Date());
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
        t2: timer2,
      };
    },
    getDays() {
      let timer = this.timeForMat(29);
      return timer;
    },
    getViewsData() {
      if (this.activeName == "first") {
        getStatisticsByDate(this.viewsStatisSearch)
          .then((res) => {
            this.tableData = res.data.list;
            this.total = res.data.total;
          })
          .catch((err) => {});
      } else if (this.activeName == "second") {
        getStatisticsByPlatform(this.viewsStatisSearch)
          .then((res) => {
            this.tableData = res.data.list;
            this.total = res.data.total;
          })
          .catch((err) => {});
      } else {
        getStatisticsBySocialAccount(this.viewsStatisSearch)
          .then((res) => {
            this.tableData = res.data.list;
            this.total = res.data.total;
          })
          .catch((err) => {});
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 500)
    },
    formatDate(val) {

      if (val != null) {

        this.viewsStatisSearch.startTime = moment(val[0])
        if (moment(val[1]).valueOf() == moment(moment().format('YYYY-MM-DD')).valueOf()) {
          this.viewsStatisSearch.endTime = moment(moment().format('YYYY-MM-DD HH:ss:mm'))
        }
        else {
          this.viewsStatisSearch.endTime = moment(moment(val[1]).format("YYYY-MM-DD 23:59:59"));
        }
        this.getViewsData();
      } else {
        this.today(1);
        this.active = 1;
      }
    },
    jumpPage() {
      if (this.currentPage != "" && typeof this.currentPage == "number") {
        this.viewsStatisSearch.page = this.currentPage;
        this.getViewsData();
        scrollTo(0, 800);
        this.currentPage = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/variables.scss";

.stars {
  padding: 20px 10px 10px 10px;
  // max-width: 600px;
  background-color: white;
  border-radius: 5px;
  h3 {
    color: $primary;
    font-size: 16px;
    background-color: $primary_ligth;
    font-weight: normal;
    padding: 10px 0 10px 10px;
    border-radius: 3px;
    margin: 0;
  }
  .clear {
    clear: both;
  }
  p {
    & {
      font-size: 14px;
      padding: 0 10px;
      margin: 0;
      line-height: 34px;
    }
    a {
      & {
        display: block;
        float: left;
      }
      &:hover {
        color: #7e7ef4;
      }
    }
    span {
      display: block;
      float: right;
      color: #909399;
    }
  }
  .number {
    padding-right: 1em;
  }
  p:first-of-type .number {
    color: red;
  }
  p:nth-of-type(2) .number {
    color: rgb(252, 61, 4);
  }
  p:nth-of-type(3) .number {
    color: rgb(250, 157, 36);
  }

  .right {
    float: right;
    padding-left: 15px;
  }
  p:first-of-type .right {
    background-image: url(../../assets/images/fire-20x20.png);
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: 0 8px;
  }
  // p:nth-of-type(2n)
  p:nth-of-type(even) {
    background-color: $bg;
  }
  .right-btn {
    float: right;
    display: none;
    cursor: pointer;
    color: white;
    background-color: $primary;
    padding: 0 5px;
    border-radius: 3px;
    -webkit-transform: scale(0.8);
    -ms-transform: scale(0.8);
    transform: scale(0.8);
  }
  p:hover {
    .right {
      display: none;
    }
    .right-btn {
      display: inline-block;
    }
  }
}

// .el-card+ .el-card {
//   margin-left: 10px;
// }

.thirdparty-button {
  width: 35%;
  margin-bottom: 30px;
}

@media only screen and (max-width: 470px) {
  .thirdparty-button {
    display: none;
  }
}
.fr {
  float: right;
}
.fl {
  float: left;
}
.clear {
  clear: both;
}
.date-picker {
  width: 248px;
  margin-left: 20px;
}
.picker-wrap {
  button {
    color: #7e7ef4;
  }
  button.yesterday {
    border-right: none;
  }
  button.lastSevenDays {
    border-left: none;
    border-right: none;
  }
  button:last-child {
    border-left: none;
  }
  button:first-child {
    border-right: none;
  }
  button.bg {
    background-color: #7e7ef4;
    color: #fff;
  }
}
.time-title {
  color: #909399;
}
.title-wrap {
  height: 36px;
  line-height: 36px;
}

.picker-time-container ::v-deep {
  .el-date-editor .el-range-separator {
    width: 12%;
  }
}
.el-header {
  padding: 0;
}
.header-title{
  color:#462798;
  font-size: 18px;
}
.el-tabs__item {
  font-size: 16px;
}

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
</style>
