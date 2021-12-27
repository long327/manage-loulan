<template>
  <div class="pc-wrap">
    <el-card
      :body-style="{ padding: '0px' }"
      v-if="finalCheckedUsers.length > 0"
    >
      <!-- 图标区 -->
      <i :class="'preview_' + user.oauthType"></i>
      <!-- 时间区 -->
      <el-row style="margin: 20px" v-if="user.oauthType != 'PODCAST'">
        <el-col :span="3">
          <el-badge class="content-oauthType" type="info">
            <el-avatar :size="40" :src="user.avatar"> </el-avatar>
            <!-- <svg-icon
              :icon-class="user.oauthType.toLowerCase()"
              :class="'badge ' + user.oauthType.toLowerCase()"
            /> -->
          </el-badge>
        </el-col>
        <el-col :span="15" style="margin-top: 5px" class="account-number">
          <div class="homepage_info_wrap">
            <span class="page_name" v-bind:class="user.oauthType">{{
              user.nick || user.nickname
            }}</span>
            <div
              class="post_date_wrap"
              v-bind:class="user.oauthType + '-INLINE'"
            >
              <span class="post_date" v-if="user.oauthType == 'TWITTER'"
                ><i>·</i> {{ formatDate("twitter") }}</span
              >
              <span class="post_date" v-else-if="user.oauthType == 'FACEBOOK'"
                >{{ formatDate("facebook") }} <i>·</i>
              </span>
              <span
                class="post_date wb-title"
                v-else-if="user.oauthType == 'WEIBO'"
                >{{ formatDate("weibo") }}</span
              >
              <span class="post_date" v-else></span>
              <span v-if="user.oauthType === 'FACEBOOK'">
                <span class="global iconfont icondiqiu1"></span>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 内容展示区 -->
      <div class="content-wrap" v-bind:class="'content-' + user.oauthType">
        <!-- youtube -->
        <div v-if="user.oauthType == 'GOOGLE'">
          <div v-if="showuploadVideo == 'video'">
            <video width="100%" :src="video.url" preload="auto" controls />
          </div>
          <el-input
            v-model="user.child_content"
            :disabled="!editItem[index]"
            :autosize="{ maxRows: 6 }"
            type="textarea"
            class="child-textarea"
            placeholder=""
            v-if="!isPreviews"
          >
          </el-input>
          <p v-else>
            {{user.child_content}}
          </p>
        </div>
        <!-- facebook/twitter -->
        <div style="padding: 0px">
          <div v-if="user.oauthType == 'TWITTER'">
            <el-input
              v-model="user.child_content"
              :disabled="!editItem[index]"
              :autosize="{ maxRows: 6 }"
              type="textarea"
              class="child-textarea"
              placeholder=""
              v-if="!isPreviews"
            >
            </el-input>
            <p v-else>
              {{user.child_content}}
            </p>
            <!-- (fileListImgs.length > 0 && user.mediaType == '1') -->
            <div
              v-if="
                (user.mediaType == '1') ||
                (fileListImgs.length > 0 && user.mediaType == '1') ||
                (fileListImgs.length > 0 &&
                  videoResources.length == 0 &&
                  user.mediaType != '2')
              "
              :class="'four_imgs_wrap ' + 'imgs-divide' + Math.min(fileListImgs.length, 4)"
            >
              <!-- img-3 -->
              <div
                v-if="Math.min(fileListImgs.length, 4) == 3"
                :class="'img-containter' + Math.min(fileListImgs.length, 4)"
              >
                <img
                  :src="fileListImgs[0].url"
                  :class="'imgs-' + Math.min(fileListImgs.length, 4)"
                  dataChild="child0"
                />
                <div class="right_img_wrap">
                  <img
                    :src="fileListImgs[1].url"
                    v-bind:class="'imgs-' + Math.min(fileListImgs.length, 4)"
                    dataChild="child1"
                  />
                  <img
                    :src="fileListImgs[2].url"
                    v-bind:class="'imgs-' + Math.min(fileListImgs.length, 4)"
                    dataChild="child2"
                  />
                </div>
              </div>
              <!-- img-1/img-2/img-4 -->
              <div
                v-else
                style="display: inline-block; overflow: hidden"
                v-for="(item, idx) in fileListImgs"
                :key="idx"
                :class="'img-wrap' + Math.min(fileListImgs.length, 4)"
              >
                <div
                  :class="'img-containter' + Math.min(fileListImgs.length, 4)"
                  :dataImg="'containter' + idx"
                  v-if="idx <= 3"
                >
                  <img
                    :src="item.url"
                    v-bind:class="'imgs-' + Math.min(fileListImgs.length, 4)"
                    v-bind:dataChild="'child' + idx"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-if="user.oauthType == 'FACEBOOK'">
            <el-input
              v-model="user.child_content"
              :disabled="!editItem[index]"
              :autosize="{ maxRows: 6 }"
              type="textarea"
              class="child-textarea"
              placeholder=""
              v-if="!isPreviews"
            >
            </el-input>
            <p v-else>
              {{user.child_content}}
            </p>
            <div
              v-if="
                (user.mediaType == '1') ||
                (fileListImgs.length > 0 && user.mediaType == '1') ||
                (fileListImgs.length > 0 &&
                  videoResources.length == 0 &&
                  user.mediaType != '2')
              "
              class="four_imgs_wrap"
            >
              <div
                v-for="(item, idx) in fileListImgs"
                :key="item.url"
                style="display: inline-block"
              >
              <!-- imgs-1 -->
                <div
                  v-if="fileListImgs.length == 1"
                  :class="'img-containter' + Math.min(fileListImgs.length, 6)"
                >
                  <img
                    :src="item.url"
                    v-bind:class="'imgs-' + Math.min(fileListImgs.length, 6)"
                    v-bind:dataChild="'child' + idx"
                  />
                  <span
                    v-if="fileListImgs.length > 6 && idx == 5"
                    style="
                      position: absolute;
                      right: 13%;
                      z-index: 999;
                      bottom: 30px;
                      font-size: 50px;
                    "
                  >
                    <i class="el-icon-plus">{{
                      Math.min(fileListImgs.length, 8)
                    }}</i>
                  </span>
                </div>
              </div>
              <!-- imgs-2 -->
                <div
                  v-if="fileListImgs.length == 2"
                  :class="'img-containter' + Math.min(fileListImgs.length, 6)"
                >
                  <!-- 方图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height < 1.333 && fileListImgs[0].width/fileListImgs[0].height > 0.75"
                    class="facebook_two_img_wrap facebook_equal_img_wrap"
                  >
                    <img
                      :src="fileListImgs[0].url"
                    />
                    <img
                      :src="fileListImgs[1].url"
                    />
                  </div>
                  <!-- 竖图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height <= 0.75"
                    class="facebook_two_img_wrap facebook_height_img_wrap"
                  >
                    <img
                      :src="fileListImgs[0].url"
                    />
                    <img
                      :src="fileListImgs[1].url"
                    />
                  </div>
                  <!-- 横图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height >= 1.333"
                    class="facebook_two_img_wrap facebook_width_img_wrap"
                  >
                    <img
                      :src="fileListImgs[0].url"
                    />
                    <img
                      :src="fileListImgs[1].url"
                    />
                  </div>
                </div>
              <!-- imgs-3 -->
                <div
                  v-if="fileListImgs.length == 3"
                  class="facebook_three_img_wrap"
                >
                  <!-- 方图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height < 1.333 && fileListImgs[0].width/fileListImgs[0].height > 0.75"
                    class="facebook_equal_img_wrap"
                  >
                    <img
                      :src="fileListImgs[0].url"
                    />
                    <img
                      :src="fileListImgs[1].url"
                    />
                    <img
                      :src="fileListImgs[2].url"
                    />
                  </div>
                  <!-- 竖图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height <= 0.75"
                    class="facebook_height_img_wrap"
                  >
                    <img
                      class="big_img"
                      :src="fileListImgs[0].url"
                    />
                    <div class="small_img_wrap">
                      <img
                        :src="fileListImgs[1].url"
                      />
                      <img
                        :src="fileListImgs[2].url"
                      />
                    </div>
                  </div>
                  <!-- 横图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height >= 1.333"
                    class="facebook_width_img_wrap"
                  >
                    <img
                      class="big_img"
                      :src="fileListImgs[0].url"
                    />
                    <div class="small_img_wrap">
                      <img
                        :src="fileListImgs[1].url"
                      />
                      <img
                        :src="fileListImgs[2].url"
                      />
                    </div>
                  </div>
                </div>
              <!-- imgs-4 or more -->
                <div
                  v-if="fileListImgs.length >= 4"
                  class="facebook_four_imgs_wrap"
                >
                  <!-- 方图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height < 1.333 && fileListImgs[0].width/fileListImgs[0].height > 0.75"
                    class="facebook_equal_img_wrap"
                  >
                    <div>
                      <img
                        :src="fileListImgs[0].url"
                      />
                    </div>
                    <div>
                      <img
                        :src="fileListImgs[1].url"
                      />
                    </div>
                    <div>
                      <img
                        :src="fileListImgs[2].url"
                      />
                    </div>
                    <div>
                      <img
                        :src="fileListImgs[3].url"
                      />
                      <span
                        v-if="fileListImgs.length > 4" 
                        class="img_mask"
                      >
                       +{{fileListImgs.length - 3}}
                      </span>
                    </div>
                  </div>
                  <!-- 竖图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height <= 0.75"
                    class="facebook_height_img_wrap"
                  >
                      <img
                        class="big_img"
                        :src="fileListImgs[0].url"
                      />
                      <div class="small_img_wrap">
                        <div>
                          <img
                            :src="fileListImgs[1].url"
                          />
                        </div>
                        <div>
                          <img
                            :src="fileListImgs[2].url"
                          />
                        </div>
                      <div>
                        <img
                          :src="fileListImgs[3].url"
                        />
                        <span
                          v-if="fileListImgs.length > 4" 
                          class="img_mask"
                        >
                        +{{fileListImgs.length - 3}}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 横图 -->
                  <div
                    v-if="fileListImgs[0].width/fileListImgs[0].height >= 1.333"
                    class="facebook_width_img_wrap"
                  >
                    <img
                      class="big_img"
                      :src="fileListImgs[0].url"
                    />
                      <div class="small_img_wrap">
                        <div>
                          <img
                            :src="fileListImgs[1].url"
                          />
                        </div>
                        <div>
                          <img
                            :src="fileListImgs[2].url"
                          />
                        </div>
                      <div>
                        <img
                          :src="fileListImgs[3].url"
                        />
                        <span
                          v-if="fileListImgs.length > 4" 
                          class="img_mask"
                        >
                        +{{fileListImgs.length - 3}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div
            v-if="
              user.mediaType == '2' &&
              fileListGifImgs.length > 0 &&
              user.oauthType != 'PODCAST'
            "
            class="four_imgs_wrap"
          >
            <div>
              <el-image
                :src="fileListGifImgs[0].url"
                v-bind:class="'imgs-1'"
                v-bind:dataChild="'child1'"
              >
              </el-image>
            </div>
          </div>

          <div
            v-if="
              showuploadVideo == 'video' &&
              user.mediaType == '3' &&
              user.oauthType != 'PODCAST' &&
              user.oauthType != 'GOOGLE'
            "
          >
            <video width="100%" :src="video.url" preload="auto" controls />
          </div>

          <div v-else-if="showupload === 'link'">
            <span style="color: #455a96">{{ pushObj.linkUrl }}</span>
          </div>
        </div>
        <!-- podcast -->
        <div class="podcast-wrap" v-if="user.oauthType == 'PODCAST'">

          <div v-if="user.podcastInfo.type == '0'">
            <div class="podcast-img-wrap">
              <img :src="user.avatar" alt="" />
            </div>

            <!-- <el-input
                      v-model="user.child_topicTitle"
                      :disabled="!editItem[index]"
                      :autosize="{ maxRows: 6 }"
                      type="textarea"
                      class="child-text"
                      placeholder=""
                    >
                    </el-input> -->

            <h3>{{ user.child_topicTitle }}</h3>
            <p>
              <span class="column">{{ user.nick || user.nickname }}</span>
              <span class="interest">+ 关注</span>
            </p>
            <audio
              width="278px"
              :src="audio.url"
              preload="auto"
              controls
            ></audio>
          </div>
          <div v-else>
            <video width="100%" :src="video.url" preload="auto" controls />
            <h2>{{ user.child_topicTitle }}</h2>
            <p>
              <span class="column">{{ user.nick || user.nickname }}</span>
              <span class="interest">+关注</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 模拟功能区 -->
      <el-row
        v-if="user.oauthType === 'WEIBO'"
        type="flex"
        justify="space-around"
        class="preview-bottom"
      >
        <el-col :span="6" class="share-icon">
          <svg-icon icon-class="star" class="icon" />收藏
        </el-col>
        <el-col :span="6" class="weibo-bottom share-icon">
          <svg-icon icon-class="share" class="icon" />分享
        </el-col>
        <el-col :span="6" class="weibo-bottom share-icon">
          <span><i class="el-icon-s-comment" />评论</span>
        </el-col>
        <el-col :span="6" class="weibo-bottom share-icon">
          <svg-icon icon-class="thumbup-line" class="icon" />赞
        </el-col>
      </el-row>
      <el-row
        v-if="user.oauthType === 'FACEBOOK'"
        type="flex"
        justify="space-around"
        class="preview-bottom"
      >
        <!-- <el-col :span="3" class="share-icon">
                  <svg-icon icon-class="thumbup-line" class="icon" /> 赞
                  </el-col>
                  <el-col :span="6" class="share-icon">
                    <span><i class="el-icon-s-comment" />评论</span>
                  </el-col>
                  <el-col :span="3" class="share-icon">
                    <svg-icon icon-class="share-line" class="icon" />分享
                  </el-col> -->
        <el-col :span="6" class="like_wrap">
          <i class="iconfont iconengagement"></i>
          <span class="like">Like</span>
        </el-col>
        <el-col :span="6" class="comment_wrap">
          <i class="iconfont iconcomment1"></i>
          <span class="comment">Comment</span>
        </el-col>
        <el-col :span="6" class="share_wrap">
          <i class="iconfont iconshare1"></i>
          <span class="share">Share</span>
        </el-col>
      </el-row>
      <el-row
        v-if="user.oauthType === 'TWITTER'"
        type="flex"
        justify="space-around"
        class="preview-bottom"
      >
        <el-col :span="1" class="reply_wrap">
          <i class="iconfont iconcomment"></i>
        </el-col>
        <el-col :span="1" class="retweet_wrap">
          <i class="iconfont iconshare"></i>
        </el-col>
        <el-col :span="1" class="like_wrap">
          <i class="iconfont iconxihuan1"></i>
        </el-col>
        <el-col :span="1" class="direct_message_wrap">
          <i class="iconfont iconyouxiang"></i>
        </el-col>
        <el-col :span="10"></el-col>

        <!-- <el-col :span="6">
                    <span><svg-icon icon-class="comment" class="icon" /></span>
                  </el-col>
                  <el-col :span="6">
                    <span><svg-icon icon-class="cycle" class="icon" /></span>
                  </el-col>
                  <el-col :span="6" class="share-icon">
                    <svg-icon icon-class="like" class="icon" />
                  </el-col>
                  <el-col :span="6">
                    <svg-icon icon-class="upload" class="icon" />
                  </el-col> -->
      </el-row>
      <el-row
        v-if="user.oauthType == 'GOOGLE'"
        type="flex"
        justify="space-around"
        class="preview-bottom"
      >
        <el-col :span="18"></el-col>
        <el-col :span="2">
          <i class="iconfont icon-thumbs-up"></i>
        </el-col>
        <el-col :span="2">
          <i class="iconfont icon-thumbs-down"></i>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
      <el-row
        v-if="user.oauthType === 'PODCAST'"
        type="flex"
        justify="space-around"
        class="preview-bottom"
      >
        <el-col :span="5" class="speed_wrap">
          <i class="iconfont iconspeed1x"></i>
        </el-col>
        <el-col :span="4" class="podcast_wrap">
          <i class="iconfont iconpodcast"></i>
        </el-col>
        <el-col :span="5" class="time_wrap">
          <i class="iconfont iconpodcasttime"></i>
        </el-col>
        <el-col :span="4" class="heart_wrap">
          <i class="iconfont iconheart"></i>
        </el-col>
        <el-col :span="5" class="downLoad_wrap">
          <i class="iconfont icondownLoad"></i>
        </el-col>
      </el-row>
      <el-row v-if="!isPreviews">
        <div style="height: 1px; background-color: #cdcfd2; margin: 20px"></div>
      </el-row>
      <el-row v-if="!isPreviews">

        <div v-if="user.oauthType != 'GOOGLE' && user.oauthType != 'PODCAST'">
          <!-- 非动图/动图/视频 -->
          <div
            class="radio"
            style="margin: 0px 20px 15px; float: left"
            v-if="
              showuploadVideo == 'video' &&
              fileListGifImgs.length > 0 &&
              fileListImgs.length > 0
            "
          >
            <el-radio-group v-model="user.mediaType">
              <el-radio label="1" value="1"> JPG/PNG图片 </el-radio>
              <el-radio label="2" value="2"> GIF图片 </el-radio>
              <el-radio label="3" value="3"> 视频 </el-radio>
            </el-radio-group>
          </div>
          <!-- 非动图/动图 -->
          <div
            class="radio"
            style="margin: 0px 20px 15px; float: left"
            v-else-if="
              fileListGifImgs.length > 0 &&
              fileListImgs.length > 0
            "
          >
            <el-radio-group v-model="user.mediaType">
              <el-radio label="1" value="1"> JPG/PNG图片 </el-radio>
              <el-radio label="2" value="2"> GIF图片 </el-radio>
            </el-radio-group>
          </div>
          <!-- 非动图/视频 -->
          <div
            class="radio"
            style="margin: 0px 20px 15px; float: left"
            v-else-if="
              showuploadVideo == 'video' &&
              fileListImgs.length > 0
            "
          >
            <el-radio-group v-model="user.mediaType">
              <el-radio label="1" value="1"> JPG/PNG图片 </el-radio>
              <el-radio label="3" value="3"> 视频 </el-radio>
            </el-radio-group>
          </div>
          <!-- 动图/视频 -->
          <div
            class="radio"
            style="margin: 0px 20px 15px; float: left"
            v-else-if="
              showuploadVideo == 'video' &&
              fileListGifImgs.length > 0
            "
          >
            <el-radio-group v-model="user.mediaType">
              <el-radio label="2" value="2"> GIF图片 </el-radio>
              <el-radio label="3" value="3"> 视频 </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div
          class="btns"
          style="margin: 0px 20px 15px; float: right"
          v-if="user.oauthType != 'PODCAST'"
        >
          <el-button
            v-bind:class="{ editActive: editActive[index] }"
            class="edit"
            size="mini"
            @click="editingManuscripts(index)"
            round
            >编辑</el-button
          >
          <el-button
            v-bind:class="{ saveActive: saveActive[index] }"
            class="save"
            size="mini"
            type="primary"
            @click="saveListItem(user, index)"
            round
            >保存</el-button
          >
          <el-button
            v-bind:class="{ cancelActive: cancelActive[index] }"
            class="cancel"
            size="mini"
            @click="cancelListItem(index)"
            round
            >取消</el-button
          >

          <!-- <el-button
                      v-bind:class="{ pushActive: pushActive[index] }"
                      class="release"
                      size="mini"
                      @click="pushListItem(index, user)"
                      round
                      >发布</el-button
                    > -->
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </el-row>

      <div></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "previewPc",
  props: {
    isPreviews: true,
    CfinalCheckedUsers: {
      type: Array,
      default: function () {
        return Array;
      },
    },
    user: {
      type: Object,
    },
    pushObj: {
      type: Object,
    },
    showuploadVideo: {
      type: String,
      default: "",
    },
    showuploadImg: {
      type: String,
      default: "",
    },
    CfileListGifImgs: {
      type: Array,
      default: function () {
        return Array;
      },
    },
    CfileListImgs: {
      type: Array,
      default: function () {
        return Array;
      },
    },
    videoResources: {
      type: Array,
      default: function () {
        return Array;
      },
    },
    editItem: {
      type: Array,
      default: function () {
        return Array;
      },
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
    },
    showupload: {
      type: String,
      default: ''
    },
    video: {
      type: Object
    },
    audio: {
      type: Object
    },
    editActive: {
        type: Array,
        default: function () {
            return Array;
        },
    },
    pushActive: {
        type: Array,
        default: function () {
            return Array;
        },
    },
    saveActive: {
        type: Array,
        default: function () {
            return Array;
        },
    },
    active: {
        type: Array,
        default: function () {
            return Array;
        },
    },
    cancelActive: {
        type: Array,
        default: function () {
            return Array;
        },
    },
    storageArr: {
        type: Array,
        default: function () {
            return Array;
        },
    },
    publishing: {
        type: Boolean
    }
  },
  data() {
    return {
        finalCheckedUsers: this.CfinalCheckedUsers,
        fileListGifImgs: this.CfileListGifImgs,
        fileListImgs: this.CfileListImgs,
    };
  },
  watch: {
    CfinalCheckedUsers: function(nVal, oVal) {
      this.finalCheckedUsers = nVal;
    },
    CfileListImgs: function(nVal, oVal) {
      this.fileListImgs = nVal;
    },
    CfileListGifImgs: function(nVal, oVal) {
      this.fileListGifImgs = nVal;
    }
  },
  methods: {
    //单取消
    cancelListItem(index) {
      let contents = this.storageArr[index].content;
      let obj = this.finalCheckedUsers[index];
      let { content } = this.pushObj;

      if (contents != "") {
        // this.$set(this.finalCheckedUsers[index], "child_content", contents);
         this.$emit('getCancelListItem', index, contents)
      } else {
        // this.$set(this.finalCheckedUsers[index], "child_content", content);
         this.$emit('getCancelListItem', index, content)
      }
     

      this.$forceUpdate();
      this.editItem[index] = false;
      this.cancelActive[index] = false;
      this.editActive[index] = true;
      this.pushActive[index] = false;
      this.saveActive[index] = false;
      this.$set(this.cancelActive, index, false);
    },
    //单编辑
    editingManuscripts(index) {
      this.formatDate();
      this.editItem[index] = true;
      this.editActive[index] = false;
      this.cancelActive[index] = true;
      this.saveActive[index] = true;
      this.$set(this.editItem, index, true);
    },
    //单保存
    saveListItem(user, idx) {
      this.editItem[idx] = false;
      this.saveActive[idx] = false;
      let userObj = this.finalCheckedUsers[idx];
      let { child_content } = userObj;

      this.$emit('getEditingManuscripts', idx, child_content)

      if (this.publishing) {
        this.editActive[idx] = false;
        this.$set(this.cancelActive, idx, true);
        this.$set(this.pushActive, idx, true);
      } else {
        this.$set(this.cancelActive, idx, false);
        this.$set(this.editActive, idx, true);
      }
      this.$set(this.editActive, idx, true);
      this.$set(this.cancelActive, idx, false);
    },
    //单贴文发送
    pushListItem(idx, oauthKey) {
      let text = document.querySelectorAll(".ispc-text")[idx];
      // let osfipin = text.replace(/(^\s*)|(\s*$)/g, "")

      /** 以下是单发贴文 **/
      var pushObj = {
        checkedUsers: [],
        resourcesUrl: [],
        content: "",
        linkUrl: "",
        contentType: "",
        pushType: "now",
        scheduleTime: "",
        topicId: this.topicId,
      };
      pushObj.checkedUsers.push(oauthKey);
      pushObj.pushType = this.pushObj.pushType;
      pushObj.contentType = this.showupload;
      pushObj.scheduleTime = this.pushObj.scheduleTime;
      pushObj.resourcesUrl = this.pushObj.resourcesUrl;
      pushObj.content = text.innerText;
      this.validateTextLength(text.innerText);

      if (!pushObj.content) {
        this.$notify({
          title: "注意",
          message: "请输入要上传的数据！",
          type: "error",
          duration: 2000,
        });
        this.changePublishBtnStatus();
        return;
      }

      if (!this.checkPushContent()) {
        this.changePublishBtnStatus();
        return;
      }
      if (this.finalCheckedUsers.length == 0) {
        this.$notify({
          title: "注意",
          message: "请选择社交号！",
          type: "error",
          duration: 2000,
        });
        this.changePublishBtnStatus();
        return;
      }

      if (!this.topicTitle) {
        this.$notify({
          title: "注意",
          message: "请输入贴文主题！",
          type: "error",
          duration: 2000,
        });
        this.changePublishBtnStatus();
        return;
      }

      pushTopic({
        title: this.topicTitle,
      })
        .then((r) => {
          if (r.code === 200) {
            this.topicId = r.data.id;
            pushContent(pushObj).then((response) => {
              if (response.data[0].code === 200) {
                this.$notify({
                  title: "消息",
                  message: "推送成功！",
                  type: "success",
                  duration: 1000,
                });
                this.cancelActive[idx] = false;
                this.pushActive[idx] = false;
                this.active[idx] = true;
                this.$set(this.active, idx, true);
                this.flag++;
                if (this.flag == this.finalCheckedUsers.length) {
                  this.pushAllLen = true;
                  this.publishing = true;
                }
              } else {
                response.data.forEach((d) => {
                  this.$notify({
                    title: "推送失败",
                    message:
                      d.socialAccount +
                      "[" +
                      d.socialPlatform +
                      "]-" +
                      d.exceptionMsg,
                    type: "error",
                    duration: 1000,
                  });
                });
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //暂时取消
      //       var pushObj = {
      //         checkedUsers: [],
      //         resourcesUrl: [],
      //         content: "",
      //         linkUrl: "",
      //         contentType: "",
      //         pushType: "now",
      //         scheduleTime: ""
      //       }
      // console.log(this.pushObj);
      //       this.aloneArr.forEach((val, index) => {
      //         if (val.socialAccountId == oauthKey.id) {
      //           pushObj.checkedUsers.push({id: val.socialAccountId})
      //           pushObj.content = text.innerHTML;
      //           pushObj.resourcesUrl = val.resourcesUrl
      //           pushObj.linkUrl = val.linkUrl;
      //           pushObj.contentType = val.contentType
      //           pushObj.scheduleTime = val.scheduleTime
      //         }
      //       })

      //       pushObj.topicId = this.topicId;

      // 暂时取消
      // pushContent(pushObj).then((response) => {

      //   if (response.data[0].code === 200) {
      //       this.$notify({
      //         title: "消息",
      //         message: "推送成功！",
      //         type: "success",
      //         duration: 1000,
      //       });
      //       this.cancelActive[idx] = false;
      //       this.pushActive[idx] = false;
      //       this.active[idx] = true;
      //       this.$set(this.active, idx, true);
      //       // this.pushObj.resourcesUrl = [];
      //       // this.pushObj.content = "";
      //       // this.pushObj.linkUrl = "";
      //       // this.pushObj.contentType = "";
      //       // this.fileList = [];
      //   }
      //   else{
      //     response.data.forEach(d=>{
      //         this.$notify({
      //           title: "推送失败",
      //           message: d.socialAccount+"["+d.socialPlatform+"]-"+d.exceptionMsg,
      //           type: "error",
      //           duration: 1000,
      //         });
      //     });
      //   }
      // });
    },
    formatDate(oauthType) {
      var dt = new Date();
      var m = new Array(
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      );
      var w = new Array(
        "Monday",
        "Tuseday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      );
      var d = new Array("st", "nd", "rd", "th");
      var myho = dt.getHours();
      var mymi = dt.getMinutes();
      var myse = dt.getSeconds();
      let apn = "AM";
      if (myho > 10) {
        myho = myho - 12;
        apn = "PM";
      }
      let week =
        "星期" + ["日", "一", "二", "三", "四", "五", "六"][dt.getDay()];
      var mn = dt.getMonth();
      var wn = dt.getDay();
      var dn = dt.getDate();
      var dns;
      if (dn % 10 < 1 || dn % 10 > 3) {
        dns = d[3];
      } else {
        dns = d[(dn % 10) - 1];
        if (dn == 11 || dn == 12) {
          dns = d[3];
        }
      }

      function num(val) {
        if (val < 10) return "0" + val;
        else return "" + val;
      }
      if (oauthType == "facebook") {
        return `${m[mn]} ${dn} ${num(myho)}:${num(mymi)} ${apn} `;
      } else if (oauthType == "twitter") {
        return `${m[mn]} ${dn} ${dt.getFullYear()} `;
      } else if (oauthType == "weibo") {
        return `${num(mn)}-${num(dn)} ${num(myho)}:${num(mymi)} `;
      }
    },
    arrSlice(val, index) {
      if (val) {
        return val.slice(0, index).concat(val.slice(index + 1, val.length));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";
@import "../../../styles/ggjpc.css";
@import "../push.scss";


  .icon-thumbs-up{
    background: url('../../../assets/images/thumbs-up.png') no-repeat;
    width: 16px;
    height: 16px;
    display: inline-block;
  }
  .icon-thumbs-down{
    background: url('../../../assets/images/thumbs-down.png') no-repeat;
    width: 16px;
    height: 16px;
    display: inline-block;
  }

  .iconspeed1x{
    background: url('../../../assets/images/podcast-1x.png') no-repeat;
    width: 16px;
    height: 16px;
    background-size: 16px;
    display: inline-block;
  }
  .iconpodcast{
    background: url('../../../assets/images/podcast-icon.png') no-repeat;
    width: 16px;
    height: 16px;
    background-size: 16px;
    display: inline-block;
  }
  .iconpodcasttime{
    background: url('../../../assets/images/podcast-time.png') no-repeat;
    width: 16px;
    height: 16px;
    background-size: 16px;
    display: inline-block;
  }
  .iconheart{
    background: url('../../../assets/images/podcast-heart.png') no-repeat;
    width: 16px;
    height: 16px;
    background-size: 16px;
    display: inline-block;
  }
  .icondownLoad{
    background: url('../../../assets/images/podcast-downing.png') no-repeat;
    width: 16px;
    height: 16px;
    background-size: 16px;
    display: inline-block;
  }

  //pic list of twitter
  body .right-container .pc-wrap ::v-deep {
    .content-TWITTER {
      .img-containter1 {
        & {
          display: inline-block; 
          position: relative; 
          width: 100%; 
          overflow: hidden;
        }
        .imgs-1{
          width: 100%;
          height: 100%;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
          object-fit: cover;
        }
      }
      .img-containter2{
        & {
          display: flex;
        }
        img{
          width: 206px;
          height: 206px;
          object-fit: cover;
          vertical-align: middle;
        }
        img[datachild=child0]{
          margin-right: 2px;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        img[datachild=child1]{
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
      }
      .img-containter3{
        & {
          width: 100%;
          display: flex;
          -moz-justify-content: space-between;
          -ms-flex-pack: justify;
          justify-content: space-between;
        }
        img{
          object-fit: cover;
          vertical-align: middle;
        }
        .right_img_wrap{
          width: 138px;
        }
        img[datachild=child0]{
          width: 280px;
          height: 262px;
          margin-right: 2px;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        img[datachild=child1]{
          width: 132px;
          height: 130px;
          border-top-right-radius: 12px;
          margin-bottom: 4px;
        }
        img[datachild=child2]{
          width: 132px;
          height: 130px;
          border-bottom-right-radius: 12px;
        }
      }
      .imgs-divide4{
        &{
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: wrap;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
        }
        img{
          object-fit: cover;
          width: 100%;
          height: 100%;
          border: 0;
          vertical-align: middle;
        }
        .img-containter4{
          display: inline-block;
          width: 208px;
          height: 164px;
          position: relative;
        }
        img[datachild=child0] {
          border-top-left-radius: 12px;
        }
        img[datachild=child1] {
          border-top-right-radius: 12px;
        }
        img[datachild=child2] {
          border-bottom-left-radius: 12px;
        }
        img[datachild=child3] {
          border-bottom-right-radius: 12px;
        }
        div[dataimg=containter0]{
          margin: 0 2px 2px 0;
        }
        div[dataimg=containter3]{
          margin: 0 0 0 2px;
        }
      }
    }
  }
  //pic list of facebook
  body .right-container .pc-wrap ::v-deep {
    .content-FACEBOOK {
      .imgs-1 {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      div .img_mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.6);
        font-size: 36px;
        color: #fff;
        text-align: center;
      }
      .facebook_two_img_wrap {
          & {
            width: 100%;
            display: -ms-flexbox;
            display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          img {
            object-fit: cover;
            border: 0;
            vertical-align: middle;
          }
      }
      .facebook_equal_img_wrap img {
        width: 208px;
        height: 208px;
      }
      .facebook_two_img_wrap.facebook_height_img_wrap img {
        width: 208px;
        height: 348px;
      }
      .facebook_two_img_wrap.facebook_width_img_wrap img {
        width: 100%;
        height: 176px;
      }
      .facebook_two_img_wrap.facebook_width_img_wrap {
        height: 348px;
        -moz-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        -moz-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
      }
      .facebook_two_img_wrap.facebook_width_img_wrap img:first-child{
        margin-bottom: 2px;
      }

      .facebook_three_img_wrap {
        & {
          width: 100%;
          margin-top: 7px;
          display: -ms-flexbox;
          display: flex;
          -moz-justify-content: space-between;
          -ms-flex-pack: justify;
          justify-content: space-between;
        }
        .facebook_height_img_wrap {
          & {
            width: 209px;
            display: -ms-flexbox;
            display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          .big_img{
            width: 209px;
            height: 384px;
          }
          .small_img_wrap {
            & {
              width: 100%;
              height: 384px;
              margin-left: 2px;
            }
            img {
              width: 208px;
              height: 191px;
              object-fit: cover;
              border: 0;
              vertical-align: middle;
            }
            img:first-child{
              margin-bottom: 2px;
            }
          }
        }

        .facebook_width_img_wrap {
          & {
            width: 100%;
            display: -ms-flexbox;
            // display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          img {
            object-fit: cover;
            border: 0;
            vertical-align: middle;
          }
          .big_img{
            width: 100%;
            height: 176px;
          }
          .small_img_wrap {
            & {
              width: 100%;
              height: 173px;
              margin-top: 2px;
            }
            img {
              width: 208px;
              height: 176px;
            }
            img:first-child{
              margin-right: 2px;
            }
          }
        }
        .facebook_equal_img_wrap {
          & {
            width: 100%;
            display: -ms-flexbox;
            display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          img {
            width: 138px;
            height: 138px;
          }
          img:nth-child(2) {
            margin: 0 2px;
          }
        }
      }

      .facebook_four_imgs_wrap {
        margin-top: 7px;
        // display: -ms-flexbox;
        // display: flex;
        -moz-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;

        img{
          object-fit: cover;
          border: 0;
          vertical-align: middle;
        }
        .facebook_equal_img_wrap {
          width: 100%;
          display: -ms-flexbox;
          display: flex;
          -moz-justify-content: space-between;
          -ms-flex-pack: justify;
          justify-content: space-between;
          -webkit-box-pack: wrap;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          div:first-child,
          div:nth-child(2){
            margin-bottom:2px;
          }
          div {
            display: inline-block;
            position: relative;
            width: 208px;
            height: 208px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          div:last-child {
            position: relative;
          }
          div .img_mask {
            line-height: 208px;
          }
        }
        .facebook_height_img_wrap {
          & {
            width: 100%;
            height: 368px;
            display: -ms-flexbox;
            display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          .big_img {
            width: 366px;
            height: 368px;
          }
          .small_img_wrap{
            width: 150px;
            height: 368px;
            margin-left: 2px;
            img {
              width: 100%;
              height: 123px;
            }
            div:nth-child(2) {
              margin: 2px 0;
            }
            div:last-child{
              position: relative;
            }
            div .img_mask {
              line-height: 123px;
            }

          }

        }
        .facebook_width_img_wrap {
          & {
            width: 100%;
            height: 368px;
            // display: -ms-flexbox;
            // display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          .big_img {
            width: 100%;
            height: 170px;
          }
          .small_img_wrap {
            width: 100%;
            height: 368px;
            margin-top: 2px;
            div {
              display: inline-block;
              width: 138px;
              height: 138px;
              position: relative;
            }
            img {
              width: 100%;
              height: 100%;
            }
            div:nth-child(2) {
              margin: 0 2px;
            }
            div .img_mask {
              line-height: 138px;
            }
          }
        }
      }
    }
  }

  body .right-container .pc-wrap ::v-deep {
    &{
      position: relative;
    }
    .preview_FACEBOOK {
      background: url('../../../assets/images/facebook_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      position: absolute;
      left: -76px;
      top: 5px;
      display: inline-block;
    }
    .preview_TWITTER {
      background: url('../../../assets/images/twitter_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      position: absolute;
      left: -76px;
      top: 5px;
      display: inline-block;
    }
    .preview_GOOGLE {
      background: url('../../../assets/images/youtube_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      position: absolute;
      left: -76px;
      top: 5px;
      display: inline-block;
    }
    .preview_PODCAST {
      background: url('../../../assets/images/padcast_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      position: absolute;
      left: -76px;
      top: 5px;
      display: inline-block;
    }
  }

</style>
