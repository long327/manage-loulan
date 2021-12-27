<template>
  <div class="app-container">
    <div class="title">
      <router-link :to="{ path: './index' }">
        <span>
          <i class="el-icon-arrow-left" style="font-weight:700;"></i>
          我的播客
        </span>
      </router-link>
    </div>
    <div class="filter-container">
      <div class="right">
        <!-- <el-input
          size="mini"
          style="width: 200px; margin-right: 1em"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="listQuery.keyword"
        >
        </el-input> -->
      </div>
    </div>
    <div class="mytable-simple">
      <el-table
        class="mytable-simple"
        :key="tableKey"
        v-loading="listLoading"
        :data="listData"
        :border="false"
        header-cell-class-name="tb-header"
        fit
        highlight-current-row
        style="width: 100%; border: 1px solid #ebeef5"
      >
        <el-table-column :label="title" min-width="300">
          <template slot-scope="scope">
            <div>
              <template v-if="resourceType == 1">
                <h3>{{ scope.row.title }}</h3>
                <video
                  :src="scope.row.resourceUrl"
                  width="300"
                  height="120"
                  controls
                  controlslist="nodownload"
                ></video>
              </template>
              <template v-else>
                <h3>{{ scope.row.title }}</h3>
                <audio
                  style="width: 300px"
                  :src="scope.row.resourceUrl"
                  controls
                  controlslist="nodownload"
                ></audio>
              </template>
     
              <span style="font-size: 15px;
                          margin-left: 30px;">
                {{ formatDate(scope.row.createdTime) }}
              </span>

            </div>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" width="160">

        </el-table-column>

        <!-- <el-table-column
          label=""
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              style="width: 50px"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog title="专辑信息" :visible.sync="showDialog">
      <el-row>
        <el-col>
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
            <el-form-item prop="summary">
              <el-input
                type="textarea"
                v-model="myPodcastInfo.summary"
                placeholder="摘要"
              ></el-input>
            </el-form-item>

            <el-form-item v-if="resourceType == 0">
              <!-- 添加音频 -->
              <el-col>
                <span class="el-icon-microphone"> </span>
                <span class="title-picture"> 添加音频 </span>
              </el-col>
              <el-row>
                <el-col :span="7" class="fl">
                  <div
                    class="el-upload tips-upload-box el-upload--picture-card"
                    style="position: relative"
                  >
                    <div
                      role="tooltip"
                      id="el-tooltip-1193"
                      aria-hidden="false"
                      class="el-tooltip__popper is-light tooltip-box"
                      style="transform-origin: center top; z-index: 2035"
                      x-placement="bottom"
                    >
                      <div x-arrow="" class="popper__arrow"></div>
                      <el-upload
                        class="local-upload"
                        style="display: inline-block"
                        ref="uploadAudio"
                        :action="uploadUrl"
                        accept="mp3"
                        :file-list="fileList"
                        :data="uploadParams"
                        :on-preview="handlePictureCardPreview"
                        :on-success="successed"
                        :on-error="uploadFailed"
                        :on-remove="handleRemove"
                        :on-exceed="exceed"
                        :on-progress="uploadProgress"
                        :before-upload="beforeUploadAudio"
                        :with-credentials="true"
                        :multiple="false"
                        :limit="1"
                      >
                        <el-button type="text"> 本地上传 </el-button>
                      </el-upload>
                      <span>|</span>
                      <el-button type="text" @click="openChDialogPics = true">
                        音频素材库
                      </el-button>
                    </div>

                    <div
                      class="upload-box-card el-upload el-upload--picture-card"
                    >
                      <i class="el-icon-plus"></i>
                    </div>
                  </div>
                </el-col>
                <el-col :span="17" class="tips-video fr">
                  <p><i class="el-icon-info" />说明</p>
                  <p>
                    1、Facebook、Twitter、Youtube不支持音频，您发布的音频将展示在楼兰手机端
                  </p>
                  <p>2、音频支持mp3格式，不超过300M</p>
                </el-col>
              </el-row>
              <div v-show="showupload == 'audio'">
                <div
                  style="
                    height: 30px;
                    width: 100%;
                    border-bottom: 1px solid #ddd;
                    margin: 20px 0px;
                  "
                >
                  <div style="float: left; font-size: 14px">已上传音频</div>
                  <div
                    class="el-icon-close"
                    style="float: right; color: red"
                    @click="close"
                  ></div>
                  <div class="clear"></div>
                </div>

                <div>
                  <div class="video-progress" v-if="progressBarShow">
                    <el-progress
                      :percentage="progressBar"
                      :color="progressState"
                    >
                    </el-progress>
                  </div>
                  <div
                    v-loading="videoLoading"
                    v-show="audio.url"
                    style="text-align: left"
                  >
                    <audio
                      class="videos"
                      style="width: 300px"
                      :src="audio.url"
                      controls
                      controlslist="nodownload"
                    ></audio>
                    <a
                      :title="audio.name"
                      style="margin-left: 10px"
                      class="isEditName"
                      v-if="isEditName"
                      >{{ audio.name }}</a
                    >

                    <div v-else class="video-button-wrap">
                      <el-input
                        v-model="editAudioName"
                        type="text"
                        class="inputVideoName"
                        size="mini"
                      >
                      </el-input>
                      <el-button
                        @click="audioNameCancel"
                        type="text"
                        class="buttonVideo"
                        size="mini"
                        >取消</el-button
                      >
                      <el-button
                        @click="audioNameSave"
                        type="text"
                        class="buttonVideo"
                        size="mini"
                        >保存</el-button
                      >
                    </div>
                    <span
                      v-if="isEditName"
                      @click="editAudioNameFn"
                      class="el-icon-edit"
                    ></span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item v-else>
              <!-- 添加视频 -->
              <el-col>
                <span class="el-icon-video-camera"> </span>
                <span class="title-picture"> 添加视频 </span>
              </el-col>
              <el-row>
                <el-col :span="7" class="fl">
                  <el-upload
                    class="local-upload"
                    ref="uploadVideo"
                    :action="uploadUrl"
                    accept="video/*"
                    :file-list="fileList"
                    list-type="picture-card"
                    :on-remove="handleRemove"
                    :on-success="successed"
                    :on-error="uploadFailed"
                    :on-exceed="exceed"
                    :on-progress="uploadProgress"
                    :before-upload="beforeUploadVideo"
                    :with-credentials="true"
                    :multiple="false"
                    :limit="1"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-col>
                <el-col :span="17" class="tips-video fr">
                  <p><i class="el-icon-info" />说明</p>
                  <p>1、视频大小不超过300M，支持MP4和MOV格式</p>
                  <p>2、视频无法与图片同时出现在同一条贴文</p>
                </el-col>
              </el-row>

              <div v-show="showupload == 'video'">
                <div
                  style="
                    height: 30px;
                    width: 100%;
                    border-bottom: 1px solid #ddd;
                    margin: 20px 0px;
                  "
                >
                  <div style="float: left; font-size: 14px">已上传视频</div>
                  <div
                    class="el-icon-close"
                    style="float: right; color: red"
                    @click="close"
                  ></div>
                  <div class="clear"></div>
                </div>

                <div>
                  <div class="video-progress" v-if="progressBarShow">
                    <el-progress
                      :percentage="progressBar"
                      :color="progressState"
                    >
                    </el-progress>
                  </div>
                  <div
                    v-loading="videoLoading"
                    v-show="video.url"
                    style="text-align: left"
                  >
                    <video
                      class="videos"
                      style="width: 200px; height: 150px"
                      :src="videoResources[0]"
                      controls
                      controlslist="nodownload"
                    ></video>
                    <a
                      :title="video.name"
                      style="margin-left: 10px"
                      class="isEditName"
                      v-if="isEditName"
                      >{{ video.name }}</a
                    >

                    <!-- <div v-else class="video-button-wrap">
                              <el-input v-model="editVideoName"
                                type="text"
                                class="inputVideoName"
                                size="mini"
                              >
                              </el-input>
                              <el-button @click="videoNameCancel"
                                type="text"
                                class="buttonVideo"
                                size="mini"
                              >取消</el-button>
                              <el-button @click="videoNameSave"
                                type="text"
                                class="buttonVideo"
                                size="mini"
                              >保存</el-button>
                            </div>
                            <span 
                              v-if="isEditName"
                              @click="editVideoNameFn" 
                              class="el-icon-edit"
                            ></span> -->
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确认</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import SocialSign from './components/SocialSignin'
import { handleAuthResult } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import PodcastImg from "./components/podcastImg";
import moment from "moment";
import { queryChannelItem } from "@/api/podcast";

export default {
  name: "mypodcast",
  components: { Pagination, PodcastImg },
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
        keyword: "",
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
        cover: "",
        size: 20,
        page: 1,
      },
      fileList: [],
      formInline: {
        user: "",
        region: "",
      },
      rules: myPodcastInfoRules,
      file_url: "",
      uploadParams: { duration: 0 },
      queryChannelItem: { channelId: null },
      videoResources: [],
      videoLoading: false,
      title: "",
      editAudioName: "",
      audio: "",
      video: { url: "", name: "" },
      resourceType: "",
      showupload: "",
      isEditName: "",
      progressBarShow: false,
      progressBar: 0,
      progressState: "#67c23a",
      openChDialogPics: false,
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  computed: {
    ...mapGetters(["oauthUsers"]),
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
    getList() {
      this.queryChannelItem.channelId = this.$route.query.channelId;
      this.title = this.$route.query.title;
      this.resourceType = this.$route.query.type;
      queryChannelItem(this.queryChannelItem)
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
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file) {
      this.myPodcastInfo.cover = res.data[0].url;
      console.log(res, file);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // addChannel(this.myPodcastInfo).then(res => {
          //   console.log(res)
          //   this.showDialog = false;
          // }).catch(err => {
          //   console.log(err);
          // })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.showDialog = false;
    },
    handleDelete(row) {
      this.$confirm("确定要删除该帐号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("oauth/delUser", row.id)
            .then(() => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
            })
            .catch((ex) => {
              this.$alert(ex, "错误", {
                confirmButtonText: "确定",
              });
            });
        })
        .catch(() => {});
    },

    //音视频之前
    beforeUploadVideo(file) {
      // 限制上传文件大小 300M
      const isLt300M = file.size / 1024 / 1024 <= 300;
      if (
        ["video/mp4", "video/mov", "video/quicktime"].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt300M) {
        this.$message.error("上传视频大小不能超过300MB哦!");
        return false;
      }

      this.videoLoading = true;
      this.progressBarShow = true;
      // 获取时长
      this.duration = 100;
      this.getTimes(file);
      return isLt300M;
    },
    beforeUploadAudio(file) {
      // 文件类型进行判断
      const isAudio = file.type === "audio/mp3" || file.type === "audio/mpeg";
      const isTime60S = this.audioDuration >= 60 ? true : "";
      // 限制上传文件大小 300M
      const isLt300M = file.size / 1024 / 1024 <= 300;
      if (!isAudio) {
        this.$message.error("上传文件只能是Mp3格式!");
        return false;
      } else {
        if (!isLt300M) {
          this.$message.error("上传文件大小不能超过 300MB!");
          return false;
        }
      }

      this.videoLoading = true;
      this.progressBarShow = true;
      // 获取时长
      this.duration = 100;
      this.getTimes(file);
      return isLt300M;
    },
    getTimes(file) {
      let that = this;
      var content = file;
      //获取时长
      var url = URL.createObjectURL(content);
      var audioElement = new Audio(url);
      audioElement.addEventListener("loadedmetadata", (_event) => {
        that.duration = audioElement.duration;
        console.log(this.duration);
      });
    },
    exceed() {},
    uploadFailed() {},
    successed() {},
    close() {},
    //音频修改
    editAudioNameFn() {
      this.editAudioName = this.audio.name;
      this.isEditName = false;
    },
    audioNameCancel() {
      this.editAudioName = this.audio.name;
      this.isEditName = true;
    },
    audioNameSave() {
      this.audio.name = this.editAudioName;
      this.isEditName = true;
      this.saveEdit();
    },
    //视频修改
    editVideoNameFn() {
      this.editVideoName = this.video.name;
      this.isEditName = false;
    },
    videoNameCancel() {
      this.editVideoName = this.video.name;
      this.isEditName = true;
    },
    videoNameSave() {
      this.video.name = this.editAudioName;
      this.isEditName = true;
      this.saveEdit();
    },
    //视频重命名
    saveEdit() {
      let param = {
        id: this.video.id,
        url: this.video.url,
        title: this.video.name,
        description: null,
        tags: null,
        public: false,
      };
      let currentLen;
      /*中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算*/
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      let mat = param.title.match(cnReg);
      let length = 0;
      if (mat) {
        currentLen = mat.length * 2 + (param.title.length - mat.length);
      } else {
        currentLen = param.title.length;
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
    },
    uploadProgress(ev, file, fileList) {
      this.progressBar = Math.floor(ev.percent);
    },
    formatDate(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
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
@import "./index.scss";

$top: 73px;
$left: -15px;
$bgColor918e: #918ef9;
$fontColorFFF: #ffffff;

.el-tooltip__popper.tooltip-box {
  & {
    top: $top !important;
    left: $left !important;
    background-color: $bgColor918e !important;
    color: $fontColorFFF !important;
    border: none !important;
    position: absolute;
    display: none;
    width: 163px;
    height: 56px;
    z-index: 9999;
  }
  .popper__arrow::after {
    border-bottom-color: $bgColor918e !important;
  }
  .el-button {
    color: $fontColorFFF !important;
  }
  .popper__arrow {
    left: 77.5px !important;
  }
  .popper__arrow,
  .el-tooltip__popper.is-light {
    border: none !important;
  }
}

.tips-upload-box:hover .tooltip-box {
  display: block;
}
.el-tooltip__popper .popper__arrow {
  border-width: 6px;
}
.el-tooltip__popper .popper__arrow,
.el-tooltip__popper .popper__arrow:after {
  left: 5px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
.el-tooltip__popper .popper__arrow:after {
  content: " ";
  border-width: 5px;
}

.mytable-simple ::v-deep {
  margin: 0 14px;
  border-radius: 5px;
  font-size: 12px;
  .tb-header {
    background-color: #ffffff;
    font-size: 18px;
    padding-left: 20px;
  }
  .el-avatar {
    float: left;
  }
  .nick {
    float: left;
    padding-left: 10px;
    line-height: 40px;
  }
  .el-table thead {
    color: #7e7ef4;
    font-size: 16px;
  }
  .el-table_1_column_3.is-center {
    color: #7e7ef4;
  }
  .source {
    text-align: left;
  }
  .badge {
    line-height: 40px;
    border-radius: 7px;
    font-size: 14px;
    margin-left: 5px;
    &.twitter {
      background-color: $twitter;
      &.unauth {
        background-color: #ccc;
      }
    }
    &.facebook {
      background-color: $facebook;
      &.unauth {
        background-color: #ccc;
      }
    }
    &.google {
      background-color: $google;
      &.unauth {
        background-color: #ccc;
      }
    }
  }
  .el-table td, .el-table th.is-leaf {
    border-bottom: unset;
  }
  .el-table--medium td{
    padding-left: 60px;
  }
}
.app-main ::v-deep {
  .title {
    font-size: 20px;
    .el-icon-arrow-left{
      font-weight: 700;
    }
  }

}

</style>

