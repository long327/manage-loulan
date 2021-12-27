<template>
  <div
    class="push-container left-container"
    v-loading="sendLoading"
    element-loading-text="拼命发送中..."
  >
    <el-row
      type="flex"
      justify="center"
      style="height: 50px; line-height: 30px"
    >
      <el-col :span="12">
        <span class="title"> 贴文准备 </span>
      </el-col>
      <el-col :span="12">
        <el-col :span="4">
          <span class="title"> 贴文预览 </span>
        </el-col>
        <el-col :span="5">
          <span
            class="pc el-icon-monitor"
            :class="{ isPhone: ispcTophone == 'isPC' }"
            @click="pcTophone('isPC')"
          ></span>
          <span>|</span>
          <span
            class="mobile el-icon-mobile-phone"
            :class="{ isPhone: ispcTophone == 'isPhone' }"
            @click="pcTophone('isPhone')"
          ></span>
        </el-col>
        <el-col :span="4" :offset="9">
          <el-button
            type="primary"
            @click.native="update"
            round
            v-bind:disabled="pushStatus"
          >
            <!-- <i class="el-icon-loading" v-show="pushStatus"></i> -->
            {{ activeName == "personal" ? "一键发布" : "提交审核" }}
          </el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="22" class="tools-container" ref="tools-area" :style="{height: GetWindowInfo.height}">
            <el-card style="overflow: auto;max-height: 880px;min-height: 878px;">
              <div class="grid-content bg-purple">
                <el-row style="margin: 10px 0">
                  <el-col :span="24">
                    <el-input
                      v-model="topicTitle"
                      type="text"
                      class="radius radius-30"
                      :class="{
                        isTopicTitleEmpty: topicTitle.length < 2 ? true : false,
                      }"
                      :input="topicTitleFn(topicTitle)"
                      placeholder="贴文主题至少2个字（必填）"
                    />
                  </el-col>
                </el-row>
                <div class="content-wrap">

                  <el-row>
                    <div
                      class="content-left-wrap"
                      :class="{
                        fbMaxLen: fbFlag
                          ? fbTextMaxLen -
                              currentLength -
                              pushObj.linkUrl.length <=
                            0
                          : false,
                        twMaxLen: twFlag
                          ? twTextMaxLen -
                              currentLength -
                              pushObj.linkUrl.length <=
                            0
                          : false,
                      }"
                    >
                  <el-row>
                        <el-row v-if="activeName == 'personal'"
                          style="padding: 10px;min-height:50px;background-color:#f2f2fe;"
                        >
                          <el-col
                            style="margin-right: 10px; margin-top: 12px;width:52px;"
                            v-for="(user, index) in finalCheckedUsers"
                            :key="user.id"
                          >
                            <el-badge type="info" class="oauthType-badge">
                              <el-avatar
                                :size="50"
                                :src="user.avatar"
                                class="img-user"
                              >
                              </el-avatar>
                              <svg-icon
                                :icon-class="user.oauthType.toLowerCase()"
                                :class="'badge ' + user.oauthType.toLowerCase()"
                              />

                              <el-button
                                style="
                                  position: absolute;
                                  left: 0px;
                                  top: 7px;
                                  color: #fff;
                                "
                                type="text"
                                class="btn-delete"
                                circle
                                @click="removeUser(user, index)"
                              >
                                删除
                              </el-button>
                            </el-badge>
                          </el-col>
                          <!-- 个人 -->
                          <div
                            :style="finalCheckedUsers.length < 1 ? 'text-align: center;margin:0 auto;padding-top:10px;' : 'text-align: left; margin-top:20px;margin-bottom:20px;display:inline-block;'"
                            style="
                              width:200px;
                              font-size: 14px;
                            "
                          >
                            <el-button
                              type="primary"
                              icon="el-icon-plus"
                              circle
                              @click="addSocial"
                            />
                            <p
                              v-if="finalCheckedUsers.length < 1"
                              class="social-number"
                              >选择社交号开始发帖吧</p
                            >
                          </div>
                        </el-row>
                        <el-row 
                          style="padding: 10px;min-height:50px;background-color:#f2f2fe;"
                          v-else>
                          <el-col
                            style="margin-right: 10px; margin-top: 10px"
                            :span="2"
                            v-for="(user, index) in checkedMember"
                            :key="user.id"
                          >
                            <el-badge type="info" class="oauthType-badge">
                              <el-avatar
                                :size="50"
                                :src="user.avatar"
                                class="img-user"
                              >
                              </el-avatar>
                              <svg-icon
                                :icon-class="user.source.toLowerCase()"
                                :class="'badge ' + user.source.toLowerCase()"
                              />

                              <el-button
                                style="
                                  position: absolute;
                                  left: 0px;
                                  top: 7px;
                                  color: #fff;
                                "
                                type="text"
                                class="btn-delete"
                                circle
                                @click="removeUser(user, index)"
                              >
                                删除
                              </el-button>
                            </el-badge>
                          </el-col>
                          <!-- 团队 -->
                          <div
                            :style="finalCheckedUsers.length < 1 ? 'text-align: center;margin:0 auto;padding-top:10px;' : 'text-align: left; margin-top:20px;margin-bottom:20px;display:inline-block;'"
                            style="
                              width:200px;
                              font-size: 14px;
                            "
                          >
                            <el-button
                              type="primary"
                              icon="el-icon-plus"
                              circle
                              @click="addSocial"
                            />
                            <p v-if="finalCheckedUsers.length < 1" class="social-number"
                              >选择社交号开始发帖吧</p
                            >
                          </div>
                        </el-row>

                        <el-input
                          style="padding: 0px"
                          v-model="pushObj.content"
                          type="textarea"
                          :autosize="{ minRows: 5, maxRows: 7 }"
                          @input="validateTextLength(pushObj.content)"
                          class="radius radius-30 textarea-content"
                          placeholder="请输入内容"
                        />
                      </el-row>
                      <!-- <el-row class="word-limit">
                          <el-col :span="2" :offset="22" v-if="isOauthType_tw"><i class="iconfont icontw"></i>
                              <span class="character_count"
                          :style="{ color: maxlength-currentLength-pushObj.linkUrl.length >= 0 ? '#888888' : 'red' }" >{{maxlength-currentLength-pushObj.linkUrl.length}}</span>
                          </el-col>
                          <el-col :span="2" :offset="21" v-else> <i class="iconfont"></i>
                            <span class="character_count"
                            :style="{ color: maxlength-currentLength >= 0 ? '#888888' : 'red' }" >{{maxlength-currentLength}}
                            </span>
                          </el-col>
                      </el-row> -->

                      <el-row style="margin-top: 20px">
                        <el-col style="text-align: left"> </el-col>

                        <!-- 账号字符限制 -->
                        <el-col :span="24" style="text-align: right;margin-bottom:5px;">
                          <span class="tips-upload">
                           
                            <!-- facebook限制 -->
                            <span
                              class="character_count"
                              style="display: inline-block; min-width: 56px"
                              :style="{
                                color: fbFlag
                                  ? fbTextMaxLen -
                                      currentLength -
                                      pushObj.linkUrl.length >=
                                    0
                                    ? '#888888'
                                    : 'red'
                                  : '#888888',
                              }"
                            >
                              <span class="fb-svg-container"
                                ><svg-icon icon-class="facebook" class="icon"
                              /></span>

                              {{
                                fbFlag
                                  ? fbTextMaxLen -
                                    currentLength -
                                    pushObj.linkUrl.length
                                  : fbTextMaxLen
                              }}
                            </span>
                            <!-- twitter限制 -->
                            <span
                              class="character_count"
                              style="display: inline-block; min-width: 45px"
                              :style="{
                                color: twFlag
                                  ? twTextMaxLen -
                                      currentLength -
                                      pushObj.linkUrl.length >=
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
                                    currentLength -
                                    pushObj.linkUrl.length
                                  : twTextMaxLen
                              }}
                            </span>
                            <!-- youtube限制 -->
                            <span
                              class="character_count isYoutube-authorized"
                              style="display: inline-block; min-width: 55px"
                              :style="{
                                color: ytbFlag
                                  ? ytbTextMaxLen -
                                      currentLength -
                                      pushObj.linkUrl.length >=
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
                        </el-col>
                        <!-- <el-button icon="el-icon-link" circle @click="uploadLink" 
                      :class="{'el-button--success':showupload ==='link'}"/> -->
                      </el-row>
                    </div>
                    <el-row style="margin: 20px 0px">
                      <!-- <div v-show="showupload == 'image'"> -->

                      <!-- 添加图片 -->
                      <el-col>
                        <span class="el-icon-picture-outline"> </span>
                        <span class="title-picture"> 添加图片</span>
                      </el-col>
                      <el-row style="margin: 20px 0px">
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
                                ref="upload"
                                :data="uploadParams"
                                :action="uploadUrl"
                                accept=".png,.jpg,.gif"
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
                                <el-button type="text"> 本地上传 </el-button>
                              </el-upload>
                              <span>|</span>
                              <el-button type="text" @click="openChDialogPics">
                                图片素材库
                              </el-button>
                            </div>

                            <div
                              class="upload-box-card el-upload el-upload--picture-card"
                            >
                              <i class="el-icon-plus"></i>
                            </div>
                          </div>

                          <!-- <el-tooltip
                              effect="light"
                              popper-class="tooltip-box"
                              offsetY="900"
                            >
                              <div slot="content">
     
                                <el-upload
                                  class="local-upload"
                                  style="display: inline-block"
                                  ref="upload"
                                  :action="uploadUrl"
                                  accept=".png,.jpg,.gif"
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
                                  <el-button type="text"> 本地上传 </el-button>
                                </el-upload>
                                <span>|</span>
                                <el-button
                                  type="text"
                                  @click="openChDialogPics"
                                >
                                  图片素材库
                                </el-button>
                              </div>

                              <div
                                class="upload-box-card el-upload el-upload--picture-card"
                              >
                                <i class="el-icon-plus"></i>
                              </div>
                            </el-tooltip> -->
                          <!-- </div> -->
                        </el-col>

                        <el-col :span="17" class="fr tips-pic">
                          <p><i class="el-icon-info" />说明</p>
                          <p>1、图片最多上传9张，支持JPG、PNG、GIF格式</p>
                          <p>2、JPG/PNG图片不超过5MB，GIF图片不超过8MB</p>
                          <p>
                            3、GIF图片无法与其他图片格式同时出现在同一条贴文
                          </p>
                          <p>
                            4、Youtube只支持添加视频，不支持发布图片贴文
                          </p>
                        </el-col>
                      </el-row>

                      <div
                        v-show="
                          showuploadImg == 'image' ||
                          fileListGifImgs.length > 0 ||
                          fileListImgs.length > 0
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
                          <div style="float: left; font-size: 14px">
                            已上传 JPG/PNG 图片
                          </div>
                          <div
                            class="el-icon-close12"
                            style="float: right; color: red"
                            @click="imageClose"
                          ></div>
                          <div class="clear"></div>
                        </div>
                        <div v-loading="imgLoading">
                          <ul class="img-lists">
                            <li
                              v-for="(item, index) in fileListImgs"
                              :key="index"
                            >
                              <div class="el-image-box">
                                <img :src="item.url" alt="" />
                                <div
                                  class="upload-remove"
                                  @click="handleRemoveList(item, index)"
                                >
                                  <i class="el-icon-delete"></i>
                                </div>
                                <div
                                  class="upload-scissor"
                                  @click="handleScissor(item, index)"
                                >
                                  <i class="el-icon-scissors"></i>
                                </div>
                                <div
                                  class="upload-zoom-in"
                                  @click="handleZoom(item, index)"
                                >
                                  <i class="el-icon-zoom-in"></i>
                                </div>
                              </div>
                            </li>
                            <span>
                              <!-- <el-upload
                                class="cardUpload-wrap123"
                                style="text-align:left;"
                                ref="upload"
                                :action="uploadUrl"
                                accept=".png,.jpg"
                                list-type="picture-card"
                                :file-list="imageResources"
                                :on-preview="handlePictureCardPreview"
                                :on-success="successed"
                                :on-error="uploadFailed"
                                :on-exceed="exceed"
                                :before-upload="beforeUpload2"
                                :with-credentials="true"
                                :multiple="true"
                                :limit="8"
                              >
                                <i class="el-icon-plus" />

                                <div slot="file" slot-scope="{ file }">
                                  <img
                                    class="el-upload-list__item-thumbnail"
                                    :src="file.url"
                                    alt=""
                                  />
                                  <span class="el-upload-list__item-actions">
                                    <span
                                      class="el-upload-list__item-delete"
                                      @click="handleScissor(file)"
                                    >
                                      <i class="el-icon-scissors"></i>
                                    </span>
                                    <span
                                      class="el-upload-list__item-delete"
                                      @click="handleRemove(file)"
                                    >
                                      <i class="el-icon-delete"></i>
                                    </span>
                                  </span>
                                </div>
                              </el-upload> -->
                            </span>
                          </ul>
                        </div>
                        <div
                          v-loading="imgLoading"
                          v-if="fileListGifImgs.length > 0"
                        >
                          <div
                            class="gifTitle"
                            style="
                              border-bottom: 1px solid #ddd;
                              padding: 10px 0px;
                              font-size: 14px;
                            "
                          >
                            已上传 GIF 图片
                          </div>
                          <ul class="img-lists" style="margin-top: 10px">
                            <li
                              v-for="(item, index) in fileListGifImgs"
                              :key="index"
                            >
                              <div class="el-image-box">
                                <img :src="item.url" alt="" />
                                <div
                                  class="upload-remove"
                                  @click.stop="handleRemoveListGif(item, index)"
                                >
                                  <i class="el-icon-delete"></i>
                                </div>
                                <div
                                  class="upload-zoom-in"
                                  @click="handleZoom(item, index)"
                                >
                                  <i class="el-icon-zoom-in"></i>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

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
                            :data="uploadParams"
                            :action="uploadUrl"
                            accept="video/*"
                            :file-list="fileList"
                            list-type="picture-card"
                            :on-remove="handleRemove"
                            :on-success="successed"
                            :on-error="uploadFailed"
                            :on-exceed="exceedVideo"
                            :on-progress="uploadProgressVideo"
                            :before-upload="beforeVideoUpload"
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

                      <div v-show="showuploadVideo == 'video'">
                        <div
                          style="
                            height: 30px;
                            width: 100%;
                            border-bottom: 1px solid #ddd;
                            margin: 20px 0px;
                          "
                        >
                          <div style="float: left; font-size: 14px">
                            已上传视频
                          </div>
                          <div
                            class="el-icon-close"
                            style="float: right; color: red"
                            @click="videoClose('video')"
                          ></div>
                          <div class="clear"></div>
                        </div>

                        <div>
                          <div class="video-progress" v-if="progressBarShow">
                            <el-progress
                              :percentage="progressBarVideo"
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
                              :src="video.url"
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

                      <!-- 添加音频 -->
                      <el-col v-if="isOauthType_Podcast" class="audio-wrap">
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
                        <div v-show="showuploadAudio == 'audio'">
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
                              @click="videoClose('audio')"
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
                      </el-col>

                      <!-- 暂时取消
                    <div v-show="showupload == 'link' || containsWeibo" style="margin-top: 10px">
                      <el-input
                        v-model="pushObj.linkUrl"
                        clearable
                        placeholder="请输入链接"
                      />
                      <el-alert v-show="containsWeibo"
                        title="微博平台必须填写链接"
                        :closable=false
                        type="warning">
                      </el-alert>
                    </div> -->
                    </el-row>
                  </el-row>
                </div>
              </div>

              <!-- 定时 -->
              <fixed-time
                :pushObj="pushObj"
                :finalCheckedUsers="finalCheckedUsers"
                @getTimeZone="getTimeZone"
                @getPicker="getPicker"
              ></fixed-time>

            </el-card>
          </el-col>
        </el-row>


      </el-col>

      <el-col :span="12" class="right-container" 
       style="max-height:880px;"
      >
        <!-- 右边栏 -->
        <div :style="{height: GetWindowInfo.height}">
          <el-row :gutter="20">
            <el-col
              :span="24"
              v-if="finalCheckedUsers.length == 0"
              style="padding: 50px 15px"
            >
              <div class="post_preview_no_data_wrap">
                <div class="no_data_wrap">
                  <img
                    src="data:image/png;base64,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UmVhZHlxyWU8AAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBNzY0ODE3MjMzOTgxMUVCQjlEOUFEMjBEOTE5MzM3OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBNzY0ODE3MzMzOTgxMUVCQjlEOUFEMjBEOTE5MzM3OSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE3NjQ4MTcwMzM5ODExRUJCOUQ5QUQyMEQ5MTkzMzc5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE3NjQ4MTcxMzM5ODExRUJCOUQ5QUQyMEQ5MTkzMzc5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1oXjUAAAEh5JREFUeNpi/P//PwO1AAuMcfDoWRBFislLgDgWxrG3NkYYBjWIkQTDZID4KRBLwwSYKPDVEyCWQhZgYqAiGLyGseAQ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"
                    alt="nolist"
                  />
                  <span>贴文实时预览</span>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 内容区 -->
          <el-row
            v-for="(user, index) in finalCheckedUsers"
            :key="user.id"
            type="flex"
            justify="center"
            style="margin: 25px 0px"
          >
            <!-- pc -->
            <el-col
              :span="16"
              v-show="ispcTophone == 'isPC'"
              class="cards pc-wrap"
              style="margintop: 20px"
            >
              <preview-pc
                :pushObj="pushObj"
                :CfinalCheckedUsers="finalCheckedUsers"
                :editItem="editItem"
                :isEdit="isEdit"
                :video="video"
                :audio="audio"
                :index="index"
                :showupload="showupload"
                :user="user"
                :CfileListGifImgs="fileListGifImgs"
                :CfileListImgs="fileListImgs"
                :showuploadVideo="showuploadVideo"
                :videoResources="videoResources"
                :showuploadImg="showuploadImg"
                :pushActive="pushActive"
                :saveActive="saveActive"
                :cancelActive="cancelActive"
                :editActive="editActive"
                :active="active"
                :storageArr="storageArr"
                :publishing="publishing"
                @getEditingManuscripts="setEditingManuscripts"
                @getCancelListItem="setCancelListItem"
              >
              </preview-pc>
            </el-col>
            <!-- mobile -->
            <el-col :span="16" v-show="ispcTophone == 'isPhone'">
              <preview-mobile
                :pushObj="pushObj"
                :finalCheckedUsers="finalCheckedUsers"
                :editItem="editItem"
                :isEdit="isEdit"
                :video="video"
                :audio="audio"
                :index="index"
                :showupload="showupload"
                :user="user"
                :CfileListGifImgs="fileListGifImgs"
                :CfileListImgs="fileListImgs"
                :showuploadVideo="showuploadVideo"
                :showuploadImg="showuploadImg"
                :videoResources="videoResources"
              >
              </preview-mobile>
            </el-col>
          </el-row>
        </div>
      </el-col>



      <el-dialog top="8vh" :visible.sync="dialogVisible" class="imgPreview">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>

      <el-dialog
        title="添加要发送帖文的社交号"
        :visible.sync="selectUserDialogVisible"
        :beforeClose="closeSocialDialog"
      >
        <!-- 添加帐号 -->
        <template>
          <div style="text-align: right">
            <el-button
              v-if="activeName == 'personal'"
              icon="el-icon-plus"
              size="mini"
              style="margin-bottom: 10px"
              type="primary"
              @click="
                showDialog = true;
                pushObj.teamId = false;
              "
            >
              添加账号
            </el-button>
            <el-dialog
              title="添加帐号"
              :visible.sync="showDialog"
              append-to-body
            >
              <social-sign />
            </el-dialog>
          </div>
        </template>

        <template>
          <el-tabs v-model="activeName" @tab-click="accountHandleClick">
            <el-tab-pane label="个人账号" name="personal">
              <!-- <el-card> -->
              <el-checkbox
                v-model="checkAllAccount"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <el-checkbox-group
                v-model="checkedUsers"
                @change="handlecheckedUsersChange"
              >
                <el-row style="max-height: 500px; overflow-y: auto">
                  <el-col class="twitter-box" :span="24">
                    <div
                      v-for="user in filteredOauthUsers"
                      :key="user.id"
                      class="dialog-oauthType fl"
                    >
                      <el-checkbox
                        :key="user.id"
                        v-if="user.oauthType.toLowerCase() == 'twitter'"
                        :label="user.id"
                        style="margin: 10px 0"
                      >
                        <el-avatar :size="50" :src="user.avatar"> </el-avatar>
                        <svg-icon
                          :icon-class="user.oauthType.toLowerCase()"
                          :class="'badge ' + user.oauthType.toLowerCase()"
                        />
                        <el-badge type="info">
                          {{ user.nick }}
                        </el-badge>
                      </el-checkbox>
                    </div>
                    <div class="clear"></div>
                  </el-col>
                  <el-col class="facebook-box">
                    <div
                      v-for="user in filteredOauthUsers"
                      :key="user.id"
                      class="dialog-oauthType fl"
                    >
                      <el-checkbox
                        v-if="user.oauthType.toLowerCase() == 'facebook'"
                        :key="user.id"
                        :label="user.id"
                        style="margin: 10px 0"
                      >
                        <el-avatar :size="50" :src="user.avatar"> </el-avatar>
                        <svg-icon
                          :icon-class="user.oauthType.toLowerCase()"
                          :class="'badge ' + user.oauthType.toLowerCase()"
                        />
                        <el-badge type="info">
                          {{ user.nick }}
                        </el-badge>
                      </el-checkbox>
                    </div>
                    <div class="clear"></div>
                  </el-col>
                  <el-col class="youtube-box">
                    <div
                      v-for="user in filteredOauthUsers"
                      :key="user.id"
                      class="dialog-oauthType fl"
                    >
                      <el-checkbox
                        v-if="user.oauthType.toLowerCase() == 'google'"
                        :key="user.id"
                        :label="user.id"
                        style="margin: 10px 0"
                      >
                        <el-avatar :size="50" :src="user.avatar"></el-avatar>
                        <svg-icon
                          :icon-class="user.oauthType.toLowerCase()"
                          :class="'badge ' + user.oauthType.toLowerCase()"
                        />
                        <el-badge type="info">
                          {{ user.nick }}
                        </el-badge>
                      </el-checkbox>
                    </div>
                    <div class="clear"></div>
                  </el-col>
                  <el-col class="podcast-box">
                    <div
                      v-for="user in filteredOauthUsers"
                      :key="user.id"
                      class="dialog-oauthType fl"
                    >
                      <el-checkbox
                        v-if="user.oauthType.toLowerCase() == 'podcast'"
                        :key="user.id"
                        :label="user.id"
                        style="margin: 10px 0"
                      >
                        <el-avatar :size="50" :src="user.avatar"> </el-avatar>
                        <svg-icon
                          :icon-class="user.oauthType.toLowerCase()"
                          :class="'badge ' + user.oauthType.toLowerCase()"
                        />
                        <el-badge type="info">
                          {{ user.nick }}
                        </el-badge>
                      </el-checkbox>
                    </div>
                    <div class="clear"></div>
                  </el-col>
                </el-row>
              </el-checkbox-group>
              <!-- </el-card> -->
            </el-tab-pane>
            <el-tab-pane label="团队账号" name="team">
              <el-row>
                <el-col :span="12">
                  <div style="padding: 10px 0">请选择团队</div>
                  <template>
                    <el-radio-group v-model="teamRadio">
                      <el-radio
                        v-for="team in teamResult"
                        @change="teamRadioSelect"
                        :key="team.id"
                        :label="team.teamId"
                        style="margin-top: 20px; display: block"
                      >
                        <a
                          class="isEditName"
                          :title="team.teamName"
                          style="max-width: 180px"
                        >
                          {{ team.teamName }}
                        </a>
                      </el-radio>
                    </el-radio-group>
                  </template>
                </el-col>
                <el-col :span="12">
                  <div style="padding: 10px 0">请选择发布位置</div>
                  <template>
                    <div
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      style="height: 100px"
                      v-if="loading"
                    ></div>
                    <div
                      v-else
                      class="dialog-oauthType"
                      style="max-height: 500px; overflow-y: auto"
                    >
                      <el-checkbox
                        v-if="memberResult.length > 0"
                        v-model="checkAll"
                        @change="handleCheckAllMemberChange"
                        style="padding: 20px 0"
                      >
                        全选
                      </el-checkbox>

                      <el-checkbox-group
                        v-model="checkedUsers"
                        @change="handleCheckedMemberChange"
                      >
                        <el-checkbox
                          v-for="item in memberResult"
                          :label="item"
                          :key="item.id"
                          style="margin-top: 20px; display: block"
                        >
                          <el-avatar :size="50" :src="item.avatar"> </el-avatar>
                          <svg-icon
                            :icon-class="item.source.toLowerCase()"
                            :class="'badge ' + item.source.toLowerCase()"
                          />
                          <el-badge type="info">
                            <a
                              class="isEditName"
                              :title="item.teamName"
                              style="max-width: 180px"
                            >
                              {{ item.nickname }}
                            </a>
                          </el-badge>
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </template>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </template>

        <template>
          <div class="select-user-tips">
            <p>说明：</p>
            <p>
              1.
              个人账号可直接发帖，团队账号发帖需审核。所以不支持同时添加社交号！
            </p>
            <p>2. Facebook授权需要账号下拥有 "公共主页"</p>
            <p class="isYoutube-authorized">
              3. YouTube授权需要账号下拥有 "频道"
            </p>
          </div>
        </template>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button
            @click="
              selectUserDialogVisible = false;
            "
            >取 消</el-button
          > -->
          <el-button type="primary" @click="selectUser">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>

    <!-- 素材库 -->
    <img-lib
      ref="cDialog"
      :checkedUsers="finalCheckedUsers"
      :fileListGifImgs="fileListGifImgs"
      :fileListImgs="fileListImgs"
      @closeDialog="getImgLibCloseDialog"
      @showuploadImg="getShowuploadImg"
      @chFileListImgs="getFileListImgs"
      @chFileListGifImgs="getFileListGifImgs"
    ></img-lib>

    <audio-lib
      ref="cDialogAudio"
      :checkedUsers="finalCheckedUsers"
      :fileListAudio="fileListAudio"
      @closeDialog="getAudioLibCloseDialog"
      @showuploadAudio="getShowuploadAudio"
      @chFileListAudio="getFileListAudio"
    ></audio-lib>

    <!-- 裁剪 -->
    <img-cropper
      ref="cCropper"
      :cropperImgSrc="cropperImg"
      :imgName="imgFileName"
      @piccropper="handleScissor"
      @srcscissor="getPicSrc"
    >
    </img-cropper>
  </div>
</template>

<script src="./push.js">
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/ggjpc.css";
@import "./push.scss";
</style>

<style lang="scss">
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

.el-date-table td.next-month,
.el-date-table td.prev-month {
  color: #606266 !important;
}
</style>


