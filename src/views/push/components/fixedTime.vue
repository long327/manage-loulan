<template>
    <div class="timer-wrap">
        <el-row style="margin-top: 10px">
          <el-col :span="18">
            <el-radio v-model="pushObj.pushType" label="now">立即发布</el-radio>
            <el-radio v-model="pushObj.pushType" label="schedule"
              >定时发布</el-radio
            >
            <span
              class="schedule-tips"
              v-if="
                finalCheckedUsers.length < 1 && pushObj.pushType == 'schedule'
              "
              >请先添加社交号（每个社交号独立定时）</span
            >
          </el-col>
          <!-- <el-col :span="4">
            <el-button type="primary" :class="{pushAllLen: pushAllLen}" round @click="update" :disabled="publishing"
              >发布</el-button
            >
          </el-col>
          <el-col :span="4">
            <el-button type="info" :class="{isEmpty: isEmpty || _isEmpty}" @click="reset" round>重置</el-button>
          </el-col> -->
        </el-row>
        <div v-if="pushObj.pushType === 'schedule'" class="schedule-wrap">
          <template>
            <el-table :data="finalCheckedUsers" type="index" style="width: 100%">
              <el-table-column label="" width="50">
                <template slot-scope="scope">
                  <el-badge class="content-oauthType" type="info">
                    <el-avatar :size="40" :src="scope.row.avatar"> </el-avatar>
                    <svg-icon
                      :icon-class="scope.row.oauthType.toLowerCase()"
                      :class="'badge ' + scope.row.oauthType.toLowerCase()"
                    />
                  </el-badge>
                </template>
              </el-table-column>
              <el-table-column label="" min-width="60">
                <template slot-scope="scope">
                  <el-date-picker
                    class="schedulePicker"
                    v-model="scope.row.schedulePicker"
                    :editable="false"
                    :clearable="false"
                    :picker-options="pickerOptions"
                    format="yyyy-MM-dd"
                    @change="
                      schedulePicker(scope.$index, scope.row.schedulePicker)
                    "
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="" min-width="50">
               
                <template slot-scope="scope">
                  <el-time-picker
                    class="scheduleTime"
                    v-model="scope.row.scheduleTime"
                    value-format="HH:mm"
                    :editable="false"
                    :clearable="false"
                    :picker-options="{
                      selectableRange:
                        `${scope.row.initScheduleTime}` + '-23:59:59',
                    }"
                    format='HH:mm'
                    placeholder="选择时间"
                  >
                  </el-time-picker>
                </template>
              </el-table-column>
              <el-table-column class="table-td-timeZone" label="" min-width="130">
                <template slot-scope="scope">
                  <div class="timeZonePosition">
                    <div class="fl timezone-icon"></div>
                    <div>
                      <el-select
                        class="scheduleTimeZone"
                        v-model="scope.row.scheduleTimeZone"
                        @change="
                          choiceTimeZone(
                            scope.$index,
                            scope.row.scheduleTimeZone
                          )
                        "
                        placeholder="选择时区"
                      >
                        <el-option
                          v-for="(item, index) in timeZoneOptions"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <div class="clear"></div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
    </div>
</template>


<script>
import {
  timeZone
} from "@/utils/timeZone";
import moment from "moment";

export default {
    name: "fixedTime",
    props: {
        finalCheckedUsers: {
          type: Array,
          default: function() {
            return Array
          }
        },
        pushObj: {
          type: Object
        }
    },
    computed: {
      scheduleTime() {
        let now = new Date();
        let time = now.getTime() + 1000*60*60;
        return new Date(time);
      }
    },
    data() {
      return {
        timeZoneOptions: timeZone(),
        pickerOptions: {
          disabledDate: (time) => {
            return this.dealDisabledDate(time);
          }
        },
      }
    },
    created() {

    },
    methods: {
        dealDisabledDate(time) {
            if (new Date(time).getTime() > new Date().getTime()) {
              return time.getTime() <= (new Date().getTime()); //时间范围必须是时间戳
            } else {
              return time.getTime() <= Date.now() - 8.64e7; //8.64e7就是一天的时间戳 24*60*60*1000 两天之内 根据自己需求来定
            }
        },
        choiceTimeZone(idx, value) {
            let str;
            if (value.indexOf('=') != 0) {
              str = value.split('=')[0];
            }
            else {
              str = value
            }
            str = str.replace(/\(/g, '');
            let date = this.scheduleTime.toString();
            this.finalCheckedUsers[idx].schedulePicker = new Date(date.replace(/(\+[0-9]{4})|(\-[0-9]{4})/, str))
            this.finalCheckedUsers[idx].initScheduleTime = new Date(date.replace(/(\+[0-9]{4})|(\-[0-9]{4})/, str))
            this.finalCheckedUsers[idx].scheduleTime = new Date(date.replace(/(\+[0-9]{4})|(\-[0-9]{4})/, str))
            this.finalCheckedUsers[idx]._scheduleTime = moment(new Date(date.replace(/(\+[0-9]{4})|(\-[0-9]{4})/, str)).getTime()).format("HH:mm:ss")
            this.$emit('getTimeZone', this.finalCheckedUsers[idx], idx)
        },
        schedulePicker(idx, time) {
            if (new Date(time).getTime() > new Date().getTime()) {
                this.finalCheckedUsers[idx].initScheduleTime = '00:00:00'
            } else {
                this.finalCheckedUsers[idx].initScheduleTime = new Date()
                this.finalCheckedUsers[idx].scheduleTime = new Date(this.scheduleTime)
            }
            this.finalCheckedUsers[idx]._scheduleTime = null
            this.$emit('getPicker', this.finalCheckedUsers[idx], idx)
        },
    },
    
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";

//角標
@mixin aouthTypeIcon($top, $left, $width, $height, $raudis) {
    top: $top;
    left: $left;
    width: $width;
    height: $height;
    border-radius: $raudis;
    -webkit-border-radius: $raudis;
    -moz-border-radius: $raudis;
    -ms-border-radius: $raudis;
    -o-border-radius: $raudis;
}
.oauthType-badge{
    &{
      position: relative;
    }
  .badge {
      position: absolute;
      border:white solid 1px;
      z-index: 1000;
      &.twitter {
        background-color: rgb(10, 105, 248);
      }
      &.facebook {
        background-color: rgb(0, 60, 255);
      }
      &.google {
        background-color: $google;
        &.unauth {
          background-color: #ccc;
        }
      }
      @include aouthTypeIcon(-4px, 37px, 1em, 1em, 1em);
    }
  }
  .dialog-oauthType{
     &{
        position: relative;
        margin-right: 25px;
      }
    .badge {
        position: absolute;
        border:white solid 1px;
        z-index: 1000;
        &.twitter {
          background-color: rgb(10, 105, 248);
        }
        &.facebook {
          background-color: rgb(0, 60, 255);
        }
        &.google {
          background-color: $google;
          &.unauth {
            background-color: #ccc;
          }
        }
        @include aouthTypeIcon(-4px, 60px, 1em, 1em, 1em);
      }
  }
  .content-oauthType{
      &{
          position: relative;
      }
      .badge {
        position: absolute;
        border:white solid 1px;
        z-index: 1000;
        &.twitter {
          background-color: rgb(10, 105, 248);
        }
        &.facebook {
          background-color: rgb(0, 60, 255);
        }
        &.google {
          background-color: $google;
          &.unauth {
            background-color: #ccc;
          }
        }
        @include aouthTypeIcon(-4px, 30px, 0.8em, 0.8em, 0.8em);
      }
  }

  .schedule-wrap {
    .content-oauthType{
      &{
          position: relative;
          top:4px;
      }
    }
  }

  .schedule-wrap ::v-deep {
    table thead{
      height: 10px;
    }
    .el-input__inner {
      border:unset;
      border-radius: unset;
      border-bottom: 1px solid #DCDFE6;
      -webkit-border-radius: unset;
      -moz-border-radius: unset;
      -ms-border-radius: unset;
      -o-border-radius: unset;
      background-color: unset;
      width: 100%;
    }
    .el-input--medium .el-input__inner {
      padding:0;
      font-size: 12px;
      padding-left: 20px;
    }
    .el-input--prefix .el-input__inner {
      padding:0;
      padding-left: 20px;
    }
    .el-table th, .el-table tr{
      background-color: unset;
    }
    .el-input__icon {
      text-align: left;
    }
    .el-table td, .el-table th.is-leaf {
      border-bottom:unset;
    }
    .el-table, .el-table__expanded-cell {
      background-color: unset;
    }
    .el-select input{
      width: 100%;
    }
    .scheduleTime {
      .el-table .cell{
        margin-left: 10px;
      }
      input {
        width: 90%;
      }
    } 
    .schedulePicker {
      .el-table .cell{
        margin-left: 10px;
      }
      input {
        width: 90%;
      }
    }
    .scheduleTimeZone{
      .el-input__suffix{
        display: none;
      }
    }
    .el-table::before{
      height: 0;
    }
    .el-select .el-input.is-focus .el-input__inner{
      border-color: #DCDFE6;
    }
    .el-table__body-wrapper tbody tr td:last-child{
      .cell{
        margin:0px;
        padding: 0px;
      }
    }
  }

  .timeZonePosition{
    &{
      position: relative;
    }
    .timezone-icon{
      position: absolute;
      width: 20px;
      height: 18px;
      margin-top: 9px;
      background: url('../../../assets/images/timeZone.png') no-repeat center;
      background-size: 14px;
    }
    input{
      width: 100%;
      border: 1px solid rgb(10, 105, 248);
    }
  }

  .select-user-tips {
    color: #929292;
    font-size: 12px;
  }
  .isTopicTitleEmpty ::v-deep .el-input__inner{
    border: 1px solid #f56c6c;
  }

  .schedule-tips{
    color: #f56c6c;
    font-size: 12px;
  }
  .clear{
    clear: both;
  }

  .timer-wrap ::v-deep {
    .el-select {
      display: block;
    }
    .el-table .cell, 
    .el-table--border td:first-child .cell, 
    .el-table--border th:first-child .cell {
      padding-left: 0px;
    }
    .el-date-editor.el-input, 
    .el-date-editor.el-input__inner {
        width: 100%;
    }
  }
</style>