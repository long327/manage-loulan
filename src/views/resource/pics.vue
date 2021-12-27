<template>
  <div v-loading="listLoading">
    <div class="nav-bar">
      <el-row class="header-fun">
        <el-col :span="4">
          图片({{ total }})
          <!-- <i class="el-icon-menu tabs" @click="lis" :class="{currentPicType: currentPicType}"></i>
                <i class="el-icon-s-grid tabs" @click="table" :class="{currentPicType: !currentPicType}"></i> -->
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-input
            v-model="listQuery.keyword"
            placeholder="关键词"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >搜索</el-button
          >

          <span class="tips">大小不超过5M，支持jpg、png格式</span>
          <el-upload
            class="local-upload"
            ref="upload"
            :action="uploadUrl"
            accept=".png,.jpg"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-progress="filesProgress"
            :with-credentials="true"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button type="primary" class="primary" style="margin-left: 10px">
              本地上传
            </el-button>
          </el-upload>
          <!-- <el-button @click="toggleShow" type="primary" class="primary" style="margin-left:10px">本地上传</el-button> -->
        </el-col>
      </el-row>
      <el-row class="checkbox-bar">
        <el-col style="padding-left: 10px">
          <el-checkbox v-model="cheackAllChecked" @change="checkAllFun"
            >全选</el-checkbox
          >
          <el-button
            size="mini"
            v-model="cheackAllChecked"
            @click="checkAllFunCancel"
            v-if="checkArr.length > 0"
            style="margin-left: 10px"
            >取消选择</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="checkAllDelete"
            v-show="isDelete"
            style="margin-left: 10px"
            >删除图片</el-button
          >
        </el-col>
        <!-- <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->

        <!-- <span @click="reverseChecked">反选</span> -->
      </el-row>
    </div>


    <div class="lis-container container" v-if="layout">
      <el-row>
        <el-col
          v-for="(item, index) in list"
          :key="item.id"
          class="pic-card"
          style="margin: 0px 5px 30px 0px; width: 200px"
        >
          <el-card
            :body-style="{ padding: '0px', height: '230px' }"
            :class="{ checkedShow: item.checked }"
            @click.native="changevalue(item, item.checked)"
            v-if="list.length"
          >
            <div class="pics-box el-card">
              <div class="block">
                <div class="checkbox">
                  <el-checkbox
                    class="checked"
                    v-model="checkArr"
                    :label="item.id"
                    @change="changevalue"
                  ></el-checkbox>
                  <el-button
                    type="danger"
                    icon="el-icon-close"
                    circle
                    size="mini"
                    @click="delePic(item)"
                  ></el-button>
                  <div class="clear"></div>
                </div>
                <div class="pic-box" style="text-align: center">
                  <el-image
                    class="elImg-box"
                    :src="item.url + '?x-oss-process=image/resize,h_100,m_lfit'"
                    :preview-src-list="getSrcList(index)"
                    :lazy="true"
                    cover
                    @click="alert(123)"
                  >
                    <span slot="placeholder">
                      <i class="el-icon-picture-outline"></i>
                    </span>
                  </el-image>
                  <!-- <i class="el-icon-zoom-in i-zoom" @click="getPreview()"></i>
                        <i class="el-icon-delete i-delete" @click="delePic(item)"></i> -->
                </div>
              </div>

              <div class="pic-title" :class="{ current: current }">
                <span v-show="index == isEdit">
                  <el-input
                    v-model="item.title"
                    class="edit-input"
                    size="mini"
                  />
                  <el-button
                    class="save-btn"
                    size="mini"
                    type="text"
                    @click="saveEdit(item, index)"
                  >
                    保存
                  </el-button>
                  <el-button
                    class="cancel-btn"
                    size="mini"
                    type="text"
                    @click="cancelEdit(item, index)"
                  >
                    取消
                  </el-button>
                </span>
                <div style="position: relative">
                  <a
                    class="show-title"
                    :title="item.title"
                    v-show="index !== isEdit">
                    {{ item.title + item.ext }}
                  </a>
                  <i
                    class="el-icon-edit"
                    v-bind:class="{ active: active }"
                    @click="picEdit(index, item)"
                  ></i>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="table-container container" v-else>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        stripe
        style="width: 100%"
      >
        <el-table-column label="选项" prop="title" align="left" width="50">
          <template slot-scope="scope">
            <el-checkbox
              v-model="checkArr"
              :label="scope.row.id"
              @change="changevalue"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          label="图片"
          prop="title"
          align="center"
          width="200"
          height="300"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.resourceType === 'IMAGE'">
              <el-image
                :src="scope.row.url"
                :alt="scope.row.title"
                :preview-src-list="srcList"
              >
                <div slot="placeholder" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="280">
          <template slot-scope="scope">
            <span v-show="scope.$index == isEdit">
              <el-input
                v-model="scope.row.title"
                class="edit-input"
                size="small"
              />
              <el-button
                style="margin-left: 15px"
                class="cancel-btn"
                size="small"
                type="text"
                @click="_cancelEdit(scope.row)"
              >
                取消
              </el-button>
              <el-button
                style="margin-left: 10px"
                size="small"
                type="text"
                v-show="scope.$index == isEdit"
                @click="confirmEdit(scope.row)"
              >
                保存
              </el-button>
            </span>
            <span v-show="scope.$index != isEdit">{{ scope.row.title + scope.row.ext}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="260" align="center">
          <template slot-scope="scope">{{
            formatDate(scope.row.createdTime)
          }}</template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
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
              @click="editPic(scope.$index)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- <div class="box-center">
      <el-dialog title="图片上传进度" :visible.sync="show" :closed="dialogClose">
        <template>
          <div 
            v-for="(item, index) in uploadArr"
            :key="index">
            <p>{{item.name}}</p>
            <el-progress 
             :percentage="item.num"
             status="success">
            </el-progress>
          </div>
        </template>
      </el-dialog>
    </div> -->

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
          <el-button
            class="jumpPage"
            @click="jumpPage"
          >
              跳转
          </el-button>
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
  name: "pics",
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
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: "",
        resourceType: "IMAGE",
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
      imgType:'',
      layout: true,
      isDelete: false,
      current: false,
      cheackAllChecked: false,
      checkArr: [],
      checkCompleteArr: [],
      resData: null,
      currentPage: "",
      uploadArr: [],
      uploadProgress: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getSrcList(index) {
      let tempImgList = [...this.srcList];
      if (index === 0) return tempImgList;
      let start = tempImgList.splice(index);
      let remain = tempImgList.splice(0, index);
      return start.concat(remain);
    },
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
      if (tab.label == "视频") {
        this.listQuery.resourceType = "VIDEO";
      } else {
        this.listQuery.resourceType = "IMAGE";
      }
      this.getList();
    },
    //图片上传
    handleSuccess(res, file) {
      this.getList();
      // this.show = false;
      this.fileList = [];
    },
    //删除图片
    delePic(item) {
      this.$confirm("确定要删除该图片吗?", "提示", {
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
    },
    //table
    _cancelEdit(row) {
      this.isEdit = -1;
    },
    confirmEdit(row) {
      this.saveEdit(row);
    },
    editPic(idx) {
      this.isEdit = idx;
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
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件`);
      // this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {

      this.show = true;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return;
      }
      file.num = 0;
      this.uploadArr.push(file);
      return (isJPG || isPNG) && isLt5M;
      
    },
    filesProgress(ev, file, fileList) {

    },
    _successed(file, fileList) {
      this.getList();
      this.fileList = [];
      this.showVideo = false;
    },
    _handleRemove(file) {},
    toggleShow() {
      this.show = !this.show;
    },
    getList() {
      this.listLoading = true;
      this.isEdit = -1;
      this.cheackAllChecked = false;
      this.checkArr = [];
      this.srcList = [];
      this.isDelete = false;
      getList(this.listQuery)
        .then((response) => {
          response.list.forEach((item) => {
            item.checked = false;
          });
          this.resData = response;
          this.list = response.list;
          this.total = response.total;
          this.list.forEach((item, idx) => {
            this.srcList.push(item.url);
            picOptions.push(item.url);
          });
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 0.5 * 1000);
        })
        .catch((msg) => {
          this.listLoading = false;
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
          item.checked = true;
        });
        this.isDelete = true;
      } else {
        this.isDelete = false;
      }
    },
    //取消全选
    checkAllFunCancel() {
      console.log(this.checkArr);
      if (this.checkArr.length) {
        this.checkArr = [];
        this.list.forEach(function (item, index) {
          item.checked = false;
        });
        this.cheackAllChecked = false;
        this.isDelete = false;
      }
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
      let flag = 0;
      let totalPage;
      this.$confirm("确定要删除选中图片吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.resData.total > this.resData.size) {
            totalPage = Math.ceil(this.resData.total / this.resData.size);
          }

          this.checkArr.forEach((item, idx) => {
            setTimeout(() => {
              deletePics({ id: item })
                .then(() => {
                  if (this.checkArr.length - 1 == idx) {
                    if (
                      this.list.length == this.checkArr.length &&
                      totalPage == this.listQuery.page
                    ) {
                      //全删
                      this.listQuery.page = totalPage - 1;
                    }
                    this.$notify({
                      title: "成功",
                      message: "删除成功",
                      type: "success",
                      duration: 1000,
                    });
                    _this.getList();
                  }
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
@import "./index.scss";

.lis-container ::v-deep .el-image-viewer__wrapper {
  .el-image-viewer__prev {
    left: 20%;
  }
  .el-image-viewer__next {
    right: 20%;
  }
  .el-image-viewer__next, .el-image-viewer__prev {
    top: 50%;
    width: 45px;
    height: 45px;
    font-size: 24px;
    color: #7E7EF4;
    background-color: #fff;
    border-color: #fff;
    font-weight: 600;
  }
  .el-image-viewer__next:hover, .el-image-viewer__prev:hover {
    color: #fff;
    background-color: #7E7EF4;
  }
  .el-image-viewer__mask {
    opacity: .7;
  }
  .el-image-viewer__close {
    top: 40px;
    right: 20%;
    width: 60px;
    height: 60px;
    font-size: 60px;
  }
}
</style>
