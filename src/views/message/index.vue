<template>
  <div class="leeMessage">
    <div class="page-title">消息中心</div>
    <div class="leeMessageAll">
      <div class="leeMessageSelect">
        <div class="left">
          <p class="main-text">共有{{total}}条消息</p>
          <div class="leeMessageSvalue">
            <el-select v-model="leeSelectValue" @change="changeSelect" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="right">
          <span @click="signHandle">标记为已读</span>
        </div>
      </div>
      <div class="leeMessageTable">
        <el-table
          :header-cell-style="getRowClass"
          ref="multipleTable"
          :data="leeMessageData"
          tooltip-effect="dark"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="content" label="消息" min-width="40%">
            <template slot-scope="scope">
              {{scope.row.content}}<span class="xianqing" @click="gotoSh(scope.row.type)" >[点击查看详情]</span>
            </template>
          </el-table-column>
          <el-table-column prop="item" label="消息类型" min-width="20%">
            <span>系统消息</span>
          </el-table-column>
          <el-table-column min-width="20%" prop="createTime" label="时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <!--翻页-->
      <pagination
        style="padding:10px"
        v-show="total > 0"
        :total="total"
        :page.sync="axiosData.page"
        :limit.sync="axiosData.size"
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
      <!--翻页-->
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getListNotice, readNotice } from "@/api/notice";
export default {
  name: "messages",
  components: { Pagination },
  data() {
    return {
      options: [
        {
          value: "",
          label: "全部消息状态"
        },
        {
          value: true,
          label: "已读"
        },
        {
          value: false,
          label: "未读"
        }
      ],
      leeSelectValue: "",
      leeMessageData: [],
      receiveId: "",
      multipleSelection: [],
      currentPage: "",
      total: 10,
      axiosData: {
        page: 1,
        size: 10,
        read: "",
        type: "",
        sort: "-createTime"
      }
    };
  },
  methods: {
    getRowClass({ row, rowIndex }) {
      return "background: #f2f2fe;color:#7e7ef4;";
    },
    //class
    tableRowClassName({ row, rowIndex }) {
      if (!row.read) {
        return "info-row";
      } else {
        return "info-norow";
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //标记为已读
    signHandle() {
      const newArry = [];
      this.multipleSelection.forEach(item => {
        if (!item.read) {
          newArry.push(item.id);
        }
      });
      this.sign(newArry);
    },
    //下拉选择
    changeSelect(val) {
      const newDate = Object.assign({}, this.axiosData, {
        read: val,
        page: 1
      });
      this.axiosData = Object.assign({}, this.axiosData, newDate);
      this.getList();
    },
    //跳转
    jumpPage() {
      if (this.currentPage != "" && typeof this.currentPage == "number") {
        const newDate = Object.assign({}, this.axiosData, {
          page: this.currentPage
        });
        this.axiosData = Object.assign({}, this.axiosData, newDate);
        this.getList();
        scrollTo(0, 800);
        this.currentPage = "";
      }
    },
    //标记已读
    sign(newArry) {
      let _this = this;
      if (!newArry.length) {
        this.$message({
          message: "请选择未读消息",
          type: "warning"
        });
        return;
      }
      readNotice({ letterIds: newArry })
        .then(function(response) {
          _this.getList();
          _this.$message({
            message: "标记消息成功",
            type: "success"
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //数据处理
    getList() {
      let _this = this;
      getListNotice(this.axiosData)
        .then(function(response) {
          _this.leeMessageData = response.data.response.list;
          _this.total = response.data.response.total;
          if (_this.leeMessageData.length) {
            _this.receiveId = response.data.response.list[0].receiveId;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //跳转路由
    gotoSh(type){
      if(type==1){
          this.$router.push("/postreview/submitter")        //1待审核
      }else if(type==2){
           this.$router.push("/pushlist/index")        //2.审核通过
      }else if(type==3){
            this.$router.push("/postreview/reviewer")         //3.审核拒绝  
      }else if(type==6){
            this.$router.push("/examinepodcast/index")         //6.待审（审核播客）
      }
      else if(type==4||type==5||type==7){
            this.$router.push("/podcast/index")         //4. 通过（我的播客）， 5拒绝（我的播客）下线（我的播客） 7新加的跳转位置
      }
      
    }
  },
  created() {
    //初始加载
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
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
.leeMessage {
  background-color: #f5f6fa;
  padding: 10px 46px;
  min-height: calc(100vh - 84px);
  .page-title {
    color: #47289b;
    font-size: 20px;
    font-family: "AppleGothic";
    line-height: 3;
  }
}
.leeMessageAll {
  background: #fff;
  padding: 24px 30px;
}
.xianqing{margin-left: 6px;color: rgb(126, 126, 244);cursor: pointer;}
.leeMessageSelect {
  background: #fff;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 26px;
  -moz-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -moz-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  height: 54px;
  .left {
    display: -ms-flexbox;
    display: flex;
    -moz-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    .main-text {
      font-size: 14px;
      font-weight: 400;
      margin-right: 20px;
      font-family: "MicrosoftYaHei";
      color: rgb(126, 126, 244);
    }
  }
  .right {
    color: rgb(126, 126, 244);
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
<style>
.leeMessageTable .el-table {
  font-size: 14px;
}
.leeMessageTable .el-table__header-wrapper .el-table--medium td,
.el-table--medium th {
  padding: 16px 0;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .info-row {
  height: 80px;
  font-weight: bold;
}
.el-table .info-row .cell,
.el-table .info-norow .cell {
  padding-left: 10px;
}
.el-table .info-norow {
  height: 80px;
}
</style>