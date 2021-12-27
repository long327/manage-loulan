<template>
    <div class="phone-wrap" style="margin: 0 auto; margintop: 20px">
        <div class="phone-centent" v-if="c_finalCheckedUsers.length > 0">
          <div>
            <!-- 图标区 -->
            <i :class="'preview_' + user.oauthType"></i>
            <!-- 时间区 -->
            <el-row
                style="margin: 20px 10px"
                v-if="user.oauthType != 'PODCAST'"
            >
                <el-col :span="3">
                <el-badge class="content-oauthType" type="info">
                    <el-avatar :size="40" :src="user.avatar"> </el-avatar>
                    <!-- <svg-icon
                    :icon-class="user.oauthType.toLowerCase()"
                    :class="'badge ' + user.oauthType.toLowerCase()"
                    /> -->
                </el-badge>
                </el-col>
                <el-col
                  :span="15"
                  style="margin-top: 5px"
                  class="account-number"
                >
                <div class="homepage_info_wrap">
                    <span class="page_name" v-bind:class="user.oauthType">{{
                    user.nick || user.nickname
                    }}</span>
                    <div
                    class="post_date_wrap"
                    v-bind:class="user.oauthType + '-INLINE'"
                    >
                    <span
                        class="post_date"
                        v-if="user.oauthType == 'TWITTER'"
                        ><i>·</i> {{ formatDate("twitter") }}</span
                    >
                    <span
                        class="post_date"
                        v-else-if="user.oauthType == 'FACEBOOK'"
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
            <div
                class="content-wrap"
                v-bind:class="'content-' + user.oauthType"
            >
                <!-- youtube -->
                <div v-if="user.oauthType == 'GOOGLE'">
                <div v-if="showuploadVideo == 'video'">
                    <video
                        width="98%"
                        :src="video.url"
                        preload="auto"
                        controls
                    />
                </div>
                <p
                    style="white-space: pre-wrap; word-break: break-word"
                    class="text"
                    ref="message"
                    v-bind:class="{ isEdit: editItem[index] }"
                >
                    {{ user.child_content }}
                </p>
                </div>

                <!-- facebook/twitter -->
                <div style="padding: 0px">
                <div v-if="user.oauthType == 'TWITTER'">
                    <div>
                        <p
                          style="white-space: pre-wrap; word-break: break-word"
                          class="text"
                          ref="message"
                          v-bind:class="{ isEdit: editItem[index] }"
                        >
                          {{ user.child_content }}
                        </p>
                    </div>
                    <div
                      v-if="
                        user.mediaType == '1'
                      "
                      :class="'four_imgs_wrap' + Math.min(c_fileListImgs.length, 4)"
                    >

                    <!-- img-3 -->
                    <div
                      v-if="Math.min(c_fileListImgs.length, 4) == 3"
                      :class="'img-containter' + Math.min(c_fileListImgs.length, 4)"
                    >
                      <img
                        :src="c_fileListImgs[0].url"
                        :class="'imgs-' + Math.min(c_fileListImgs.length, 4)"
                        dataChild="child0"
                      />
                      <div class="right_img_wrap">
                        <img
                          :src="c_fileListImgs[1].url"
                          v-bind:class="'imgs-' + Math.min(c_fileListImgs.length, 4)"
                          dataChild="child1"
                        />
                        <img
                          :src="c_fileListImgs[2].url"
                          v-bind:class="'imgs-' + Math.min(c_fileListImgs.length, 4)"
                          dataChild="child2"
                        />
                      </div>
                    </div>
                    <!-- img-1/img-2/img-4 -->
                    <div
                      v-else
                      style="display: inline-block; overflow: hidden"
                      v-for="(item, idx) in c_fileListImgs"
                      :key="idx"
                    >
                      <div
                        :class="'img-containter' + Math.min(c_fileListImgs.length, 4)"
                        :dataImg="'containter' + idx"
                        v-if="idx <= 3"
                      >
                        <img
                          :src="item.url"
                          v-bind:class="'imgs-' + Math.min(c_fileListImgs.length, 4)"
                          v-bind:dataChild="'child' + idx"
                        />
                      </div>
                    </div>
                    </div>
                </div>
                <div v-if="user.oauthType == 'FACEBOOK'">
                    <div>
                        <p
                          style="white-space: pre-wrap; word-break: break-word"
                          class="text"
                          ref="message"
                          v-bind:class="{ isEdit: editItem[index] }"
                        >
                          {{ user.child_content }}
                        </p>
                    </div>

                    <!--  ||(c_fileListImgs.length > 0 && user.mediaType == '1') -->
                    <div
                      v-if="
                        (user.mediaType == '1') ||
                        (c_fileListImgs.length > 0 && user.mediaType == '1') ||
                        (c_fileListImgs.length > 0 &&
                          videoResources.length == 0 &&
                          user.mediaType != '2')
                      "
                      class="four_imgs_wrap"
                    >
                      <div
                        v-for="(item, idx) in c_fileListImgs"
                        :key="item.url"
                        style="display: inline-block"
                      >
                      <!-- imgs-1 -->
                        <div
                          v-if="c_fileListImgs.length == 1"
                          :class="'img-containter' + Math.min(c_fileListImgs.length, 6)"
                        >
                          <img
                            :src="item.url"
                            v-bind:class="'imgs-' + Math.min(c_fileListImgs.length, 6)"
                            v-bind:dataChild="'child' + idx"
                          />
                          <span
                            v-if="c_fileListImgs.length > 6 && idx == 5"
                            style="
                              position: absolute;
                              right: 13%;
                              z-index: 999;
                              bottom: 30px;
                              font-size: 50px;
                            "
                          >
                            <i class="el-icon-plus">{{
                              Math.min(c_fileListImgs.length, 8)
                            }}</i>
                          </span>
                        </div>
                      </div>
                      <!-- imgs-2 -->
                        <div
                          v-if="c_fileListImgs.length == 2"
                          :class="'img-containter' + Math.min(c_fileListImgs.length, 6)"
                        >
                          <!-- 方图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height < 1.333 && c_fileListImgs[0].width/c_fileListImgs[0].height > 0.75"
                            class="facebook_two_img_wrap facebook_equal_img_wrap"
                          >
                            <img
                              :src="c_fileListImgs[0].url"
                            />
                            <img
                              :src="c_fileListImgs[1].url"
                            />
                          </div>
                          <!-- 竖图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height <= 0.75"
                            class="facebook_two_img_wrap facebook_height_img_wrap"
                          >
                            <img
                              :src="c_fileListImgs[0].url"
                            />
                            <img
                              :src="c_fileListImgs[1].url"
                            />
                          </div>
                          <!-- 横图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height >= 1.333"
                            class="facebook_two_img_wrap facebook_width_img_wrap"
                          >
                            <img
                              :src="c_fileListImgs[0].url"
                            />
                            <img
                              :src="c_fileListImgs[1].url"
                            />
                          </div>
                        </div>
                      <!-- imgs-3 -->
                        <div
                          v-if="c_fileListImgs.length == 3"
                          class="facebook_three_img_wrap"
                        >
                          <!-- 方图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height < 1.333 && c_fileListImgs[0].width/c_fileListImgs[0].height > 0.75"
                            class="facebook_equal_img_wrap"
                          >
                            <img
                              :src="c_fileListImgs[0].url"
                            />
                            <img
                              :src="c_fileListImgs[1].url"
                            />
                            <img
                              :src="c_fileListImgs[2].url"
                            />
                          </div>
                          <!-- 竖图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height <= 0.75"
                            class="facebook_height_img_wrap"
                          >
                            <img
                              class="big_img"
                              :src="c_fileListImgs[0].url"
                            />
                            <div class="small_img_wrap">
                              <img
                                :src="c_fileListImgs[1].url"
                              />
                              <img
                                :src="c_fileListImgs[2].url"
                              />
                            </div>
                          </div>
                          <!-- 横图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height >= 1.333"
                            class="facebook_width_img_wrap"
                          >
                            <img
                              class="big_img"
                              :src="c_fileListImgs[0].url"
                            />
                            <div class="small_img_wrap">
                              <img
                                :src="c_fileListImgs[1].url"
                              />
                              <img
                                :src="c_fileListImgs[2].url"
                              />
                            </div>
                          </div>
                        </div>
                      <!-- imgs-4 or more -->
                        <div
                          v-if="c_fileListImgs.length >= 4"
                          class="facebook_four_imgs_wrap"
                        >
                          <!-- 方图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height < 1.333 && c_fileListImgs[0].width/c_fileListImgs[0].height > 0.75"
                            class="facebook_equal_img_wrap"
                          >
                            <div>
                              <img
                                :src="c_fileListImgs[0].url"
                              />
                            </div>
                            <div>
                              <img
                                :src="c_fileListImgs[1].url"
                              />
                            </div>
                            <div>
                              <img
                                :src="c_fileListImgs[2].url"
                              />
                            </div>
                            <div>
                              <img
                                :src="c_fileListImgs[3].url"
                              />
                              <span
                                v-if="c_fileListImgs.length > 4" 
                                class="img_mask"
                              >
                              +{{c_fileListImgs.length - 3}}
                              </span>
                            </div>
                          </div>
                          <!-- 竖图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height <= 0.75"
                            class="facebook_height_img_wrap"
                          >
                              <img
                                class="big_img"
                                :src="c_fileListImgs[0].url"
                              />
                              <div class="small_img_wrap">
                                <div>
                                  <img
                                    :src="c_fileListImgs[1].url"
                                  />
                                </div>
                                <div>
                                  <img
                                    :src="c_fileListImgs[2].url"
                                  />
                                </div>
                              <div>
                                <img
                                  :src="c_fileListImgs[3].url"
                                />
                                <span
                                  v-if="c_fileListImgs.length > 4" 
                                  class="img_mask"
                                >
                                +{{c_fileListImgs.length - 3}}
                                </span>
                              </div>
                            </div>
                          </div>
                          <!-- 横图 -->
                          <div
                            v-if="c_fileListImgs[0].width/c_fileListImgs[0].height >= 1.333"
                            class="facebook_width_img_wrap"
                          >
                            <img
                              class="big_img"
                              :src="c_fileListImgs[0].url"
                            />
                              <div class="small_img_wrap">
                                <div>
                                  <img
                                    :src="c_fileListImgs[1].url"
                                  />
                                </div>
                                <div>
                                  <img
                                    :src="c_fileListImgs[2].url"
                                  />
                                </div>
                              <div>
                                <img
                                  :src="c_fileListImgs[3].url"
                                />
                                <span
                                  v-if="c_fileListImgs.length > 4" 
                                  class="img_mask"
                                >
                                +{{c_fileListImgs.length - 3}}
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
                    c_fileListGifImgs.length > 0 &&
                    user.oauthType != 'PODCAST'
                    "
                    class="four_imgs_wrap"
                >
                    <div>
                    <el-image
                        :src="c_fileListGifImgs[0].url"
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
                    <video
                        width="98%"
                        :src="video.url"
                        preload="auto"
                        controls
                    />
                </div>
                <!-- <div v-else-if="showuploadVideo == 'video' && c_fileListImgs.length < 1">
                    <video
                    width="100%"
                    :src="videoResources[0]"
                    preload="auto"
                    controls
                    />
                </div> -->
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

                    <h2>{{ user.child_topicTitle }}</h2>
                    <p>
                    <span class="column">{{ user.nick || user.nickname }}</span>
                    <span class="interest">+ 关注</span>
                    </p>
                    <audio
                    style="width: 273px"
                    :src="audio.url"
                    preload="auto"
                    controls
                    ></audio>
                </div>
                <div v-else>
                    <video
                        width="100%"
                        :src="video.url"
                        preload="auto"
                        controls
                    />
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
                <div
                style="height: 1px; background-color: #cdcfd2; margin: 20px"
                ></div>
            </el-row>
            <div v-if="!isPreviews">
              <el-row
                  v-if="
                  user.oauthType != 'GOOGLE' && user.oauthType != 'PODCAST'"
              >
                  <!-- 非动图/动图/视频 -->
                  <div
                  class="radio"
                  style="margin: 0px 20px 15px; float: left"
                  v-if="
                      showuploadVideo == 'video' &&
                      c_fileListGifImgs.length > 0 &&
                      c_fileListImgs.length > 0
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
                      c_fileListGifImgs.length > 0 &&
                      c_fileListImgs.length > 0
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
                      c_fileListImgs.length > 0
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
                      c_fileListGifImgs.length > 0
                  "
                  >
                  <el-radio-group v-model="user.mediaType">
                      <el-radio label="2" value="2"> GIF图片 </el-radio>
                      <el-radio label="3" value="3"> 视频 </el-radio>
                  </el-radio-group>
                  </div>
                  <div class="btns" style="margin: 0px 20px 15px; float: right">
                  <!-- <el-button
                      v-bind:class="{ editActive: editActive[index] }"
                      class="edit"
                      size="mini"
                      @click="editingManuscripts(index)"
                      round
                      >编辑</el-button
                  >
                  <el-button
                      v-bind:class="{ cancelActive: cancelActive[index] }"
                      class="cancel"
                      size="mini"
                      @click="cancelListItem(index)"
                      round
                      >取消</el-button
                  >
                  <el-button
                      v-bind:class="{ saveActive: saveActive[index] }"
                      class="save"
                      size="mini"
                      @click="saveListItem(user, index)"
                      round
                      >保存</el-button
                  > -->
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
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "previewMobile",
    props: {
        isPreviews: true,
        finalCheckedUsers: {
          type: Array,
          default: function() {
            return Array
          }
        },
        user: {
          type: Object
        },
        pushObj: {
          type: Object
        },
        showuploadVideo: {
            type: String,
            default: ""
        },
        showuploadImg: {
            type: String,
            default: ""
        },
        CfileListGifImgs: {
          type: Array,
          default: function() {
            return Array
          }
        },
        CfileListImgs: {
          type: Array,
          default: function() {
            return Array
          }
        },
        videoResources: {
          type: Array,
          default: function() {
            return Array
          }
        },
        editItem: {
          type: Array,
          default: function() {
            return Array
          }
        },
        isEdit: {
            type: Boolean
        },
        index: {
            type: Number
        },
        showupload: {
            type: String
        },
        video: {
          type: Object
        },
        audio: {
          type: Object
        }
    },
    data() {
        return {
            c_finalCheckedUsers: this.finalCheckedUsers,
            c_fileListGifImgs: this.CfileListGifImgs,
            c_fileListImgs: this.CfileListImgs
        }
    },
    watch: {
      CfileListImgs: function(nVal, oVal) {
        this.c_fileListImgs = nVal;
      },
      CfileListGifImgs: function(nVal, oVal) {
        this.c_fileListGifImgs = nVal;
      }
    },
    methods: {
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
    }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";
@import "../../../styles/ggjpc.css";

.push-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
  }
  .component-item {
    min-height: 100px;
  }
  .weibo-bottom {
    border-left-width: 1px;
    border-left-style: solid;
  }
  .preview-bottom {
    margin: 16px 0;
    text-align: center;
    font-size: 12px;
  }
  .pan-thumb {
    margin-left: 20px;
    padding-left: 30px;
  }
  .pan-thumb {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    transform-origin: 0;
    transition: all 0.3s ease-in-out;
  }
  .pan-info .el-button--medium.is-circle {
    position: relative;
    z-index: 1;
    padding: 0px;
    cursor: pointer;
  }
  .pan-info {
    display: none;
  }
  .push-container ::v-deep .pan-info {
    line-height: 35px;
  }
  .pan-item:hover .pan-info {
    display: inline-block;
  }
  .push-container ::v-deep .img-user {
    button {
        opacity: 0;
    }
  }
  .push-container ::v-deep .img-user:hover button {
    -webkit-transform: scale(2);
    -ms-transform: scale(2);
    transform: scale(2);
    -webkit-transition: opacity 1.2s ease-out, transform 0.6s ease-out;
    transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
    transition: opacity 1.2s ease-out, transform 0.6s ease-out;
    transition: opacity 1.2s ease-out, transform 0.6s ease-out, -webkit-transform 0.6s ease-out;
    -moz-transition: opacity 1.2s ease-out, transform 0.6s ease-out;
    -ms-transition: opacity 1.2s ease-out, transform 0.6s ease-out;
    -o-transition: opacity 1.2s ease-out, transform 0.6s ease-out;
}
  
  .right-container {
    min-height: 600px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    max-height: 900px;
    overflow-x: hidden;
    overflow-y: overlay;
  }
  .right-container .title,
  .pc,
  .mobile {
    display: inline-block;
    font-weight: 400;
    padding: 5px;
    cursor: pointer;
    font-size: 20px;
  }
  
  .push-container ::v-deep {
    .pc{font-size: 22px;}  
    .child-textarea .el-textarea__inner{
      background-color:unset!important;
      border-color: unset!important;
      color: unset!important;
      border:none!important;
    }
    .el-dialog .el-dialog__header {
      border-radius: 8px 8px 0 0;
      background-color: #7E7EF4;
      padding: 20px;
    }
  }
  .push-container ::v-deep .content-left-wrap {
    margin-top: 20px;
    padding: 0px 10px 20px;
    border: 1px solid #7e7ef4;
    border-radius: 5px;
  }
  .left-container .title {
    padding-bottom: 20px;
  }
  .no_data_wrap {
    -moz-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    display: -ms-flexbox;
    display: flex;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -moz-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -moz-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  
  .no_data_wrap img {
    width: 88px;
    margin-bottom: 17px;
  }
  
  .no_data_wrap span {
    font-size: 14px;
    color: #666;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    margin-top: 7px;
  }
  .post_preview_no_data_wrap {
    margin-top: 16px;
    -moz-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    display: -ms-flexbox;
    display: flex;
    // border: 1px dashed #aaa;
    border-radius: 4px;
    margin: 0px 20px;
    height: 300px;
  }
  .preview_tip {
    margin-top: 18px;
    text-align: right;
    font-size: 12px;
    color: #ccc;
  }
  .post_preview_no_data_wrap img {
    border: 0;
    vertical-align: middle;
  }
  .font-style {
    font-size: 14px;
    line-height: 0.5rem;
  }
  .push-container ::v-deep .textarea-content .el-textarea__inner {
    outline: none;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #dddddd;
  }
  
  .content-wrap {
    margin-top: 16px;
    -moz-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    /* padding: 10px 10px; */
    border-radius: 4px;
    /* background-color: #f6f7fb; */
  }
  .pc{
    .content-FACEBOOK,
    .content-TWITTER{
      overflow-y: auto;
      max-height: 300px;
    }
  }

  .share-icon {
    font-size: 10px;
    height: 12px;
    line-height: 13px;
    color: #616770;
  }
  
  .share-icon svg,
  .share-icon i {
    margin-right: 6px;
    font-size: 14px;
  }
  .right-container .text {
    padding: 0 10px;
  }
  .svg-icon {
    width: 0.8rem;
    // height: 0.8rem;
  }
  .el-upload__tip {
    color: #b4b6b8;
  }
  .el-avatar img {
    width: 100%;
  }
  .iconfont.icontw {
    color: #4fa0ec;
  }
  
  .iconfont.iconlink1 {
    color: #0b66c1;
  }
  .iconfont.iconyoutube {
    color: #e83324;
  }
  .word-limit {
    margin-top: 10px;
    font-size: 12px;
    text-align: right;
  }
  .text {
    // background-color: #f6f7fb;
    line-height: 25px;
    min-height: 50px;
    border-radius: 10px;
    padding: 10px 30px;
    font-size: 12px;
    padding: 0 10px;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    color: #1e2229;
    line-height: 20px;
    outline: 0;
    word-wrap: break-word;
    height: auto;
    border-radius: 4px;
    text-align: left;
    position: relative;
  }
  .isEdit {
    -webkit-user-modify: read-write-plaintext-only;
  }
  .right-container .phone-wrap .content-wrap {
    margin: 0 17px;
    position: relative;
  }
  
  .el-button--mini.is-circle {
    padding: 3px;
    position: absolute;
    right: 5px;
    top: 5px;
    margin-bottom: 20px;
    z-index: 9999;
  }
  
  .el-button--mini,
  .el-button--mini.is-round {
    /* position: relative; */
    /* top: 7px; */
    /* right: 0px; */
    padding: 4px 10px;
    display: inline-block;
  }
  
  .account-number {
    font-size: 14px;
    height: 14px;
    line-height: 14px;
  }
  .post_date_wrap {
    margin-top: 5px;
    display: -ms-flexbox;
    display: flex;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    color: #616770;
  }
  .FACEBOOK {
    color: #365899;
  }
  .TWITTER-INLINE {
    display: inline;
    margin-left: 10px;
  }
  .right-container .success,
  .right-container .edit,
  .right-container .save,
  .right-container .cancel,
  .right-container .release {
    display: none;
  }
  .right-container .success.active,
  .right-container .editActive,
  .right-container .cancelActive,
  .right-container .saveActive,
  .right-container .pushActive {
    display: inline-block;
  }
  .right-container .wb-title,
  .right-container .WEIBO {
    margin-left: 10px;
  }
  .four_imgs_wrap {
    text-align: center;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .right-container .el-avatar--square {
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
    font-size: 14px;
    z-index: 9999;
   }

  .right-container .cards {
    width: 460px;
  }
  .right-container ::v-deep .cards .el-avatar > img,
  .right-container ::v-deep .phone-centent .el-avatar > img {
    display: inline-block;
  }

  //图片排列
  body .right-container ::v-deep {
    .img-containter1{
      width: 300px;
      height: 300px;
      display: inline-block;
      img{
        max-width: 300px;
        max-height: 300px;
      }
    }

    .img-containter2,
    .img-containter4{
      width: 190px;
      height: 190px;
      display: inline-block;
      img{
        max-width: 190px;
        max-height: 190px;
      }
    }
    .img-containter3,
    .img-containter5,
    .img-containter6,
    .img-containter7,
    .img-containter8{
      width: 120px;
      height: 120px;
      display: inline-block;
      padding:5px;
      img{
        max-width: 110px;
        max-height: 110px;
      }
    }
    .img-containter7:nth-child(n + 7),
    .img-containter8:nth-child(n + 7),
    .imgs-7:nth-child(n + 7),
    .imgs-8:nth-child(n + 7) {
      display: none;
    }
  }

  .right-container .btns {
    width: 120px;
    float: right;
  }
  .right-container .btns button {
    float: right;
  }
  .clear {
    float: bold;
  }
  .isEmpty {
    background-color: #409eff;
    border-color: #409eff;
  }
  .pushAllLen {
    background-color: #909399;
    border-color: #909399;
  }
  $wxBg: #24da70;
  $wbBg: orangered;
  $fbBg: #0e71e8;
  $ttBg: #6ba2d6;
  $qqBg: #6ba2d6;
  .wx-svg-container {
    background-color: $wxBg;
  }
  .wb-svg-container {
    background-color: $wbBg;
  }
  .push-container ::v-deep .content-left-wrap .fb-svg-container {
    background-color: $fbBg;
    font-size: 16px;
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 100%;
    text-align: center;
  }
  .tt-svg-container {
    background-color: $ttBg;
  }
  .qq-svg-container {
    background-color: $qqBg;
    margin-left: 50px;
  }
  
  .push-container {
    .tips-upload {
      display: inline-block;
      color: #928d8d;
      font-size: 12px;
    }
    .social-number{
      color: #7E7EF4;
      font-size:14px;
      margin-left:10px;
    }
    .character_count{
      margin-right: 5px;
    }
  }
  
  .btn-delete {
    display: none;
  }
  .el-badge:hover .btn-delete {
    display: block;
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
  .currentPicType {
    color: #7e7ef4;
  }
  .content-left-wrap.fbMaxLen,
  .content-left-wrap.twMaxLen {
    border: 1px solid red;
  }
  
 

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

  //图片上传
  .left-container ::v-deep .content-wrap{
    .img-lists{
      &{
        list-style: none;
        padding: 0;
        margin: 0;
        display: inline-block;
      }
      li{
        width:136px;
        height: 136px;
        border:1px solid #ddd;
        display: inline-block;
        margin:0px 10px 10px 0;
        position: relative;
        overflow: hidden;
        text-align: center;
        border-radius:5px;
      }
      li:hover .upload-remove,
      li:hover .upload-scissor,
      li:hover .upload-zoom-in{
        display:block;
      }
      img{
        display: inline-block;
        max-width: 134px;
        max-height: 136px;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
      }
      .upload-remove{
        display: none;
        position: absolute;
        width:20px;
        height: 20px;
        right: 0;
        top: 0;
        background-color: #433a27;
        cursor: pointer;
      }
      .el-icon-delete{
        color:#fff;
        font-size:14px;
      }
      .upload-scissor{
        color: #fff;
        font-size: 14px;
        display: none;
        position: absolute;
        width:20px;
        height: 20px;
        bottom:0;
        background-color: #433a27;
        cursor: pointer;
      }
      .upload-zoom-in{
        color: #fff;
        font-size: 14px;
        display: none;
        position: absolute;
        width:20px;
        height: 20px;
        bottom:0;
        right: 0;
        background-color: #433a27;
        cursor: pointer;
      }
      .upload-zoom-in i,
      .upload-remove i,
      .upload-scissor i{
        vertical-align: middle;
      }
    }
    .cardUpload-wrap123{
       &{
         display: inline;
       }
       li{
         display: none;
       }
    }
  }

  .content-wrap ::v-deep {
    video{
      max-width: 100%;
      max-height: 300px;
      object-fit: cover;
    }

    .el-icon-picture{
      &::before{
        content: "\e79f";
        font-size: 1.5em;
      }
      &{
        color: #7E7EF4;
        vertical-align: middle;
      }
    }
    .el-icon-video-camera{
      &::before {
        content: "\e772";
        font-size: 1.5em;
      }
      &{
        color: #7E7EF4;
        vertical-align: middle;
      }
    }
    .el-icon-microphone{
      &::before {
        font-size: 1.5em;
      }
      &{
        color: #7E7EF4;
        vertical-align: middle;
      }
    }
    .title-picture{
      color: #7E7EF4;
      font-size: 14px;
    }
    .tips-pic,
    .tips-video{
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
    .tips-video p{
      padding: 0px 10px;
    }
    .tips-pic :first-child,
    .tips-video :first-child{
      margin-bottom: 10px;
    }
    .bottom {
      clear: both;
      text-align: center;
    }
    .el-icon-info{
      color: #dcd92b;
      margin-right: 3px;
    }
    .el-upload--picture-card{
      width: 136px;
    }
    .upload-box-card{
      border:none;
      background-color: unset;
    }
  
  }

  .right-container ::v-deep .radio{
    span{
      font-size: 12px;
    }
    .el-radio{
      margin-right: 10px;
    }
    .el-radio__label{
      padding-left: 3px;
    }
  }

  @media screen and (max-width: 968px) {
    .content-wrap .tips-pic{
        display: block;
    }
  }

  .isEditName{
      margin-left: 10px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      max-width: 120px;
  }
  .video-button-wrap{
    & {
      vertical-align: bottom;
      margin-left: 10px;
      display: inline-block;
    }
    .inputVideoName {
      max-width: 120px;
    }
    .buttonVideo{
      margin:0;
      padding: 4px 3px;
    }
  }
  .el-icon-edit{
    cursor: pointer;
    font-size: 13px;
    color: #7e7ef4;
  }
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

  .pc-wrap ::v-deep .podcast-wrap{
    &{
      padding-top: 20px;
      max-width: 315px;
      margin: 0 auto;
    }
    .column{
      color: #999999;
      font-size: 16px;
      display: inline-block;
    }
    .podcast-icon{
      position: absolute;
      height: 2.5em;
      width: 2.5em;
      z-index: 99;
      left: -15px;
      top: 5px;
    }
    .podcast-img-wrap{
      width: 326px;
      overflow: hidden;
    }
    .interest{
      &{
        margin-left:10px;
        padding: 6px 12px;
        display: inline-block;
        background-color: #7E7EF4;
        color: #ffffff;
        border-radius: 5px;
        font-size: 14px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
      }
    }
    img,
    video{
      max-width: 326px;
      display: block;
      margin: 0 auto;
    }
    .child-text{
        &{
          font-size:25px;
          font-weight: bold;
          height: 40px;
        }
        .el-textarea__inner{
          margin-top: 10px;
          border: none;
          padding: 0;
          color: #000;
          background-color: unset;
        }
    }
  }

  .phone-wrap .podcast-wrap{
    &{
      padding-top: 20px;
      max-width: 290px;
      margin: 0 auto;
    }
    .column{
      color: #999999;
      font-size: 14px;
      display: inline-block;
    }
    .podcast-icon{
      width:2em;
      height: 2em;
      z-index: 99;
      left: -15px;
      top: 5px;
    }
    .podcast-img-wrap{
      width: 279px;
      overflow: hidden;
    }
    .interest{
      &{
        margin-left:8px;
        padding: 4px 8px;
        display: inline-block;
        background-color: #7E7EF4;
        color: #ffffff;
        border-radius: 5px;
        font-size: 14px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
      }
    }
    img,
    video{
      max-width: 279px;
      max-height: 270px;
      display: block;
      margin: 0 auto;
    }
  }


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

 //phone
  .phone-wrap {
    width: 350px;
    height: 650px;
    background-image: url("../../../assets/images/phone.png");
    background-position: center 0px;
    background-repeat: no-repeat;
    background-color: transparent;
    background-size: 100%;
  }
  .phone-wrap {
    .phone-centent {
      position: absolute;
      // top: 30px;
      // padding: 0 22px;
      // // overflow-y: auto;
      // height: 540px;
      // width: 350px;
      // margin-top: 40px;
      & > div{
        top: 30px;
        padding: 0 22px;
        overflow-y: auto;
        height: 540px;
        width: 350px;
        margin-top: 40px;
      }
    }
    .homepage_info_wrap {
      padding-left: 10px;
      text-align: left;
    }
    // .content-wrap {
    //   margin: 0 0 0 10px;
    // }
  }
  
  //pic list of twitter
  body .right-container .phone-wrap ::v-deep {
    .content-TWITTER {
      .four_imgs_wrap4{
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
          width: 128px;
          height: 116px;
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
      .img-containter1 {
        & {
          display: inline-block;
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .imgs-1 {
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
          width: 130px;
          height: 130px;
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
          width: 100px;
        }
        img[datachild=child0]{
          width: 178px;
          height: 160px;
          margin-right: 2px;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        img[datachild=child1]{
          width: 100px;
          height: 79px;
          border-top-right-radius: 12px;
          margin-bottom: 2px;
        }
        img[datachild=child2]{
          width: 100px;
          height: 79px;
          border-bottom-right-radius: 12px;
        }
      }
    }
  }
  //pic list of facebook
  body .right-container .phone-wrap ::v-deep {
    .content-FACEBOOK {
      .imgs-1 {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .four_imgs_wrap {
        text-align: unset;
      }
      div .img_mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.6);
        font-size: 18px;
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
        width: 132px;
        height: 132px;
      }
      .facebook_two_img_wrap.facebook_height_img_wrap img {
        width: 132px;
        height: 230px;
      }
      .facebook_two_img_wrap.facebook_width_img_wrap img {
        width: 100%;
        height: 126px;
      }
      .facebook_two_img_wrap.facebook_width_img_wrap {
        -moz-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        -moz-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
      }
      .facebook_two_img_wrap.facebook_width_img_wrap img:first-child {
        margin-bottom: 2px;
      }

      .facebook_three_img_wrap {
        & {
          width: 100%;
          display: -ms-flexbox;
          display: flex;
          -moz-justify-content: space-between;
          -ms-flex-pack: justify;
          justify-content: space-between;
        }
        .facebook_height_img_wrap {
          & {
            display: -ms-flexbox;
            display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          .big_img {
            width: 180px;
            height: 284px;
          }
          .small_img_wrap {
            & {
              width: 100%;
              margin-left: 1px;
            }
            img {
              width: 88px;
              height: 141px;
              object-fit: cover;
              border: 0;
              vertical-align: middle;
            }
            img:first-child{
              margin-bottom: 1px;
            }
          }
        }

        .facebook_width_img_wrap {
          & {
            width: 100%;
            // display: -ms-flexbox;
            // display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          .big_img{
            width: 100%;
            // height: 130px;
          }
          .small_img_wrap {
            & {
              width: 100%;
              display: flex;
            }
            img {
              width: 132px;
              height: 132px;
              object-fit: cover;
              border: 0;
              vertical-align: middle;
            }
            & > div{
              display: inline-block;
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
            width: 88px;
            height: 88px;
          }
          img:nth-child(2) {
            margin: 0 2px;
          }
        }
      }

      .facebook_four_imgs_wrap {
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
            margin-bottom: 1px;
          }
          div {
            display: inline-block;
            position: relative;
            width: 135px;
            height: 124px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          div:last-child {
            position: relative;
          }
          div .img_mask {
            line-height: 124px;
          }
        }
        .facebook_height_img_wrap {
          & {
            width: 100%;
            height: 276px;
            display: -ms-flexbox;
            display: flex;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          .big_img {
            width: 260px;
            height: 276px;
          }
          .small_img_wrap{
            width: 150px;
            height: 276px;
            margin-left: 1px;
            img {
              width: 100%;
              height: 91px;
            }
            div:nth-child(2) {
              margin: 1px 0;
            }
            div:last-child{
              position: relative;
            }
            div .img_mask {
              line-height: 92px;
            }

          }

        }
        .facebook_width_img_wrap {
          & {
            width: 100%;
            -moz-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
          .big_img {
            width: 100%;
            height: 120px;
          }
          .small_img_wrap {
            width: 100%;
            height: 87px;
            margin-top: 2px;
            div {
              display: inline-block;
              width: 89px;
              height: 87px;
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
              line-height: 87px;
            }
          }
        }
      }
    }
  }




  body .right-container .phone-wrap ::v-deep {
    .preview_FACEBOOK {
      background: url('../../../assets/images/facebook_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      background-size: 60px;
      position: absolute;
      left: -60px;
      top: 48px;
      display: inline-block;
    }
    .preview_TWITTER {
      background: url('../../../assets/images/twitter_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      background-size: 60px;
      position: absolute;
      left: -60px;
      top: 48px;
      display: inline-block;
    }
    .preview_GOOGLE {
      background: url('../../../assets/images/youtube_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      background-size: 60px;
      position: absolute;
      left: -60px;
      top: 48px;
      display: inline-block;
    }
    .preview_PODCAST {
      background: url('../../../assets/images/padcast_preview.png') no-repeat;
      width: 78px;
      height: 86px;
      background-size: 60px;
      position: absolute;
      left: -60px;
      top: 48px;
      display: inline-block;
    }
  }

</style>