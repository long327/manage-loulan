<template>
  <div>
    <el-row>
        <el-col :span="4" style="margin-top:15px;">
          音频({{ total }})
          <!-- <i class="el-icon-menu tabs" @click="lis" :class="{currentPicType: currentPicType}"></i>
                <i class="el-icon-s-grid tabs" @click="table" :class="{currentPicType: !currentPicType}"></i> -->
        </el-col>
      <el-col :span="20" style="text-align: right">
        <span style="display: inline-block">
          <el-input
            v-model="listQuery.keyword"
            placeholder="关键词"
            style="width: 200px; margin-top: 5px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button
            style="margin-top: 5px"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >搜索</el-button
          >
        </span>

        <span class="el-upload__tip" style="margin-right: 10px"
          >大小不超过300M，支持MP3格式</span
        >

        <el-upload
          class="local-upload"
          ref="upload"
          :data="uploadParams"
          :action="uploadUrl"
          accept="file"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeAudioUpload"
          :on-error="uploadError"
          :on-progress="uploadProgress"
          :on-success="handleSuccess"
          :with-credentials="true"
          :disabled="listLoading"
          multiple
          :limit="1"
          :on-exceed="handleExceedVideo"
          :file-list="fileList"
        >
          <!-- <el-button
            type="primary"
            class="primary"
            style="margin-left: 10px"
            :plain="listLoading"
            :disabled="listLoading"
          >
            <i class="el-icon-loading" v-show="listLoading"></i>
            上传音频
          </el-button> -->


          <el-button
            type="primary"
            class="primary"
            style="margin-left: 10px"
            :plain="listLoading"
            :disabled="listLoading"
          >
            <i class="el-icon-loading" v-show="listLoading"></i>
            上传音频
          </el-button>


        </el-upload>

        <!-- <el-button size="small" type="primary" @click="showVideoUpload">上传视频</el-button> -->
      </el-col>
    </el-row>
    <div>
      <el-table
        :key="tableKey"
        v-loading="videoLoading"
        :data="list"
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="音频"
          prop="title"
          align="left"
          width="300"
          height="300"
        >
          <template slot-scope="scope">
            <div class="video-wrap" v-if="scope.row.resourceType == 'AUDIO'">
              <audio
                class="audios"
                :src="scope.row.url"
                controls
                controlslist="nodownload"
              ></audio>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="auto">
          <template slot-scope="scope">
            <div v-show="scope.$index == isEdit">
              <el-input
                style="float: left; width: 150px"
                v-model="scope.row.title"
                class="edit-input"
                size="small"
              />
              <el-button
                style="margin-left: 15px; float: left"
                class="cancel-btn"
                size="small"
                type="text"
                @click="cancelEdit(scope.row)"
              >
                取消
              </el-button>
              <el-button
                class="submit-btn"
                style="margin-left: 10px; float: left"
                type="text"
                size="small"
                v-show="scope.$index == isEdit"
                @click="confirmEdit(scope.row)"
              >
                保存
              </el-button>

              <div style="clear: both"></div>
            </div>
            <div v-show="scope.$index != isEdit">{{ scope.row.title + scope.row.ext }}</div>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="300" align="center">
          <template slot-scope="scope">{{
            formatDate(scope.row.createdTime)
          }}</template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="auto"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              style="width: 50px"
              icon="el-icon-delete"
              @click="delePic(scope.row)"
            />
            <el-button
              style="width: 50px"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              v-show="scope.$index != isEdit"
              @click="picEdit(scope.$index, scope.row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box-center">
      <el-dialog
        title="音频上传进度"
        :visible.sync="show"
        :closed="dialogClose"
      >
        <template>
          <div v-for="(item, index) in uploadArr" :key="index">
            <div>{{ item.name }}</div>
            <el-progress :percentage="progressBar" :color="progressState">
            </el-progress>
          </div>
        </template>
      </el-dialog>
    </div>

    <pagination
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
import { getList, deletePics } from "@/api/resource";
import Rename from "@/mixins/RenameHandler"
// import { parseTime } from '@/utils'
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import moment from "moment";
const picOptions = [];
export default {
  name: "audios",
  components: { Pagination },
  mixins: [Rename],
  filters: {
    fileTypeFilter(type) {
      return fileTypeMap[type];
    },
  },
  data() {
    return {
      fileTypeMap: {
        IMAGE: "图片",
        VIDEO: "视频",
        AUDIO: "音频",
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      videoLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: "",
        resourceType: "AUDIO",
      },
      show: false,
      showVideo: false,
      activeName: "first",
      uploadUrl: `${process.env.VUE_APP_BASE_API}/resource/upload`,
      fileList: [],
      srcList: [],
      checked: -1,
      currentPicType: true,
      isEdit: -1,
      active: true,
      picTitle: "",
      layout: true,
      isDelete: false,
      current: false,
      cheackAllChecked: false,
      checkArr: [],
      checkCompleteArr: [],
      currentPage: "",
      uploadArr: [],
      progressBar: 0,
      progressState: "#67c23a",
      uploadParams: {
        duration: 0,
        width: 0,
        height: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    lis() {
      this.layout = true;
      this.currentPicType = !this.currentPicType;
      this.getList();
    },
    table() {
      this.layout = false;
      this.currentPicType = !this.currentPicType;
      this.getList();
    },
    handleClick(tab, event) {
      if (tab.label == "音频") {
        this.listQuery.resourceType = "AUDIO";
      } else {
        this.listQuery.resourceType = "IMAGE";
      }
      this.getList();
    },
    regexp(str) {
      return (/([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,}$/.test(str));
    },

    //音频上传之前
    beforeAudioUpload(file) {
      // 文件类型进行判断
      const isAudio = file.type === "audio/mp3" || file.type === "audio/mpeg";
      // 限制上传文件大小 300M
      const isLt300M = file.size / 1024 / 1024 <= 300;
      // const isTime60S = this.audioDuration >= 60 ? true : "";

      if (!isAudio) {
        this.$message.error("上传文件只能是Mp3格式!");
        return false;
      } else {
        if (!isLt300M) {
          this.$message.error("上传文件大小不能超过 300MB!");
          return false;
        }
      }
      this.listLoading = true;
      this.uploadArr.push(file);
      // 获取时长
      this.getTimes(file);
      this.show = true;
      return isAudio && isLt300M;
    },
    getTimes(file) {
      let that = this;
      var content = file;
      //获取时长
      var url = URL.createObjectURL(content);
      var audioElement = new Audio(url);
      audioElement.addEventListener("loadedmetadata", (_event) => {
        // that.uploadParams.duration = audioElement.duration;
        // console.log(this.audioDuration);
      });
    },

    //上传
    handleSuccess(res, file) {
      this.listLoading = false;
      this.progressState = "success";

      this.getList();
      this.show = false;
      this.fileList = [];
      setTimeout(() => {
        this.progressBar = 0;
        this.progressState = "";
        this.uploadArr = [];
      }, 500);
    },

    //删除
    delePic(item) {
      this.$confirm("删除后，该音频在播客中将无法播放。确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePics({ id: item.id })
            .then(() => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
            })
            .catch((ex) => {
              this.$alert(ex, "错误", {
                confirmButtonText: "确定",
              });
            });
        })
        .catch(() => {});
    },

    //卡片选择
    cardSelect(item) {
      debugger;
    },
    //关闭对话框
    dialogClose() {
      this.fileList = [];
      this.show = false;
      this.uploadArr = [];
      this.progressBar = 0;
      this.progressState = "";
    },
    //table
    confirmEdit(row) {
      this.saveEdit(row);
    },
    uploadProgress(ev, file, fileList) {
      this.progressBar = Math.floor(ev.percent);
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.list : [];
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceedVideo(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    uploadError() {
      this.listLoading = false;
      this.progressState = "#f56c6c";
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    _successed(file, fileList) {
      this.getList();
      this.fileList = [];
      this.showVideo = false;
    },
    _handleRemove(file) {},
    beforeVideoUpload(file) {
      this.listLoading = true;
      const isLt300M = file.size / 1024 / 1024 <= 300;
      if (
        ["video/mp4", "video/mov", "video/quicktime"].indexOf(file.type) == -1
      ) {
        this.listLoading = false;
        this.$message.error("请上传正确的音频格式");
        return false;
      }
      if (!isLt300M) {
        this.$message.error("上传音频大小不能超过300MB哦!");
        this.listLoading = false;
        return false;
      }
      this.show = true;
      file.num = 0;
      this.uploadArr.push(file);
    },
    toggleShow() {
      this.show = !this.show;
    },
    showVideoUpload() {
      this.showVideo = !this.showVideo;
    },
    getList() {
      this.videoLoading = true;
      this.isEdit = -1;
      getList(this.listQuery)
        .then((response) => {
          this.list = response.list;
          this.total = response.total;
          this.list.forEach((item, idx) => {
            this.srcList.push(item.url);
            picOptions.push(item.url);
          });
          // Just to simulate the time of the request
          setTimeout(() => {
            this.videoLoading = false;
          }, 0.5 * 1000);
        })
        .catch((msg) => {
          this.videoLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    formatDate(time) {
      let _time = new Date(time).getTime();
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    //全选
    checkAllFun() {
      var _this = this;
      this.checkArr = [];
      if (this.cheackAllChecked) {
        this.list.forEach(function (item, index) {
          if (index >= 0) {
            _this.checkArr.push(item.id);
          }
        });
      }
      this.isDelete = true;
    },
    //反选
    reverseChecked() {
      var changeArr = [];
      this.list.forEach(function (item, index) {
        if (index >= 0) {
          changeArr.push(item.id);
        }
      });
      this.removeByValue(changeArr, this.checkArr);
    },
    //反选过滤函数
    removeByValue(changearr, checkarr) {
      var _this = this;
      for (var j = 0; j < checkarr.length; j++) {
        for (var i = 0; i < changearr.length; i++) {
          if (changearr[i] === checkarr[j]) {
            changearr.splice(i, 1);
            break;
          }
        }
      }
      this.checkArr = changearr;
      if (changearr.length <= _this.checkCompleteArr.length) {
        this.cheackAllChecked = false;
      }
      if (changearr.length === _this.checkCompleteArr.length) {
        this.cheackAllChecked = true;
      }
    },
    //选项的change事件
    changevalue() {
      var _this = this;
      if (this.checkArr.length <= _this.checkCompleteArr.length) {
        this.cheackAllChecked = false;
      }
      if (this.checkArr.length === this.list.length) {
        this.cheackAllChecked = true;
      } else {
        this.cheackAllChecked = false;
      }
      if (this.checkArr.length > 0) {
        this.isDelete = true;
      } else {
        this.isDelete = false;
      }
    },
    //全选或反选用到的完整数组值
    mounted() {
      var _this = this;
      this.list.forEach(function (item, index) {
        if (index >= 0) {
          _this.checkCompleteArr.push(item.id);
        }
      });
    },
    //选项删除
    checkAllDelete() {
      let _this = this;
      this.$confirm("确定要删除该音频吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.checkArr.forEach((item, idx) => {
            setTimeout(() => {
              deletePics({ id: item })
                .then(() => {
                  this.$notify({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                    duration: 1000,
                  });
                  _this.getList();
                })
                .catch((ex) => {
                  this.$notify.error({
                    title: "失败",
                    message: "删除失败",
                  });
                });
            }, 1000);
          });
        })
        .catch(() => {});
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
.video-wrap ::v-deep {
  audio {
    max-width: 100%;
    max-height: 300px;
    object-fit: cover;
  }
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