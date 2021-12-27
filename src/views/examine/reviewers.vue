<template>
  <div class="app-container">
    <div id="topic-list" v-loading="listLoading" element-loading-text="拼命加载中...">
      <div class="leeshenhe">贴文审核</div>
      <div class="filterContainer">
        <span style="margin-top:10px;">筛选：</span>

        <el-select 
          v-model="leeListQuery.pushContentAuditStatus" 
          placeholder="全部审核状态"
          :clearable="true"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @change="selectStatus"
          ></el-option>
        </el-select>

        <el-select
          class="select-myteams"
          v-model="leeListQuery.members"
          :clearable="true"
          placeholder="全部成员"
        >
          <el-option
            v-for="item in members"
            :key="item.userId"
            :label="item.nickname"
            :value="item.userId"
          >
          </el-option>
        </el-select>

        <el-select
          class="select-myteams"
          v-model="leeListQuery.teamId"
          :clearable="true"
          placeholder="全部团队"
        >
          <el-option
            v-for="item in myteams"
            :key="item.id"
            :label="item.teamName"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <el-input
          class="search-input"
          v-model="leeListQuery.title"
          style="width:170px;margin:0 1em"
          size="large"
          placeholder="请输入主题关键词"
          @keyup.enter.native="handleFilter"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="serarch">搜索</el-button>
      </div>

      <el-row>
        <el-col style="margin:25px 0;">
          <!-- <el-checkbox>全选</el-checkbox>
          共
          <span>{{total}}</span>条-->
        </el-col>
      </el-row>
      <el-row>
        <el-col v-for="(item, index) in leeList" :key="index" style="margin-bottom:10px;">
          <el-card class="box-card">
            <div class="article-wrap">
              <div class="article-header">
                <div class="left-wrap fl">
                  <div class="title" @click="openList(item, index)">
                    <!-- <el-checkbox></el-checkbox> -->
                    <i class="list-open" v-if="item.isOpen"></i>
                    <i class="list-close" v-else></i>
                    <a class="title-topics" :title="item.title">{{ item.title }}</a>
                  </div>
                  <div class="tiems">
                    {{formatDate(item.createdTime)}}
                    <!-- <span>{{123}}次浏览</span> -->
                  </div>
                </div>
                <div class="right-wrap fr">
                  <div class="user-wrap fl">
                    <div class="user-inner-wrap">
                      <div v-for="pushLists in item.pushContents" :key="pushLists.id" class="fl">
                        <div v-for="user in filteredOauthUsers" :key="user.id">
                          <div v-show="pushLists.socialAccountId == user.id">
                            <div class="left-wrap fl">
                              <div class="top-wrap">
                                <el-avatar :size="40" :src="user.avatar"></el-avatar>
                                <svg-icon
                                  :icon-class="user.oauthType.toLowerCase()"
                                  :class="'badge '+user.oauthType.toLowerCase()"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="btn-wrap fr">
                    <el-button
                      v-if="item.isOpen"
                      @click="openList(item, index)"
                      type="text"
                      class="openList"
                      size="mini"
                      icon="el-icon-arrow-down"
                    >更多操作</el-button>
                    <el-button
                      v-else
                      @click="closeList(item, index)"
                      type="text"
                      class="closeList"
                      size="mini"
                      icon="el-icon-arrow-down"
                    >更多操作</el-button>
                  </div> -->
                  <div class="clear"></div>
                </div>
                <div class="clear"></div>
              </div>
              <div class="article-box" v-show="!item.isOpen">
                <div v-for="pushLists in item.pushContents" :key="pushLists.id">
                  <div v-for="user in filteredOauthUsers" :key="user.id">
                    <div v-show="pushLists.socialAccountId == user.id" class>
                      <el-scrollbar style="height:100%">
                        <el-card class="box-card" style="margin: 10px 20px 10px 0px;">
                          <div class="left-wrap fl">
                            <div class="top-wrap">
                              <el-avatar :size="40" :src="user.avatar"></el-avatar>
                              <svg-icon
                                :icon-class="user.oauthType.toLowerCase()"
                                :class="'badge '+user.oauthType.toLowerCase()"
                              />
                              <span class="page_name" v-bind:class="user.oauthType">{{ user.nick }}</span>
                              <!-- 改版v1.3 -->
                              <!-- <span
                                v-if="pushLists.pushStatus == 101"
                                class="pushState-1"
                              >拒绝理由：{{pushLists.rejectionReason}}</span>
                              <span v-if="pushLists.pushStatus == 100" class="pushState-1">待审核</span> -->
                            </div>
                            <div class="bottom-wrap">
                              <div style="margin:10px 0px;">
                                <p>{{pushLists.content}}</p>
                              </div>

                              <div class="imgs-wrap" v-if="pushLists.contentType == 'image'">
                                <viewer :images="pushLists.resourcesUrl"
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
                              <div class="imgs-wrap" v-if="pushLists.contentType == 'video'">
                                <video
                                  width="200"
                                  height="120"
                                  :src="pushLists.resourcesUrl[0]"
                                  preload="auto"
                                  controls
                                />
                              </div>
                              <div
                                v-if="pushLists.resourceInfos != null &&
                                 pushLists.resourceInfos.length > 0 &&
                                  pushLists.hasOwnProperty('resourceInfos')"
                              >
                                <div
                                  class="imgs-wrap"
                                  v-if="pushLists.resourceInfos[0].resourceType == 'AUDIO' || pushLists.contentType == 'audio'"
                                >
                                  <audio
                                    width="200"
                                    height="auto"
                                    :src="pushLists.resourceInfos[0].url"
                                    preload="auto"
                                    controls
                                  ></audio>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- 数据互动 -->
                          <div class="fr">
                            <div class="leehandel">
                              <!-- 改版v1.3 -->
                              <!-- <div class="leehandel_header">
                                <p>
                                  <i class="el-icon-s-promotion"></i>
                                  <span>审核通过后立即发布</span>
                                </p>
                                <div class="center">
                                  <i class="el-icon-user"></i>
                                  <span class="right">
                                    CRI_1
                                    <em
                                      v-if="pushLists.pushStatus == 101"
                                      style="color:red"
                                    >审核拒绝</em>
                                    <em v-if="pushLists.pushStatus == 100">待审核</em>
                                  </span>
                                </div>
                              </div> -->
                              <!-- 改版v1.4 -->
                              <div>
                                <template v-if="pushLists.pushStatus == 101">
                                  <div class="fr efuse">
                                    <el-button
                                      @click="dialogEfuseFn(pushLists)"
                                      type="text"                             
                                    >
                                      已拒绝，点击查看
                                    </el-button>
                                  </div>
                                </template>
                                <template v-if="pushLists.pushStatus == 100">
                                  <div class="check-pending fr">
                                    <span>待审核</span>
                                  </div>
                                </template>
                                <div class="clear"></div>
                              </div>
                              <div class="top">
                                <el-button
                                  type="primary"
                                  class="post-disabled-views"
                                  size="mini"
                                  v-if="pushLists.pushStatus == 100"
                                  disabled
                                  round
                                >编辑</el-button>
                                <el-button
                                  class="post-views"
                                  size="mini"
                                  v-if="pushLists.pushStatus == 101"
                                  @click="editeTop(pushLists.id)"
                                  round
                                >编辑</el-button>
                                <el-button
                                  v-if="pushLists.pushStatus == 101"
                                  size="mini"
                                  @click="quxiaofabu(pushLists.id)"
                                  round
                                >取消发布</el-button>
                                <el-button
                                  size="mini"
                                  v-if="pushLists.pushStatus == 100"
                                  @click="quxiaofabu(pushLists.id)"
                                  round
                                >取消发布</el-button>
                              </div>
                            </div>
                          </div>
                          <div class="clear"></div>
                        </el-card>
                      </el-scrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    <!-- 拒绝理由 -->
    <el-dialog
      title="拒绝理由"
      :visible.sync="dialogEfuse"
      width="50%"
      class="dialogReviewer"
      :before-close="efuseHandleClose">
      <span class="reviewer-tips">审核人：</span> <span class="reviewer-name">{{dialogReviewer}}</span>
      <p>{{dialogEfuseTxt}}</p>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>

      <pagination
        style="padding:10px"
        v-show="total > 0"
        :total="total"
        :page.sync="leeListQuery.page"
        :limit.sync="leeListQuery.limit"
        :layout="'total, prev, pager, next, slot'"
        @pagination="leeGetList"
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
    </div>
    <!--编辑-->
    <el-dialog title="重新编辑" :visible.sync="centerDialogVisible" width="560px" center>
      <div class="leeEdite">
        <el-input
          style="padding: 0px"
          v-model="pushObj.content"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20 }"
          @input="validateTextLength(pushObj.content)"
          class="radius radius-30 textarea-content"
          placeholder="请输入内容"
        />
        <div style="margin-top: 20px">
          <div style="text-align: left"></div>

          <!-- 账号字符限制 -->
          <div :span="24" style="text-align: right">
            <span class="tips-upload">
              <i class="el-icon-warning" style="color: #dcd92b"></i>
              温馨提示: 贴文字数不超过
              <!-- facebook限制 -->
              <span
                class="character_count"
                style="display: inline-block; min-width: 56px"
                :style="{
                                color: fbFlag
                                  ? fbTextMaxLen -
                                      currentLength>=
                                    0
                                    ? '#888888'
                                    : 'red'
                                  : '#888888',
                              }"
              >
                <span class="fb-svg-container">
                  <svg-icon icon-class="facebook" class="icon" />
                </span>
                {{
                fbFlag
                ? fbTextMaxLen -
                currentLength
                : fbTextMaxLen
                }}
              </span>
              <!-- twitter限制 -->
              <span
                class="character_count"
                style="display: inline-block; min-width: 45px"
                :style="{color: twFlag
                                  ? twTextMaxLen -
                                      currentLength>=
                                    0
                                    ? '#888888'
                                    : 'red'
                                  : '#888888',
                              }"
              >
                <i class="iconfont icontw"></i>
                {{
                twFlag
                ? twTextMaxLen -
                currentLength
                : twTextMaxLen
                }}
              </span>
              <!-- youtube限制 -->
              <span
                class="character_count isYoutube-authorized"
                style="display: inline-block;min-width:55px;"
                :style="{color: ytbFlag ? ytbTextMaxLen -currentLength  >=
                                    0
                                    ? '#888888'
                                    : 'red'
                                  : '#888888',
                              }"
              >
                <i class="iconfont iconyoutube"></i>
                {{
                ytbFlag
                ? ytbTextMaxLen -
                currentLength -
                pushObj.linkUrl.length
                : ytbTextMaxLen
                }}
              </span>
            </span>
          </div>
          <!-- 添加图片 -->
          <el-col v-if="isContentType=='image'">
            <span class="el-icon-picture"></span>
            <span class="title-picture">添加图片</span>
          </el-col>
          <el-row v-if="isContentType=='image'" style="margin: 20px 0px">
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
                  style="transform-origin: center top; z-index: 2035;"
                  x-placement="bottom"
                >
                  <div x-arrow class="popper__arrow"></div>
                  <el-upload
                    class="local-upload"
                    style="display: inline-block"
                    ref="upload"
                    :action="uploadUrl"
                    accept=".png, .jpg, .gif"
                    :file-list="imageResources"
                    :on-preview="handlePictureCardPreview"
                    :on-success="successed"
                    :on-error="uploadFailed"
                    :on-remove="handleRemove"
                    :on-exceed="exceed"
                    :before-upload="beforeUpload1"
                    :with-credentials="true"
                    :multiple="true"
                    :limit="9"
                  >
                    <el-button type="text">本地上传</el-button>
                  </el-upload>
                  <span>|</span>
                  <el-button type="text" @click="openChDialogPics">图片素材库</el-button>
                </div>

                <div class="upload-box-card el-upload el-upload--picture-card">
                  <i class="el-icon-plus"></i>
                </div>
              </div>
            </el-col>

            <el-col :span="17" class="fr tips-pic">
              <p>
                <i class="el-icon-info" />说明
              </p>
              <p>1、图片最多上传9张，支持JPG、PNG、GIF格式</p>
              <p>2、JPG/PNG图片不超过5MB，GIF图片不超过8MB</p>
              <p>3、GIF图片无法与其他图片格式同时出现在同一条贴文</p>
            </el-col>
          </el-row>

          <div
            v-if="isContentType=='image'"
            v-show="
                          fileListImgs.length || fileListGifImgs.length > 0
                        "
            style="padding-bottom: 10px"
          >
            <div
              v-show="fileListImgs.length > 0"
              style="
                height: 30px;
                width: 100%;
                margin: 10px 0px;
                border-bottom: 1px solid #ddd;
              "
            >
              <div style="float: left; font-size: 14px">已上传 JPG/PNG 图片</div>
              <div class="el-icon-close12" style="float: right; color: red" @click="imageClose"></div>
              <div class="clear"></div>
            </div>
            <div v-loading="imgLoading">
              <ul class="img-lists">
                <li v-for="(item, index) in fileListImgs" :key="index">
                  <div class="el-image-box">
                    <img :src="item.url" alt />
                    <div class="upload-remove" @click="handleRemoveList(item, index)">
                      <i class="el-icon-delete"></i>
                    </div>
                    <div class="upload-scissor" @click="handleScissor(item, index)">
                      <i class="el-icon-scissors"></i>
                    </div>
                    <div class="upload-zoom-in" @click="handleZoom(item, index)">
                      <i class="el-icon-zoom-in"></i>
                    </div>
                  </div>
                </li>
                <span></span>
              </ul>
            </div>
            <div v-loading="imgLoading" v-if="fileListGifImgs.length > 0">
              <div
                class="gifTitle"
                style="
                  border-bottom: 1px solid #ddd;
                  padding: 10px 0px;
                  font-size: 14px;
                "
              >已上传 GIF 图片</div>
              <ul class="img-lists" style="margin-top: 10px">
                <li v-for="(item, index) in fileListGifImgs" :key="index">
                  <div class="el-image-box">
                    <img :src="item.url" alt />
                    <div class="upload-remove" @click.stop="handleRemoveListGif(item, index)">
                      <i class="el-icon-delete"></i>
                    </div>
                    <div class="upload-zoom-in" @click="handleZoom(item, index)">
                      <i class="el-icon-zoom-in"></i>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--video-->
        <!-- 添加视频 -->
        <el-col v-if="isContentType=='video'">
          <span class="el-icon-video-camera"></span>
          <span class="title-picture">添加视频</span>
        </el-col>
        <el-row v-if="isContentType=='video'">
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
              :on-exceed="exceedVideo"
              :on-progress="uploadProgress"
              :before-upload="beforeVideoUpload"
              :with-credentials="true"
              :multiple="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-col>
          <el-col :span="17" class="tips-video fr">
            <p>
              <i class="el-icon-info" />说明
            </p>
            <p>1、视频大小不超过300M，支持MP4和MOV格式</p>
            <p>2、视频无法与图片同时出现在同一条贴文</p>
          </el-col>
        </el-row>

        <div v-show="videoResources.length >0" v-if="isContentType=='video'">
          <div
            style="
              height: 30px;
              width: 100%;
              border-bottom: 1px solid #ddd;
              margin: 20px 0px;
            "
          >
            <div style="float: left; font-size: 14px">已上传视频</div>
            <div class="el-icon-close" style="float: right; color: red" @click="videoClose"></div>
            <div class="clear"></div>
          </div>
          <div>
            <div class="video-progress" v-if="progressBarShow">
              <el-progress :percentage="progressBar" :color="progressState"></el-progress>
            </div>
            <div
              v-loading="videoLoading"
              v-show="videoResources.length >0"
              style="text-align: left"
            >
              <video
                class="videos"
                style="width: 200px; height: 150px"
                :src="videoResources[0]"
                controls
                controlslist="nodownload"
              ></video>
              <a :title="video.name" style="margin-left: 10px" class="isEditName" v-if="isEditName">
                {{
                  video.name
                }}
              </a>
            </div>
          </div>
        </div>
        <!--video end-->

        <!-- audio start -->
        <!-- 添加音频 -->
        <div v-if="isContentType == 'audio'" class="audio-wrap">
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
                  style="
                    transform-origin: center top;
                    z-index: 2035;
                  "
                  x-placement="bottom"
                >
                  <div x-arrow="" class="popper__arrow"></div>
                  <el-upload
                    class="local-upload"
                    style="display: inline-block"
                    ref="uploadAudio"
                    :action="uploadUrl"
                    accept="mp3"
                    :file-list="audioResources"
                    :data="uploadParams"
                    :on-preview="handlePictureCardPreview"
                    :on-success="successedAudio"
                    :on-error="uploadFailed"
                    :on-remove="handleRemove"
                    :on-exceed="exceedAudio"
                    :on-progress="uploadProgressAudio"
                    :before-upload="beforeAudioUpload"
                    :with-credentials="true"
                    :multiple="false"
                    :limit="1"
                  >
                    <el-button type="text"> 本地上传 </el-button>
                  </el-upload>
                  <span>|</span>
                  <el-button
                    type="text"
                    @click="openChDialogAudio"
                  >
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
          <div v-show="isContentType == 'audio'">
            <div
              style="
                height: 30px;
                width: 100%;
                border-bottom: 1px solid #ddd;
                margin: 20px 0px;
              "
            >
              <div style="float: left; font-size: 14px">
                已上传音频
              </div>
              <div
                class="el-icon-close"
                style="float: right; color: red"
                @click="audioClose"
              ></div>
              <div class="clear"></div>
            </div>

            <div>
              <div
                class="video-progress"
                v-if="progressBarShowAudio"
              >
                <el-progress
                  :percentage="progressBarAudio"
                  :color="progressState"
                >
                </el-progress>
              </div>

              <div v-show="audio.url" style="text-align: left">
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

                <!--<div v-else class="video-button-wrap">
                  <el-input v-model="editAudioName"
                    type="text"
                    class="inputVideoName"
                    size="mini"
                  >
                  </el-input>
                  <el-button @click="audioNameCancel"
                    type="text"
                    class="buttonVideo"
                    size="mini"
                  >取消</el-button>
                  <el-button @click="audioNameSave"
                    type="text"
                    class="buttonVideo"
                    size="mini"
                  >保存</el-button>
                </div>
                <span 
                  v-if="isEditName"
                  @click="editAudioNameFn" 
                  class="el-icon-edit"
                ></span>-->
              </div>
            </div>
          </div>
        </div>

        <!-- audio end -->
        <!--time-->
        <!-- 时间选择 -->
        <el-row style="margin-top: 20px">
          <el-col :span="16">
            <el-radio v-model="pushObj.pushType" label="now">立即发布</el-radio>
            <el-radio v-model="pushObj.pushType" label="schedule">定时发布</el-radio>
          </el-col>
        </el-row>
        <div v-if="pushObj.pushType === 'schedule'" class="schedule-wrap">
          <template>
            <el-table :data="LeefinalCheckedUsers" type="index" style="width: 92%">
              <el-table-column label width="140">
                <template slot-scope="scope">
                  <el-date-picker
                    class="schedulePicker"
                    v-model="scope.row.schedulePicker"
                    :editable="false"
                    :clearable="false"
                    :picker-options="pickerOptions"
                    @change="schedulePicker(scope.$index, scope.row.schedulePicker)"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column width="100" label>
                <template slot-scope="scope">
                  <el-time-picker
                    class="scheduleTime"
                    v-model="scope.row.scheduleTime"
                    :editable="false"
                    :clearable="false"
                    :picker-options="{
                         selectableRange: `${scope.row.initScheduleTime}`+'-23:59:59'
                      }"
                    format="HH:mm"
                    placeholder="选择时间"
                  ></el-time-picker>
                </template>
              </el-table-column>
              <el-table-column class="table-td-timeZone" width="auto" label>
                <template slot-scope="scope">
                  <div class="timeZonePosition">
                    <div class="fl timezone-icon"></div>
                    <div class="fl" style="width:200px">
                      <el-select
                        class="scheduleTimeZone"
                        v-model="scope.row.scheduleTimeZone"
                        @change="choiceTimeZone(scope.$index, scope.row.scheduleTimeZone)"
                        placeholder="选择时区"
                      >
                        <el-option
                          v-for="item in timeZoneOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="clear"></div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <!--time end-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPost">提交审核</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" class="imgPreviewlee">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <!--编辑 end-->
    <!-- 素材库 -->
    <img-lib
      ref="cDialog"
      :checkedUsers="checkedUsers"
      :fileListGifImgs="fileListGifImgs"
      :fileListImgs="fileListImgs"
      @closeDialog="getImgLibCloseDialog"
      @showuploadImg="getShowuploadImg"
      @chFileListImgs="getFileListImgs"
      @chFileListGifImgs="getFileListGifImgs"
    ></img-lib>
    <!-- 裁剪 -->
    <img-cropper
      ref="cCropper"
      :cropperImgSrc="cropperImg"
      :imgName="imgFileName"
      @piccropper="handleScissor"
      @srcscissor="getPicSrc"
    ></img-cropper>

    <!-- 音频库 -->
    <audio-lib
      ref="cDialogAudio"
      :checkedUsers="finalCheckedUsers"
      :fileListAudio="fileListAudio"
      @closeDialog="getAudioLibCloseDialog"
      @showuploadAudio="getShowuploadAudio"
      @chFileListAudio="getFileListAudio"
    ></audio-lib>
  </div>
</template>   


<script>

import { mapGetters } from "vuex";
import moment from "moment";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import ImgLib from "../push/components/imgLib";

import ImgCropper from "../push/components/imgCropper.vue";
import AudioLib from "../push/components/audioLib";
import { timeZone } from "@/utils/timeZone";
import { setBase64 } from "@/utils/setBase64";
import local from "@/utils/local";
import UrlSearch from "@/utils/urlSearch";
import {
  pushAuditSubmitted,
  pushcontentID,
  pushAuditcancelPublish,
  pushAuditPendingPushContent,
  pushcontentEditSubmit
} from "@/api/examin";
import { queryMyteams } from "@/api/team";

import {
  getMemberList
} from "@/api/examin";
import Vviewer from "@/mixins/Vviewer";

var checkedArr = [];
export default {
  name: "reviewer",
  mixins: [Vviewer],
  components: { Pagination, ImgLib, AudioLib, ImgCropper },
  data() {
    return {
      dialogReviewer: '',
      dialogEfuseTxt: '',
      dialogEfuse: false,
      isthree:'',//
      editVideoName: "",
      currentPage: "",
      tableKey: 0,
      listLoading: false,
      total: 0,
      leeList: [],
      leeListQuery: {
        title: "",
        page: 1,
        limit: 5,
        pushContentAuditStatus: "",
        teamId: ''
      },
      myteams: [],
      members: [],
      html: "",
      pushStatus: false,
      openActive: "",
      disabled: false,
      //lee
      isContentType: "",
      options: [
        {
          value: "100",
          label: "待审核"
        },
        {
          value: "101",
          label: "审核拒绝"
        }
      ],
      value: "0",
      centerDialogVisible: false, //编辑

      pushObj: {
        checkedUsers: [],
        resourcesUrl: [],
        content: "", //输入内容
        linkUrl: "",
        contentType: "",
        pushType: "now",
        scheduleTime: "",
        videoTitle: false
      },
      fbFlag: false,
      twFlag: false,
      ytbFlag: false,
      twTextMaxLen: 280,
      fbTextMaxLen: 63206,
      ytbTextMaxLen: 5000,
      currentLength: 0,
      maxlength: 1000,
      //img
      userTypes: 0,
      userType: {
        WEIBO: 2,
        FACEBOOK: 4,
        TWITTER: 8,
        WECHAT_OPEN: 16
      },
      dialogVisible: false,
      dialogImageUrl: "",
      checkedUsers: [],
      // finalCheckedUsers: [ ],
      finalCheckedUsers: [],
      LeefinalCheckedUsers: [
        {
          schedulePicker: new Date(),
          scheduleTime: new Date(),
          initScheduleTime: new Date(),
          scheduleTimeZone: "(+08:00) China Time - Beijing"
        }
      ],
      fileListTwitterImgs: [],
      showDialog: false,
      cropper: "", //裁剪对象
      cropperImg: "", //裁剪图片
      width: 0, //裁剪
      height: 0, //裁剪
      imgFileName: "",
      dialogVisibleCrop: false,
      fileListImgs: [],
      fileListGifImgs: [],

      fileList: [],
      fileTypeMap: {
        IMAGE: "图片",
        VIDEO: "视频"
      },
      showuploadImg: "",
      imgLoading: false,
      imageResources: [],
      uploadUrl: `${process.env.VUE_APP_BASE_API}/resource/upload`,
      //video
      isEditName: true,
      videoResources: [],
      audioResources: [],
      fileListAudio: [],
      editAudioName: '',
      isTopicTitleEmpty: true,
      uploadParams: {
        duration: 0,
        width: 0,
        height: 0,
        size: 0
      },
      video: { url: "", name: "" },
      audio: {url: "", name: ""},
      progressBarShowAudio: false,
      fileTypeMap: {
        IMAGE: "图片",
        VIDEO: "视频"
      },
      showupload: "",
      showuploadVideo: "",
      showuploadImg: "",
      progressBar: 0,
      progressState: "#67c23a",
      progressBarShow: false,
      videoLoading: false,
      //日期
      pickerOptions: {
        disabledDate: time => {
          return this.dealDisabledDate(time);
        }
      }
      //lee end
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
        case "FACEBOOK":
          return "f";
          break;
        case "LINKEDIN":
          return "in";
          break;
        case "TWITTER":
          return "t";
          break;
        default:
          break;
      }
      //return statusMap[status];
    }
  },
  computed: {
    ...mapGetters(["oauthUsers"]),
    filteredOauthUsers() {
      if (this.leeListQuery.type) {
        return this.oauthUsers.filter(
          u => u.oauthType === this.leeListQuery.type.toUpperCase()
        );
      } else {
        return this.oauthUsers;
      }
    },
    scheduleTime() {
      let now = new Date();
      let time = now.getTime() + 1000 * 60 * 60;
      return new Date(time);
    }
  },
  mounted() {
    //全部团队
    queryMyteams()
      .then((res) => {
        this.myteams = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

      //选择团队
      let _this = this;
      let userId = this.$store.getters.id;
      getMemberList({
        memberRole: {
          name: null
        }
      })
        .then(function(response) {
          const newData = response.data;
          newData.forEach(item => {
            _this.members.push({
              userId: item.userId,
              nickname: item.nickname
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        });

    //已读状态
    // document.querySelector('.reviewerRemind .svg-icon').style.display = 'none';
  },
  methods: {
    //拒绝理由
    efuseHandleClose() {
      this.dialogEfuse = false;
      this.dialogEfuseTxt = '';
    },
    dialogEfuseFn(item) {
      this.dialogEfuse = true;
      this.$nextTick(() => {
        this.dialogReviewer = item.reviewer[0];
        // item.reviewer.forEach(v => {
        //   this.dialogReviewer += (v + ' ');
        // })
        this.dialogEfuseTxt = item.rejectionReason;
      })
    },
    //edit
    validateTextLength(value) {
      //中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      let mat = value.match(cnReg);
      let length = 0;
      if (mat) {
        this.currentLength = mat.length * 2 + (value.length - mat.length);
      } else {
        this.currentLength = value.length;
      }
    },
    //img
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片上传之前
    beforeUpload1(file) {
      let flag = false;
      let tips = "";
      this.uploadImgCount = this.uploadImgCount + 1;

      if (this.fileListImgs.length + this.fileListGifImgs.length >= 9) {
        this.$message({
          message: "图片最多是9张",
          type: "warning"
        });
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 <= 5;
      if (!isLt5M) {
        this.$message.error("图片大小超过5M！");
        return false;
      }
      this.imgLoading = true;
      return isLt5M;
    },
    beforeUpload2(file) {
      if (this.fileListImgs.length + this.fileListGifImgs.length >= 9) {
        this.$message({
          message: "图片最多是9张",
          type: "warning"
        });
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 <= 5;
      if (!isLt5M) {
        this.$message.error("图片大小超过5M！");
        return false;
      }
      this.imgLoading = true;
      return isLt5M;
    },
    //素材上传失败
    uploadFailed(err, file, fileList) {
      this.$message.error("上传失败");
    },
    //素材上传成功
    successed(response, file, fl) {
      let imgObj = {
        name: "",
        url: "",
        type: "",
        id: "",
        checked: true,
        mediaType: ""
      };
      this.$nextTick(() => {
        if (response.code == 200) {
          let res = response.data[0];

          let checkedUsers = JSON.parse(JSON.stringify(this.checkedUsers));
          if (res.obj.resourceType == "IMAGE") {
            this.imgLoading = false;
            this.showupload = "image";
            this.uploadImg("img-btn");
            this.pushObj.resourcesUrl.push(res.url);
            imgObj.name = res.name;
            imgObj.url = res.url;
            imgObj.id = res.id;

            if (this.fileListImgs.length + this.fileListGifImgs.length >= 9) {
              this.$message.error("最多可上传9张图片");
              return;
            }
            if (this.fileListTwitterImgs.length <= 4) {
              this.fileListTwitterImgs.push(imgObj);
            }
            if (this.imageResources.length < 10) {
              //gif
              if (res.url.indexOf(".gif") != -1) {
                this.finalCheckedUsers.forEach(item => {
                  item.mediaType = "2";
                });

                imgObj.mediaType = "2";
                this.fileListGifImgs.push(imgObj);
              } else {
                //非gif
                imgObj.mediaType = "1";
                this.fileListImgs.push(imgObj);

                this.finalCheckedUsers.forEach(item => {
                  item.mediaType = "1";
                });
              }

              checkedArr.push(imgObj);
            }
            // this.finalCheckedUsers = checkedUsers;
          } else {
            this.progressBarShow = false;
            this.progressBar = 0;
            this.videoLoading = false;
            this.pushObj.resourcesUrl.push(res.url);
            this.videoResources.push(res.url);
            this.video.url = res.url;
            this.video.name = res.name;
            this.video.id = res.id;
            this.editVideoName = res.name;

            this.finalCheckedUsers.forEach(item => {
              item.mediaType = "3";
            });

            // this.finalCheckedUsers = checkedUsers;
          }
        } else {
        }
      });
    },
    changePublishBtnStatus() {
      this.publishing = !this.publishing;
    },
    exceed() {
      this.$message.error("最多只能上传9张图片");
    },
    //素材库
    openChDialogPics() {
      this.$refs.cDialog.openDialog();
    },
    getShowuploadImg(msg) {
      this.showuploadImg = msg;
    },
    getImgLibCloseDialog(msg) {
      this.dialogPicsVisible = false;
    },
    getFileListImgs(msg) {
      this.fileListImgs = msg;
    },
    getFileListGifImgs(msg) {
      this.fileListGifImgs = msg;
    },
    //关闭图片
    imageClose() {
      if (this.fileListImgs.length > 0) {
        this.$confirm("是否删除已添加的图片?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$refs.upload.abort();
            this.$refs.upload.clearFiles();
            this.imageResources = [];
            this.pushObj.resourcesUrl = [];
            this.fileList = [];
            this.fileListImgs = [];
            this.pushObj.linkUrl = "";
            this.open(() => {
              this.showuploadImg = "";
            });
          })
          .catch(() => {});
      } else {
        this.$refs.upload.abort();
        this.open(() => {
          this.showuploadImg = "";
        });
      }
    },
    handleRemove(file, fileList) {
      this.videoResources = [];
      this.audioResources = [];
    },

    //裁剪
    handleScissor(file, index) {
      let that = this;
      this.piccropperIndex = index;
      // this.cropperImg = file.url;
      setBase64(file.url, base64 => {
        that.cropperImg = base64;
        that.imgFileName = file.name;
        that.$refs.cCropper.piccropper();
      });
    },
    handleZoom(file, index) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getPicSrc(msg) {
      this.fileListImgs[this.piccropperIndex].url = msg.url;
    },
    handleRemoveList(file, idx) {
      let filterImg = [];
      if (file.url.indexOf(".gif") != -1) {
        filterImg = this.fileListGifImgs;
        this.fileListGifImgs = this.removeArr(filterImg, idx);
      } else {
        filterImg = this.fileListImgs;
        this.fileListImgs = this.removeArr(filterImg, idx);
      }

      this.imageResources = this.imageResources.filter(u => {
        u.url != file.url;
      });

      if (this.fileListImgs.length == 0 && this.fileListGifImgs.length == 0) {
        this.showuploadImg = "";
      }

      this.pushObj.resourcesUrl = this.pushObj.resourcesUrl.filter(u => {
        u !== file.url;
      });
    },
    handleRemoveListGif(file, idx) {
      this.fileListGifImgs.splice(idx);
      if (this.fileListGifImgs.length > 0) {
        this.imageResources = this.imageResources.filter(u => {
          u.url != file.url;
        });
      }
      this.selectUser();
      if (this.fileListGifImgs.length == 0 && this.fileListImgs.length == 0) {
        this.showuploadImg = "";
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    setUserTypes(users) {
      this.userTypes = 0;
      users.forEach((v, k) => {
        this.userTypes |= this.userType[v.oauthType];
        this.active.push(false);
        this.editItem.push(false);
        this.cancelActive.push(false);
        this.editActive.push(true);
        this.pushActive.push(false);
        this.saveActive.push(false);
        //暂存数组
        this.storageArr.push({ id: v.id, content: "" });
      });

      if (this.userType.TWITTER == 8) {
        this.isOauthType_tw = false;
      }

      if (this.userTypes & this.userType.TWITTER) {
        this.isOauthType_tw = true;
      }

      if (
        (this.userTypes & this.userType.WEIBO) |
        (this.userTypes & this.userType.TWITTER)
      ) {
        this.maxlength = 280;
      } else {
        this.maxlength = 1000;
      }
    },
    selectUser() {
      this.selectUserDialogVisible = false;
      //这里处理一下数据加入图片和视频的单选操作标识
      let checkedUsers = JSON.parse(JSON.stringify(this.checkedUsers));
      checkedUsers.forEach((v, k) => {
        v.child_content = this.pushObj.content;
        v.scheduleTimeZone = "(+08:00) China Time - Beijing";
        v.schedulePicker = new Date(this.scheduleTime);
        v.initScheduleTime = new Date();
        v.scheduleTime = this.scheduleTime;
      });
      if (this.fileListImgs.length == 0 && this.fileListGifImgs.length > 0) {
        checkedUsers.forEach(item => {
          item.mediaType = "2";
        });
      } else if (
        this.fileListImgs.length == 0 &&
        this.fileListGifImgs.length == 0 &&
        this.videoResources.length > 0
      ) {
        checkedUsers.forEach(item => {
          item.mediaType = "3";
        });
      } else {
        checkedUsers.forEach(item => {
          item.mediaType = "1";
        });
      }

      this.finalCheckedUsers = checkedUsers;
      this.setUserTypes(this.finalCheckedUsers);
      if (this.weiboUserSelectedVideo) {
        this.weiboVideoAlert();
      }
    },
    removeArr(arr, dx) {
      if (isNaN(dx) || dx > this.length) {
        return false;
      }
      for (var i = 0, n = 0; i < arr.length; i++) {
        if (arr[i] != arr[dx]) {
          arr[n++] = arr[i];
        }
      }
      arr.length -= 1;
      return arr;
    },
    //本地上传
    uploadImg(type) {
      if (type == "img-btn") {
        this.open(() => {
          this.showupload = "image";
          this.showuploadImg = "image";
        });
      }
      if (!this.showupload || this.showupload == "video")
        this.open(() => {
          this.showupload = "image";
          this.showuploadImg = "image";
        });
      else
        this.open(() => {
          this.showupload = "";
        });
    },
    open(func) {
      func();
    },
    //音频上传之前
    beforeAudioUpload(file) {
      // 文件类型进行判断
      const isAudio = file.type === "audio/mp3" || file.type === "audio/mpeg";
      // 限制上传文件大小 300M
      const isLt300M = file.size / 1024 / 1024 <= 300;
      const isTime60S = this.audioDuration >= 60 ? true : '';

      if (!isAudio) {
        this.$message.error("上传文件只能是Mp3格式!");
        return false;
      } else {
        if (!isLt300M) {
          this.$message.error("上传文件大小不能超过 300MB!");
          return false;
        }
      }
      this.progressBarShowAudio = true;
      // 获取时长
      this.getTimes(file);
      this.uploadVideo("audio-btn");
      return isAudio && isLt300M
    },
    getTimes(file) {
      let that = this;
      var content = file;
      //获取时长
      var url = URL.createObjectURL(content);
      var audioElement = new Audio(url);
      audioElement.addEventListener("loadedmetadata", (_event) => {
        // that.uploadParams.duration = audioElement.duration;
      });
    },
    exceedAudio() {
      this.$message.error("最多可上传1个音频");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadProgressAudio(ev, file, fileList) {
      this.progressBarAudio = Math.floor(ev.percent)
    },
    uploadFailed(err, file, fileList) {
      this.$message.error("上传失败");
    },
    beforeRemove(file, fileList) {
      return false;
    },
    //删除音频
    audioClose() {
        this.beforeRemove();
        this.$refs.uploadAudio.abort();
        this.audioResources = [];
        this.fileListAudio = [];
        this.audio.url = '';
        this.audio.name = '';
   
    },
    //上传音频
    successedAudio(response, file, fl) {

      let res = response.data[0].obj;
      let audioObj = {
        name: "",
        url: "",
        type: "",
        id: "",
        checked: true,
        mediaType: "",
        width: res.width,
        height: res.height,
        duration: res.duration,
        size: res.size
      };
      if (response.code == 200) {
        let res = (response.data[0])
        this.showuploadAudio = 'audio';
        this.progressBarShowAudio = false;
        this.progressBarAudio = 0;
        this.audio.url = res.obj.url;
        this.audio.name = res.obj.title;

        audioObj.url = res.obj.url;
        audioObj.name = res.obj.title;
        audioObj.id = res.obj.id;
        this.editAudioName = res.obj.title;
        this.fileListAudio.push(audioObj);
        this.audioResources.push(audioObj);
      }
    },
    //音频库
    openChDialogAudio() {
      this.$refs.cDialogAudio.openDialog();
    },
    getAudioLibCloseDialog(msg) {
      this.dialogAudioVisible = msg;
    },
    getShowuploadAudio(msg) {
      this.showuploadAudio = msg;
    },
    getFileListAudio(msg) {
      this.fileListAudio = msg;
      if (msg.length) {
        this.audio.url = msg[0].url;
        this.audio.name = msg[0].title;
      }

    },
    //video
    //视频上传之前
    beforeVideoUpload(file) {
      if (this.containsWeibo) {
        this.weiboVideoAlert();
        return false;
      }

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
      this.uploadVideo("video-btn");
      return true;
    },
    editVideoNameFn() {
      this.editVideoName = this.video.name;
      this.isEditName = false;
    },
    videoNameCancel() {
      this.editVideoName = this.video.name;
      this.isEditName = true;
    },
    videoNameSave() {
      this.video.name = this.editVideoName;
      this.isEditName = true;
      this.saveEdit();
    },
    //关闭视频
    videoClose() {
      if (this.videoResources.length > 0) {
        this.$confirm("是否删除已添加的素材?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // this.pushObj.resourcesUrl = [];
            this.videoResources = [];
            this.fileList = [];
            this.pushObj.contentType = "";
            this.pushObj.linkUrl = "";
            this.open(() => {
              this.showuploadVideo = "";
            });
            this.selectUser();
          })
          .catch(() => {});
      } else {
        this.beforeRemove();
        this.$refs.uploadVideo.abort();
        this.videoResources = [];
        this.fileList = [];
        this.open(() => {
          this.showuploadVideo = "";
        });
      }
    },
    uploadVideo(type) {
      if (this.containsWeibo) {
        this.weiboVideoAlert();
        return;
      }
      if (type == "video-btn") {
        this.open(() => {
          this.showuploadVideo = "video";
          this.showupload = "video";
        });
      }
    },
    //视频重命名
    saveEdit() {
      let param = {
        id: this.video.id,
        url: this.video.url,
        title: this.video.name,
        description: null,
        tags: null,
        public: false
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
        .then(response => {
          this.$message.success("成功");
        })
        .catch(msg => {
          this.$message.error("失败");
        });
    },
    exceedVideo() {
      this.$message.error("最多可上传1个视频");
    },
    uploadProgress(ev, file, fileList) {
      this.progressBar = Math.floor(ev.percent);
    },
    //时间
    dealDisabledDate(time) {
      if (new Date(time).getTime() > new Date().getTime()) {
        return time.getTime() <= new Date().getTime(); //时间范围必须是时间戳
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
        debugger;
      let date = this.scheduleTime.toString();
      this.LeefinalCheckedUsers[idx].schedulePicker = new Date(
        date.replace(/(\+[0-9]{4})|(\-[0-9]{4})/, str)
      );
      this.LeefinalCheckedUsers[idx].initScheduleTime = new Date(
        date.replace(/(\+[0-9]{4})|(\-[0-9]{4})/, str)
      );
      this.LeefinalCheckedUsers[idx].scheduleTime = new Date(
        date.replace(/(\+[0-9]{4})|(\-[0-9]{4})/, str)
      );
      console.log(this.LeefinalCheckedUsers);
    },
    schedulePicker(idx, time) {
      if (new Date(time).getTime() > new Date().getTime()) {
        this.LeefinalCheckedUsers[idx].initScheduleTime = "00:00:00";
      } else {
        this.LeefinalCheckedUsers[idx].initScheduleTime = new Date();
        this.LeefinalCheckedUsers[idx].scheduleTime = new Date(
          this.scheduleTime
        );
      }
    },
    //edit end
    handleFilter(type) {
      this.leeGetList.page = 1;
    },
    //时间转换
    formatDate(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    //展开收起
    openList(item, idx) {
      this.leeList[idx].isOpen = !this.leeList[idx].isOpen;
    },
    closeList(item, idx) {
      this.leeList[idx].isOpen = !this.leeList[idx].isOpen;
    },
    //list 选择状态
    selectStatus(val) {
      const newDate = Object.assign({}, this.leeListQuery, {
        pushContentAuditStatus: val
      });
      this.leeListQuery = Object.assign({}, this.leeListQuery, newDate);
    },
    //list 搜索
    serarch() {
      const newDate = Object.assign({}, this.leeListQuery, {
        page: 1
      });
      this.leeListQuery = Object.assign({}, this.leeListQuery, newDate);
      this.leeGetList();
    },
    //list 翻页
    jumpPage() {
      if (this.currentPage != "" && typeof this.currentPage == "number") {
        this.leeListQuery.page = this.currentPage;
        this.leeGetList();
        scrollTo(0, 800);
        this.currentPage = "";
      }
    },
    //lee 取消发布
    quxiaofabu(id) {
      this.$confirm(
        "确定取消发送贴文吗？确定后，贴文将从发布队列中删除。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var _this = this;
          pushAuditcancelPublish(id).then(response => {
            this.$message({
              message: "取消发布成功",
              type: "success",
              duration: 1000
            });
            _this.leeGetList();
          });
        })
        .catch(() => {});
    },
    //list 获取列表
    leeGetList() {
      this.listLoading = true;
      var _this = this;
      pushAuditSubmitted(this.leeListQuery).then(response => {
        let newData = response.data.list;
        newData.forEach(item => {
          item.isOpen = true;
        });
        _this.leeList = [];
        _this.leeList = newData;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    //点击编辑
    editeTop(id) {
      pushcontentID(id).then(response => {
        this.centerDialogVisible = true;
        this.modelDataList(response.data);
      });
    },
    //编辑数据list
    modelDataList(leeData) {

      this.isthree = leeData.socialPlatform
      this.isContentType = leeData.contentType; //判断是image video audio ""
      this.videoResources = [];
      this.fileListImgs = [];
      this.fileListGifImgs = [];
      this.audioResources = [];
      if (this.isContentType == "image") {
        //如果是图片
        const newData = leeData.resourcesUrl;
        newData.forEach(item => {
          if (item.indexOf("gif") == -1) {
            this.fileListImgs.push({
              url: item
            });
          } else {
            this.fileListGifImgs.push({
              url: item
            });
          }
          console.log(item);
        });
      } else if (this.isContentType == "video") {
        //如果是视频
        this.videoResources = leeData.resourcesUrl;
      }
      else if (this.isContentType == 'audio') {
        this.audioResources = leeData.resourcesUrl;
        this.audio.name = leeData.resourceInfos[0].title;
        this.audio.url = this.audioResources[0]
      }

      if (leeData.socialPlatform == "FACEBOOK") {
        this.fbFlag = true;
      } else if (leeData.socialPlatform == "TWITTER") {
        this.twFlag = true;
      } else if (leeData.socialPlatform == "YOUTUBE") {
        this.ytbFlag = true;
      }
      const newfinalCheckedUsers = Object.assign(
        {},
        this.LeefinalCheckedUsers[0],
        {
          schedulePicker: new Date(leeData.scheduleTime),
          scheduleTime: new Date(leeData.scheduleTime),
          initScheduleTime: new Date(),
          scheduleTimeZone: "(+08:00) China Time - Beijing"
        }
      );
      this.LeefinalCheckedUsers = this.LeefinalCheckedUsers.splice(
        0,
        1,
        newfinalCheckedUsers
      );
      let newResourceInfos = [];
      if (leeData.hasOwnProperty("resourceInfos")) {
        newResourceInfos = leeData.resourceInfos;
      }
      const newPushObj = Object.assign({}, this.pushObj, {
        id: leeData.id, //贴文id
        topicTitle: leeData.topicTitle, //标题
        checkedUsers: [],
        resourcesUrl: leeData.resourcesUrl,
        content: leeData.content, //输入内容
        contentType: leeData.contentType,
        pushType: leeData.pushType,
        scheduleTime: leeData.scheduleTime,
        videoTitle: leeData.videoTitle,
        resourceInfos: newResourceInfos
      });
      this.pushObj = Object.assign({}, this.pushObj, newPushObj);
      this.validateTextLength(this.pushObj.content);
    },
    //提交修改
    submitPost() {
      let newResourcesUrl = [];
      if (this.isContentType == "image") {
        this.fileListImgs.forEach(item => {
          newResourcesUrl.push(item.url);
        });
        this.fileListGifImgs.forEach(item => {
          newResourcesUrl.push(item.url);
        });
      } else if (this.isContentType == "video") {
        newResourcesUrl.push(this.videoResources[0]);
      } else {
        newResourcesUrl = [...this.pushObj.resourcesUrl];
      }
      if (!newResourcesUrl.length) {
        this.isContentType = "";
      }
      let submitscheduleTime;
      if (this.pushObj.pushType == "now") {
        submitscheduleTime = new Date().getTime();
      } else {
        submitscheduleTime = new Date(
          this.LeefinalCheckedUsers[0].scheduleTime
        ).getTime();
      }

      const newData = {
        id: this.pushObj.id, //推文id
        topicTitle: this.pushObj.topicTitle, //标题
        resourcesUrl: newResourcesUrl,
        content: this.pushObj.content,
        contentType: this.isContentType, //image/viedo/link/audio没有选择为“” 编辑状态不变
        pushType: this.pushObj.pushType, //now/schedule
        scheduleTime: submitscheduleTime, //时间戳
        videoTitle: false,
        resourceInfos: this.pushObj.resourceInfos
      };
      if (!newData.content.length) {
        this.$notify({
          title: "注意",
          message: "请输入内容！",
          type: "error",
          duration: 2000
        });
        return false;
      }
      if (this.currentLength > this.ytbTextMaxLen) {
        this.$notify({
          title: "注意",
          message: "内容字数超过Youtube上限！(含链接字数)",
          type: "error",
          duration: 2000
        });
        return false;
      }
      if (this.currentLength > this.twTextMaxLen&&this.isthree=="TWITTER") {
        this.$notify({
          title: "注意",
          message: "内容字数超过Twitter上限",
          type: "error",
          duration: 2000
        });
        return false;
      }
      if (this.currentLength > this.fbTextMaxLen&&this.isthree=="FACEBOOK") {
        this.$notify({
          title: "注意",
          message: "内容字数超过Facebook上限！",
          type: "error",
          duration: 2000
        });
        return false;
      }
      var _this = this;
      pushcontentEditSubmit(newData).then(response => {
        _this.$message({
          message: "编辑成功",
          type: "success",
          duration: 1000
        });
        _this.centerDialogVisible = false;
      });
    }
  },

  created() {
    this.leeGetList();
    this.timeZoneOptions = timeZone(); //time
    //未读状态

  }
};


</script>

<style lang="scss" scoped>
@import "../../styles/ggjpc.css";
@import "./reviewer.scss";
.leeEdite {
  .content-oauthType {
    & {
      position: relative;
    }
    .badge {
      position: absolute;
      border: white solid 1px;
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
      @include aouthTypeIcon(-2px, 24px, 16px, 16px, 16px);
    }
  }
}
</style>
<style lang="scss" >
$wxBg: #24da70;
$wbBg: orangered;
$fbBg: #0e71e8;
$ttBg: #6ba2d6;
$qqBg: #6ba2d6;
.leeEdite {
  .tips-upload {
    display: inline-block;
    color: #928d8d;
    font-size: 12px;
  }
  .social-number {
    color: #7e7ef4;
    font-size: 14px;
    margin-left: 10px;
  }
  .character_count {
    margin-right: 5px;
  }
}
.leeEdite .fb-svg-container {
  background-color: $fbBg;
  font-size: 16px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 0;
  display: inline-block;
  border-radius: 100%;
  text-align: center;
  margin: 0;
}
.leeEdite .share-icon svg,
.share-icon i {
  margin-right: 6px;
  font-size: 14px;
}
.leeEdite .svg-icon {
  width: 0.8rem;
  font-size: 12px;
  margin-top: 0;
  // height: 0.8rem;
}
.leeEdite {
  .el-upload-list {
    display: none !important;
  }
  .img-lists {
    & {
      list-style: none;
      padding: 0;
      margin: 0;
      display: inline-block;
    }
    li {
      width: 136px;
      height: 136px;
      border: 1px solid #ddd;
      display: inline-block;
      margin: 0px 10px 10px 0;
      position: relative;
      overflow: hidden;
      text-align: center;
      border-radius: 5px;
    }
    li:hover .upload-remove,
    li:hover .upload-scissor,
    li:hover .upload-zoom-in {
      display: block;
    }
    img {
      display: inline-block;
      max-width: 134px;
      max-height: 136px;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
    }
    .upload-remove {
      display: none;
      position: absolute;
      width: 20px;
      height: 20px;
      right: 0;
      top: 0;
      background-color: #433a27;
      cursor: pointer;
    }
    .el-icon-delete {
      color: #fff;
      font-size: 14px;
    }
    .upload-scissor {
      color: #fff;
      font-size: 14px;
      display: none;
      position: absolute;
      width: 20px;
      height: 20px;
      bottom: 0;
      background-color: #433a27;
      cursor: pointer;
    }
    .upload-zoom-in {
      color: #fff;
      font-size: 14px;
      display: none;
      position: absolute;
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      background-color: #433a27;
      cursor: pointer;
    }
    .upload-zoom-in i,
    .upload-remove i,
    .upload-scissor i {
      vertical-align: middle;
    }
  }
  .cardUpload-wrap123 {
    & {
      display: inline;
    }
    li {
      display: none;
    }
  }
  video {
    max-width: 100%;
    max-height: 300px;
    object-fit: cover;
  }

  .el-icon-picture {
    &::before {
      content: "\e79f";
      font-size: 1.5em;
    }
    & {
      color: #7e7ef4;
      vertical-align: middle;
    }
  }
  .el-icon-video-camera {
    &::before {
      content: "\e772";
      font-size: 1.5em;
    }
    & {
      color: #7e7ef4;
      vertical-align: middle;
    }
  }
  .title-picture {
    color: #7e7ef4;
    font-size: 14px;
  }
  .tips-pic,
  .tips-video {
    font-size: 12px;
    color: #b4b6b8;
    background-color: #f6f7fb;
    height: 148px;
    border-radius: 6px;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    -ms-border-radius: 6px;
    -o-border-radius: 6px;
  }
  .tips-pic p,
  .tips-video p {
    padding: 0px 10px;
  }
  .tips-pic :first-child,
  .tips-video :first-child {
    margin-bottom: 10px;
  }
  .bottom {
    clear: both;
    text-align: center;
  }
  .el-icon-info {
    color: #dcd92b;
    margin-right: 3px;
  }
  .el-upload--picture-card {
    width: 136px;
  }
  .upload-box-card {
    border: none;
    background-color: unset;
  }
}
.imgPreviewlee .el-dialog__header {
  padding: 20px 20px 10px;
  .el-dialog__headerbtn {
    top: 6px;
  }
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