<template>
  <div>
    <el-dialog
      title="从我的素材库选择图片"
      :visible.sync="localDialogVisible"
      @close="cancelPics"
      @open="getList"
      width="970px"
      top="8vh"
    >
      <div class="lis-container" v-loading="listLoading">
        <el-row style="padding: 20px 0px">
          <el-col :span="12" style="text-align: left">
            <i class="el-icon-warning" style="color: #dcd92b"></i>
            最多可以选9张图片，当前已选中<span
              style="color: #7e7ef4; font-weight: 600"
            >
              {{ diaTitle }} </span
            >张
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-input
              v-model="picslistQuery.keyword"
              placeholder="关键词"
              style="width: 200px; margin-top: -5px"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <el-button
              style="margin-left: 10px"
              type="primary"
              @click="searchMaterial"
              >搜索</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col
            v-for="(item, index) in picsList"
            :key="index"
            style="margin: 0px 5px 30px 0px; width: 178px"
          >
            <el-card
              :body-style="{
                padding: '0px',
                height: '216px',
                position: 'relative',
                zIndex: '10',
              }"
              :class="{ checked: item.checked }"
              v-model="item.checked"
              @click.native="clickvalue(item, item.checked)"
            >
              <div class="pics-box">
                <div class="block">
                  <div class="checkbox">
                    <el-checkbox
                      style="
                        margin-top: -2px;
                        z-index: 2000;
                        position: relative;
                        opacity: 0;
                        visibility: hidden;
                      "
                    ></el-checkbox>
                    <!-- <el-button type="danger" icon="el-icon-close" circle size="mini" @click="delePic(item)"></el-button> -->
                    <div class="clear"></div>
                  </div>
                  <div class="pic-box">
                    <el-image :src="item.url + '?x-oss-process=image/resize,h_100,m_lfit'">
                      <div slot="placeholder" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
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
                  <a
                    class="show-title"
                    :title="item.title"
                    v-show="index !== isEdit"
                    >{{ item.title }}</a>

                  <!-- <i
                        class="el-icon-edit"
                        v-bind:class="{ active: active }"
                        @click="picEdit(index, item)"
                    ></i> -->
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
         
        <pagination
          v-show="total > 0"
          class="pagination-wrap"
          :total="total"
          :page.sync="picslistQuery.page"
          :layout="'total, prev, pager, next, slot'"
          :limit.sync="picslistQuery.limit"
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

        <div class="submit">
          <el-row type="flex" justify="center">
            <el-col :span="12" style="text-align: right; margin-right: 50px">
              <el-button round @click="determinePics"
                >取消</el-button>
            </el-col>
            <el-col :span="12" style="margin-left: 50px">
              <el-button round type="primary" @click="cancelPics">确定</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getList, putPic, deletePics } from "@/api/resource";
var checkedArr = [];
export default {
  name: "imgLib",
  components: {
      Pagination  
  },
  props: {
    checkedUsers: {
        type: Array,
        default: []
    },
    fileListGifImgs: {
      type: Array,
      default: function() {
        return Array
      }
    },
    fileListImgs: {
      type: Array,
      default: function() {
        return Array
      }
    }

  },
  data() {
    return {
      currentPage: "",
      listLoading: true,
      isEdit: -1,
      localDialogVisible: false,
      picTitle: "",
      checkArr: [],
      cheackAllChecked: false,
      diaTitle: "",
      picsList: [],
      checkCompleteArr: [],
      active: true,
      current: false,
      total: 0,
      picslistQuery: {
        page: 1,
        limit: 10,
        keyword: "",
        resourceType: "IMAGE",
      },
      
    };
  },
  watch: {
    fileListGifImgs(nv, ov) {
      this.diaTitle = nv.length + this.fileListImgs.length;
    },
    fileListImgs(nv, ov) {
      this.diaTitle = nv.length + this.fileListGifImgs.length;
    }
  },
  methods: {
    openDialog() {
        this.localDialogVisible = true;
    },
    //选项的change事件
    arrSlice(val, index) {
      if (val) {
        return val.slice(0, index).concat(val.slice(index + 1, val.length));
      }
    },
    clickvalue(item, flag) {

      let total = 8;
      let checkedUsers = JSON.parse(JSON.stringify(this.checkedUsers));
      if (this.fileListImgs.length + this.fileListGifImgs.length > total) {
        if (flag) {
        } else {
          this.$message({
            message: "图片最多是9张",
            type: "warning",
          });
          return false;
        }
      }

      this.picsList.forEach((val) => {
        if (val.id == item.id && flag == false) {
          val.checked = true;
          if (val.url.indexOf(".gif") != -1) {
            checkedUsers.forEach((item) => {
              item.mediaType = "2";
            });
            val.mediaType = "2";
            this.fileListGifImgs.push(val)
            // this.fileListGifImgs.push({
            //   name: val.title,
            //   url: val.url,
            //   id: val.id,
            //   checked: val.checked,
            //   mediaType: "2",
            // });
          } else {
            checkedUsers.forEach((item) => {
              item.mediaType = "1";
            });
            val.mediaType = "1";
            this.fileListImgs.push(val)
            // this.fileListImgs.push({
            //   name: val.title,
            //   url: val.url,
            //   id: val.id,
            //   checked: val.checked,
            //   mediaType: "1",
            // });
          }
        }
        if (val.id == item.id && flag) {
          val.checked = false;
          this.fileListImgs.forEach((item, idx) => {
            if (item.id == val.id) {
              item.checked = false;
              // this.fileListImgs = this.arrSlice(this.fileListImgs, idx);
              this.$emit('chFileListImgs', this.arrSlice(this.fileListImgs, idx))
            }
          });

          //gif
          this.fileListGifImgs.forEach((item, idx) => {
            if (item.id == val.id) {
              item.checked = false;
              // this.fileListGifImgs = this.arrSlice(this.fileListGifImgs, idx);
              this.$emit('chFileListGifImgs', this.arrSlice(this.fileListGifImgs, idx))
            }
          });
        }
      });
      this.finalCheckedUsers = checkedUsers;
    },
    //获取图片资源
    getList() {
      this.listLoading = true;
      this.isEdit = -1;

      getList(this.picslistQuery)
        .then((response) => {
          //初始化数据
          response.list.forEach((item) => {
            item.checked = false;
          });

          response.list.forEach((item) => {
            this.fileListImgs.forEach((val) => {
              if (item.id == val.id) {
                item.checked = val.checked;
              }
            });
            this.fileListGifImgs.forEach((val) => {
              if (item.id == val.id) {
                item.checked = val.checked;
              }
            });
          });

          this.diaTitle =
            this.fileListImgs.length + this.fileListGifImgs.length;
          this.picsList = response.list;
          this.total = response.total;

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
      this.picslistQuery.page = 1;
      this.getList();
    },
    //取消重命名
    cancelEdit(item) {
      this.current = false;
      this.isEdit = -1;
      this.active = true;
      item.title = this.picTitle;
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
    //编辑重命名
    picEdit(idx, item) {
      this.picTitle = item.title;
      this.isEdit = idx;
      this.active = true;
      this.current = true;
    },
    //图片重命名
    saveEdit(item) {
      let param = {
        id: item.id,
        url: item.url,
        title: item.title,
        description: item.description,
        tags: item.tags,
        public: item.public,
      };
      let currentLen;
      /*中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算*/
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      let mat = item.title.match(cnReg);
      let length = 0;
      if (mat) {
        currentLen = mat.length * 2 + (item.title.length - mat.length);
      } else {
        currentLen = item.title.length;
      }
      if (currentLen > 50) {
        this.$message.warning("名字长度不能超过50字");
        return;
      }
      putPic(param)
        .then((response) => {
          this.$message.success("成功");
        })
        .catch((msg) => {
          this.$message.error("失败");
        });

      this.isEdit = -1;
      this.active = false;
      this.current = false;
    },
    //dialog 确定
    determinePics() {
      var obj = {};
      checkedArr = checkedArr.reduce(function (item, next) {
        obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
        return item;
      }, []);

      ////////
      if (this.fileListImgs.length > 9) {
        this.exceed();
        return;
      }
      if (this.fileListImgs.length > 0 || this.fileListGifImgs.length > 0) {
        this.$emit('showuploadImg', 'image');
      }

      /*
        if (checkedArr.length > 8) {
            this.exceed();
            return;
        }

        if (this.fileListImgs.length < 9) {
            checkedArr.forEach((item, idx) => {
            this.fileListImgs.push({ name: item.title, url: item.url, id: item.id, checked: true });
            this.pushObj.resourcesUrl.push(item.url);
            this.showuploadImg = "image";
            this.showupload = "image";
            });
        }
    */
      this.localDialogVisible = false;
    },
    //dialog 取消
    cancelPics() {
      this.checkArr = [];
      checkedArr = [];
      this.picslistQuery.keyword = "";
      this.localDialogVisible = false;
      this.$emit('closeDialog', false)
    },
    //素材搜索
    searchMaterial() {
      this.picslistQuery.page = 1;
      this.getList();
    },
    jumpPage() {
      if (this.currentPage != "" && typeof this.currentPage == 'number') {
        this.picslistQuery.page = this.currentPage;
        this.getList()
        scrollTo(0, 800)
        this.currentPage = ""
      }
    }
  },
};
</script>

<style lang="scss" scoped>

// 素材库
  .pics-box .el-button--mini.is-circle {
    // display: none;
    padding: 2px;
    float: right;
  }
  
  .cell:hover .el-button--mini.is-circle {
    display: inline;
  }
  .el-dialog__wrapper ::v-deep .el-dialog__body {
    padding: 1em 1em;
  }
  
  .lis-container .pics-box .el-image ::v-deep img {
    object-fit: contain;
    max-width: 188px;
    max-height: 148px;
  }
  .lis-container {
    position: relative;
  }
  .upload {
    text-align: center;
  }
  .lis-container {
    .pic-title {
      padding: 6px 14px;
      text-align: center;
    }
    .checkbox {
      text-align: left;
      margin-bottom: 5px;
    }
    .checkbox button {
      visibility: hidden;
    }
    .checkbox:hover button {
      visibility: visible;
    }
    .pic-box {
      height: 160px;
      vertical-align: middle;
    }
    .pic-box img {
      min-width: 200px;
      height: 160px;
    }
    .pics-box .pic-box {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: justify;
    }
    .show-title {
      display: inline-block;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .el-input {
      position: relative;
      font-size: 14px;
      display: inline-block;
      width: 70%;
      height: 20px;
    }
    .el-button--mini,
    .el-button--small {
      font-size: 12px;
      border-radius: 3px;
      width: 10%;
    }
  
    .el-button--mini,
    .el-button--mini.is-round {
      padding: 7px 7px;
    }
  }
  .lis-container .pics-box ::v-deep .el-input--mini .el-input__inner {
    height: 20px;
    line-height: 20px;
  }
  .lis-container.pic-title i.el-icon-edit {
    display: none;
  }
  .lis-container .pic-title:hover i.el-icon-edit {
    display: inline-block;
  }
  
  .lis-container ::v-deep .pic-title.current:hover i.el-icon-edit {
    display: none;
  }
  .lis-container .pic-title ::v-deep i.active {
    margin-left: 10px;
    display: none;
    cursor: pointer;
  }
  .nav-bar {
    line-height: 100px;
  }
  .nav-bar {
    .tabs {
      cursor: pointer;
    }
  }
  .lis-container .table-container img {
    object-fit: contain;
    max-width: 100px;
    max-height: 100px;
    vertical-align: middle;
  }
  .lis-container .table-container .img-title-table {
    display: inline-block;
    width: 80%;
    text-align: right;
  }
  .lis-container .el-tabs__active-bar {
    width: 40px;
  }

  $font: 18px;
  $color333: #333333;
  
  .lis-container .tips {
    color: $color333;
    font-size: (24px/2);
  }
  .lis-container ::v-deep {
    #tab {
      &-first {
        font-size: $font;
      }
      &-second {
        font-size: $font;
      }
    }
    .videos {
      width: 230px;
      height: auto;
    }
  }
  .submit-btn ::v-deep span {
    margin: 0px;
  }
  .lis-container::v-deep .pics-box .el-checkbox__label,
  .lis-container ::v-deep .table-container .el-checkbox__label {
    display: none;
  }

  $color7e: #7E7EF4;
  .title{
    color:$color7e;
    font-weight: 600;
  }
  .isPhone{
    color: $color7e;
  }

  .local-upload ::v-deep{
    &{
      display: inline-block;
    }
    .el-upload-list{
      display: none!important;
    } 
  }
  .cardUpload-wrap ::v-deep .el-upload--picture-card{
    display: none;
  }


  .checked{
    border:1px solid #7E7EF4;
    cursor: pointer;
  }


  
  
 $fontColor606266:#606266;
 $fontWeight500:500;
 .pagination-container ::v-deep {
   &{
     margin:0;
   }
   .input-wrap-currentPage{
     & {
       display: inline-block;
       font-size: 14px;
       color: $fontColor606266;
       font-weight: $fontWeight500;
       margin-left: 16px;
       text-align: center;
     }
     span:last-child{
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
   .jumpPage-wrap{
     & {
       display: inline;
     }
     .jumpPage{
       & {
         font-weight: $fontWeight500;
         color: $fontColor606266;
       }
     }
   }
 }

</style>