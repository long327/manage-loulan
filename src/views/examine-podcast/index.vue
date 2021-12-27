<template>
  <div class="app-container">
    <div class="title fl">播客审核</div>
    <div class="filter-container fl">
      <div class="right">
        <el-input
          style="width: 200px;margin-right:1em"
          placeholder="关键词"
          prefix-icon="el-icon-search"
          @keyup.enter.native="search"
          v-model="listQuery.keyword">
        </el-input>
        <el-select v-model="value" 
          placeholder="全部" 
          @change="auditStatus"
          :clearable="true">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div class="clear"></div>
    </div>
    <div class="mytable">
      <el-table
        class="mytable"
        :key="tableKey"
        v-loading="listLoading"
        :data="listData"
        :border="false"
        header-cell-class-name="tb-header"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column 
            label="专辑"
            align="center" 
            width="230"
        >
          <template slot-scope="scope">
            <div class="fl">
              <el-avatar
                style="margin-left:20px;"
                :size="40"
                :src="scope.row.cover"
                :class="scope.row.unAuthorized ? 'unauth' : ''"
              />
            </div>

            <div class="fl" style="margin-left: 20px">
              <div>
                <a
                 class="table-title" 
                 :title="scope.row.title"
                >
                    {{ scope.row.title }}
                </a>
                <i
                  v-if="false"
                  class="el-icon-edit-outline"
                  @click="editName(scope.$index, scope.row)"
                ></i>
              </div>
              <div class="source">{{ scope.row.source }}</div>
            </div>
            <div class="clear"></div>
          </template>
        </el-table-column>
        <el-table-column label="摘要" align="center">
          <template slot-scope="scope">
            <span
              style="
                text-align: left;
                display: inline-block;
                vertical-align: middle;
              "
              >{{ scope.row.summary }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="单集数" align="center" width="100">
          <template slot-scope="scope">
            <!-- <router-link
              :to="{
                path: './channel',
                query: {
                  title: scope.row.title,
                  type: scope.row.type,
                  channelId: scope.row.id,
                },
              }"
              >{{ scope.row.counts }}</router-link
            > -->
            <span>{{ scope.row.counts }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            align="center"
            width="100"
        >   
          <template slot-scope="scope">
              <!-- <div v-if="1">
                  <span>已下线</span>
                  <el-tooltip placement="top" effect="light">
                      <div slot="content">多行信息<br/>第二行信息</div>
                      <i class="el-icon-question"></i>
                  </el-tooltip>
              </div> -->
              <div v-if="scope.row.auditType == 0 || scope.row.auditType == 4 || scope.row.auditType == 5">
                  <span>待审核</span>
              </div>
              <div v-else-if="scope.row.auditType == 2">
                  <span>已拒绝</span>
              </div>
              <div v-else-if="scope.row.auditType == 1">
                  <span>已上线</span>
              </div>
              <div v-else-if="scope.row.auditType == 3">
                  <span>已下线</span>
              </div>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
              <div v-if="scope.row.auditType == 1">
                <el-button type="text"
                  @click="dialogAuditState(scope.row, 3)"
                >下线</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    class="js-copy"
                    data-clipboard-action="copy"
                    :data-clipboard-text="file_url"
                    @click="handleCopy(scope.$index, scope.row)"
                  >
                    复制xml地址
                  </el-button>
              </div>
              <div v-if="scope.row.auditType == 0">
                  <el-button type="text"
                     @click="dialogAuditState(scope.row, 1)"
                  >上线</el-button>
                  <el-button type="text"
                     style="color:red;"
                     @click="dialogAuditState(scope.row,  2)"
                  >拒绝</el-button>
              </div>
              <div v-if="scope.row.auditType == 4">
                  <el-button type="text"
                     @click="dialogAuditState(scope.row, 1)"
                  >上线</el-button>
                  <el-button type="text"
                     style="color:red;"
                     @click="dialogAuditState(scope.row,  4)"
                  >拒绝</el-button>
              </div>
              <div v-if="scope.row.auditType == 5">
                  <el-button type="text"
                     @click="dialogAuditState(scope.row, 1)"
                  >上线</el-button>
                  <el-button type="text"
                     style="color:red;"
                     @click="dialogAuditState(scope.row,  2)"
                  >拒绝</el-button>
              </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog
      title="专辑信息"
      width="600px"
      :visible.sync="showDialog"
      @close="closeDialog('ruleForm')"
    >
      <el-row>
        <el-col :span="14">
          <el-form
            :model="myPodcastInfo"
            :rules="rules"
            ref="ruleForm"
            class="myPodcastInfo"
          >
            <el-form-item prop="title">
              <el-input
                v-model="myPodcastInfo.title"
                placeholder="标题"
              ></el-input>
            </el-form-item>
            <el-form-item prop="source">
              <el-input
                v-model="myPodcastInfo.source"
                placeholder="来源"
              ></el-input>
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="myPodcastInfo.email"
                placeholder="邮件"
              ></el-input>
            </el-form-item>
            <el-form-item prop="copyright">
              <el-input
                v-model="myPodcastInfo.copyright"
                placeholder="版权"
              ></el-input>
            </el-form-item>

            <el-form-item prop="summary">
              <el-input
                type="textarea"
                v-model="myPodcastInfo.summary"
                placeholder="摘要"
              ></el-input>
            </el-form-item>

            <el-col :span="7">
              <el-form-item prop="lan">
                <el-select v-model="myPodcastInfo.lan" placeholder="语言">
                  <el-option
                    v-for="item in languageOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item prop="type">
                <el-select v-model="myPodcastInfo.type" placeholder="媒体">
                  <el-option
                    v-for="(item, index) in mediaOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item prop="category">
                <el-select v-model="myPodcastInfo.category" placeholder="类别">
                  <el-option
                    v-for="item in categorieOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>

        <el-col :span="9" :offset="1">
          <el-upload
            class="uploadImg"
            accept=".png,.jpg"
            :action="uploadUrl"
            :data="uploadParams"
            multiple
            drag
            :before-upload="handleBeforeUpload"
            :on-preview="handlePicturePreview"
            :on-success="handleSuccess"
            :with-credentials="true"
            :limit="1"
            :file-list="fileList"
            :on-remove="handleRemove"
          >
            <div v-if="myPodcastInfo.cover">
              <el-image
                style="width: 216px; height: auto"
                :src="myPodcastInfo.cover"
                fit="cover"
              ></el-image>
            </div>
            <div v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                <p>请将封面拖到此处，或<em>点击上传</em></p>
              </div>
              <div class="el-upload__tip">
                <p>
                  <i class="el-icon-info" />
                  图片尺寸不小于1400*1400像素，
                </p>
                仅支持jpg/png文件，且不超过5M
              </div>
            </div>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="3">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-col>
        <el-col :span="9" :offset="3">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确认</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog
      title="审核意见"
      width="600px"
      :visible.sync="showDialogSuggestion"
      @close="closeDialogSuggestion"
    >
      <div>
        <el-input
          style="padding: 0px"
          v-model="refuseContent"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 10 }"
          maxlength="100"
          show-word-limit
          class="radius radius-30 textarea-content"
          placeholder="请输入"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="dialogConfirm" @click="subumitModify">发 送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import SocialSign from './components/SocialSignin'
import { handleAuthResult } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

import { validUsername } from "@/utils/validate";

import {
  getPodcast,
  setPodcast,
  deletePodcast,
  addChannel,
  queryChannel,
  updatePodcast,
  getAuditList,
  channelAudit
} from "@/api/podcast";

export default {
  name: "examinePodcast",
  components: { Pagination },
  data() {
    const myPodcastInfoRules = {
      title: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      source: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      summary: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      email: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!validUsername(value)) {
              callback(new Error("请输入正确的email"));
            } else {
              callback();
            }
          },
        },
      ],
      copyright: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      lan: [{ required: true, message: "请选择语言", trigger: "change" }],
      type: [{ required: true, message: "请选择媒体类型", trigger: "change" }],
      category: [{ required: true, message: "请选择类别", trigger: "change" }],
    };
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}/resource/upload`,
      tableKey: 0,
      currentPage: "",
      listLoadingText: true,
      list: null,
      articleList: null,
      total: 0,
      tableKey: 0,
      showDialog: false,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 20,
        searchAuditType: 4,
        queryType: 1
      },
      pushCounts: {},
      listData: [],
      myPodcastInfo: {
        title: "",
        source: "",
        summary: "",
        lan: "",
        author: "",
        type: "",
        category: "",
        email: "",
        copyright: "",
        cover: "",
        size: 20,
        page: 1
      },
      fileList: [],
      languageOptions: [],
      categorieOptions: [],
      mediaOptions: [
        {
          label: "音频",
          value: 0,
        },
        {
          label: "视频",
          value: 1,
        },
      ],
      formInline: {
        user: "",
        region: "",
      },
      rules: myPodcastInfoRules,
      file_url: "",
      isEdit: -1,
      takeTitle: "",
      uploadParams: {
        duration: 0,
        width: 0,
        height: 0,
        size: 0
      },
        options: [{
          value: 4,
          label: '全部'
        },{
            value: 0,
            label: '待审核'
        }, {
            value: 2,
            label: '已拒绝'
        }, {
            value: 1,
            label: '已上线'
        }, {
            value: 3,
            label: '已下线'
        }],
        value: '',
        showDialogSuggestion: false,
        refuseContent: '',
        refuseObj: {
          id: '',
          auditType: 2,
          auditMessage: ''
        }
    };
  },
  mounted() {
    getPodcast()
      .then((res) => {
        this.languageOptions = res.data.languages;
        this.categorieOptions = res.data.categories;
      })
      .catch((err) => {});
    this.getList();
  },
  computed: {
    ...mapGetters(["oauthUsers","permissions"]),
    filteredOauthUsers() {
      if (this.listQuery.keyword) {
        return this.oauthUsers.filter(
          (u) => u.nick && u.nick.indexOf(this.listQuery.keyword) > -1
        );
      }
      if (this.listQuery.type) {
        return this.oauthUsers.filter(
          (u) => u.oauthType === this.listQuery.type.toUpperCase()
        );
      } else {
        return this.oauthUsers;
      }
    },
  },
  methods: {
    search() {
      this.getList();
    },
    //审核操作
    dialogAuditState(item, type) {

      if (type == 1) {
          this.$confirm('确定上线吗?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.refuseContent = type;
            this.refuseObj.id = item.id;
            this.refuseObj.auditType = type
            this.refuseContent = '';
            this.subumitModify(item, '上线');
  
          }).catch(() => {
         
          });
          return false;
      }
      this.refuseObj.id = item.id;
      this.refuseObj.auditType = type;
      this.showDialogSuggestion = true;
    },
    closeDialogSuggestion() {
      this.closeDialogSuggestion = false;
      this.refuseContent = '';
    },
    subumitModify(item, status) {
      if (!this.refuseContent.replace(/^(\s*)|(\s*)$/g, '') && status != '上线') {
        this.$message.warning('不能为空！')
        return false;
      }
      this.refuseObj.auditMessage = this.refuseContent
      
      channelAudit(this.refuseObj).then(res => {
        this.$message({
          message: "成功！",
          type: "success",
        });
        this.showDialogSuggestion = false;
        this.getList();
      })
      .catch(err => {
        console.log(err);
      })

    },
    auditStatus(val) {
      this.listQuery.searchAuditType = (typeof(val) == 'string' ? 4 : val);
      this.getList();
    },
    //暂时
    tips() {
      this.$alert("目前暂不支持自行创建新专辑，如有需要请发邮件至service@kroraina.com.cn", "提示", {
      })
        .then(() => {
        })
        .catch(() => {});
    },
    handleCopy(index, row) {
      let _this = this;
      _this.file_url = row.rss;
      let clipboard = new this.clipboard(".js-copy");
      clipboard.on("success", function () {
        _this.$message({
          message: "复制成功！",
          type: "success",
        });
        clipboard.destroy();
      });
      clipboard.on("error", function () {
        _this.$message({
          message: "复制失败 ",
          type: "error",
        });
      });
    },
    getList() {
      let obj = {
        title: '',
        source: '',
        author: '',
        lan: '',
        type: 1,
        category: {},
        page: 1,
        size: 20
      }
      queryChannel(this.listQuery)
        .then((res) => {
          this.listData = res.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleFilter(type) {
      this.listQuery.type = type;
    },
    handleRemove(file, fileList) {
      this.myPodcastInfo.cover = "";
      this.fileList = [];
    },
    handlePicturePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file) {
      this.myPodcastInfo.cover = res.data[0].url;
      console.log(res, file);
    },
    handleBeforeUpload(file) {
      let _this = this;
      const is5M = file.size / 1024 / 1024 <= 5; // 限制
      const isSize = new Promise(function (resolve, reject) {
        let width = 1400; // 限制图片尺寸为1400
        let height = 1400;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          console.log(img.width, img.height);
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸不小于1400 x 1400");
          return Promise.reject();
        }
      );

      if (!is5M) {
        _this.$message.error("图片大小不可超过5MB");
        return false;
      }

      return isSize;
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.myPodcastInfo.cover = "";
      this.fileList = [];
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.myPodcastInfo.cover == "") {
            this.$message.warning("请上传封面图片！");
            return false;
          }

          if (this.isEdit != -1) {
            updatePodcast(this.myPodcastInfo)
              .then((response) => {
                this.$message.success("成功");
                this.showDialog = false;
                this.getList();
              })
              .catch((msg) => {
                this.$message.error("失败");
              });
          } else {
            addChannel(this.myPodcastInfo)
              .then((res) => {
                this.showDialog = false;
                this.getList();

                this.$store
                  .dispatch("oauth/resetUsers")
                  .then((res) => {})
                  .catch((err) => {});
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.myPodcastInfo.cover = "";
      this.fileList = [];
      this.showDialog = false;
      this.isEdit = -1;
    },
    handleDelete(row) {
      this.$confirm("确定要删除该专辑吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePodcast({ id: row.id })
            .then((res) => {
              this.$message.success("删除成功！");
              this.getList();

              this.$store
                .dispatch("oauth/resetUsers")
                .then((res) => {})
                .catch((err) => {});
            })
            .catch((err) => {
              this.$message.error(err.msg);
            });
        })
        .catch(() => {});
    },
    _cancelEdit(row) {
      this.isEdit = -1;
      row.title = this.takeTitle;
    },
    confirmEdit(row) {
      if (row.title == "") {
        this.$message.warning("不能为空");
        return;
      }
      this.saveEdit(row);
    },
    saveEdit(item) {
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

      this.isEdit = -1;
      this.active = false;
      this.current = false;
    },
    editName(idx, rowInfo) {
      // this.takeTitle = title;
      this.isEdit = idx;
      this.showDialog = true;
      this.$nextTick(() => {
        this.myPodcastInfo.title = rowInfo.title;
        this.myPodcastInfo.source = rowInfo.source;
        this.myPodcastInfo.summary = rowInfo.summary;
        this.myPodcastInfo.email = rowInfo.email;
        this.myPodcastInfo.copyright = rowInfo.copyright;
        this.myPodcastInfo.category = rowInfo.category;
        this.myPodcastInfo.cover = rowInfo.cover;
        this.myPodcastInfo.lan = rowInfo.lan;
        this.myPodcastInfo.type = rowInfo.type;
        this.myPodcastInfo = Object.assign(this.myPodcastInfo, {
          id: rowInfo.id,
        });
      });
    },
  },
  created() {
    var self = this;
    window.handleAuthResult = function (id) {
      handleAuthResult(id, self);
    };
  },
  filters: {
    transState(value) {
      return !value ? "已授权" : "未授权";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "./index.scss"
</style>

