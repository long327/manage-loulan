import {
  pushContent,
  pushContentSubmit,
  pushTopic,
  uploadPush,
  getByUrl,
  getTeamUser,
  getMemberUser
} from "@/api/pusher";
import {
  postActivity
} from "@/api/oauthUser";
import {
  getList,
  putPic,
  deletePics
} from '@/api/resource'
import {
  mapGetters
} from "vuex";
import PanThumb from "@/components/PanThumb";
import ImgLib from "./components/imgLib";
import AudioLib from "./components/audioLib";
import fixedTime from "./components/fixedTime";
import previewPc from "./components/previewPc";
import previewMobile from "./components/previewMobile";
import SocialSign from "../my-accounts/components/SocialSignin";
import {
  handleAuthResult
} from "@/utils/auth";
import {
  setBase64
} from "@/utils/setBase64";

import moment from "moment";
import ImgCropper from './components/imgCropper.vue';
import timeFrame from '@/utils/timeFrame.js';
import local from '@/utils/local';
import UrlSearch from '@/utils/urlSearch';


import axios from 'axios'
import {
  TimeSelect
} from "element-ui";

var checkedArr = [];
export default {
  components: {
    PanThumb,
    SocialSign,
    handleAuthResult,
    ImgLib,
    AudioLib,
    ImgCropper,
    fixedTime,
    previewMobile,
    previewPc
  },
  filters: {
    oauthTypeFilter(otype) {
      switch (otype.toUpperCase()) {
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
        case "GOOGLE":
          return "youtube";
          break;
        case "PODCAST":
          return "podcast";
        default:
          break;
      }
      return statusMap[status];
    },
  },
  computed: {
    ...mapGetters(["oauthUsers"]),
    filteredOauthUsers() {
      if (this.listQuery.type) {
        return this.oauthUsers.filter(
          (u) =>
          !u.unAuthorized && u.admin && u.oauthType === this.listQuery.type.toUpperCase()
        );
      } else {
        return this.oauthUsers.filter((u) => !u.unAuthorized && u.admin);
      }
    },
    containsWeibo() {
      return this.userTypes & this.userType.WEIBO;
    },
    containsTwitter() {
      return this.userTypes & this.userType.TWITTER;
    },
    containsFacebook() {
      return this.userTypes & this.userType.FACEBOOK;
    },
    weiboUserSelectedVideo() {
      return this.containsWeibo && this.showupload === "video";
    },

  },
  data() {
    return {
      loading: false,
      showDialog: false,
      cropper: "", //裁剪对象
      cropperImg: "", //裁剪图片
      width: 0, //裁剪
      height: 0, //裁剪
      dialogVisibleCrop: false,
      fileListImgs: [],
      fileListGifImgs: [],
      fileListAudio: [],
      fileList: [],
      fileTypeMap: {
        IMAGE: "图片",
        VIDEO: "视频",
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      checked: -1,
      currentPicType: true,
      isEdit: -1,
      layout: true,
      isDelete: false,
      current: false,
      listQuery: {
        type: "",
      },
      userTypes: 0,
      userType: {
        WEIBO: 2,
        FACEBOOK: 4,
        TWITTER: 8,
        WECHAT_OPEN: 16,
        YOUTUBE: 32,
        PODCAST: 64
      },
      currentLength: 0,
      maxlength: 1000,
      uploadUrl: `${process.env.VUE_APP_BASE_API}/resource/upload`,
      dialogImageUrl: "",
      dialogVisible: false,
      selectUserDialogVisible: false,
      showupload: "",
      showuploadVideo: "",
      showuploadImg: "",
      showuploadAudio: "",
      topicTitle: "",
      editContents: [],
      pushObj: {
        checkedUsers: [],
        resourcesUrl: [],
        resourceInfos: [],
        content: "",
        linkUrl: "",
        contentType: "",
        pushType: "now",
        scheduleTime: "",
        videoTitle: false,
        teamId: false
      },
      checkedUsers: [],
      finalCheckedUsers: [],
      publishing: true,
      pushStatus: false,
      isEdit: false,
      isOauthType_tw: false,
      isOauthType_fa: false,
      isOauthType_Podcast: false,
      topicId: "",
      active: [],
      editItem: [],
      editActive: [],
      cancelActive: [],
      saveActive: [],
      pushActive: [],
      aloneArr: [],
      isEmpty: false,
      _isEmpay: false,
      allPush: false,
      flag: 0,
      pushAllLen: false,
      imageResources: [],
      videoResources: [],
      audioResources: [],
      dialogPicsVisible: false,
      dialogAudioVisible: false,
      twTextMaxLen: 280,
      fbTextMaxLen: 63206,
      ytbTextMaxLen: 5000,
      radio: "imageType",
      ispcTophone: "isPC",
      video: {
        url: "",
        name: ""
      },
      audio: {
        url: "",
        name: ""
      },
      imgLoading: false,
      videoLoading: false,
      checkTextFlag: true,
      fbFlag: false,
      twFlag: false,
      ytbFlag: false,
      fileListTwitterImgs: [],
      uploadImgCount: 0,
      uploadImgArr: [],
      sendLoading: false,
      storageArr: [],
      imgFileName: "",
      progressBarVideo: 0,
      progressBarAudio: 0,
      progressState: '#67c23a',
      progressBarShow: false,
      progressBarShowAudio: false,
      isEditName: true,
      editVideoName: '',
      editAudioName: '',
      isTopicTitleEmpty: true,
      uploadParams: {
        duration: 0,
        width: 0,
        height: 0,
        size: 0
      },

      auditTopic: false, //主题是否审核
      isHide: false, //发布列表是否隐藏
      auditContent: false, //贴文是否审核
      activeName: 'personal',
      checkAllAccount: false,
      isConfirm: false,
      teamRadio: [],
      teamResult: [],
      memberResult: [],
      checkedMember: [],
      checkAll: [],
      submitTeamId: false,

      GetWindowInfo:{
        height: 0,  //动态获取content高度
        width: 0	//动态获取content宽度
      },
    };
  },
  created() {
    if (this.$route.params.topicTitle) {
      this.topicTitle = this.$route.params.topicTitle;
    }
    var self = this;
    window.handleAuthResult = function (id) {
      handleAuthResult(id, self);
    };

    let id = this.$store.getters.id
    getTeamUser(id).then(res => {
      let reselts = res.data.data;
      this.teamResult = reselts
    }).catch(err => {
      console.log(error);
    })

    window.addEventListener('resize', this.GetWindowInfoFn); 
    this.GetWindowInfoFn() //页面创建时先调用一次
  },
  watch: {
    finalCheckedUsers: {
      handler(value, oVal) {
        if (value.length > 0) {
          this.fbFlag = false;
          this.twFlag = false;
          this.ytbFlag = false;
          value.forEach((item) => {
            if (item.oauthType.toLowerCase() == "facebook") {
              this.fbFlag = true;
            } else if (item.oauthType.toLowerCase() == "twitter") {
              this.twFlag = true;
            } else if (item.oauthType.toLowerCase() == "google") {
              this.ytbFlag = true;
            } else {}
          });
        } else {
          this.fbFlag = false;
          this.twFlag = false;
          this.ytbFlag = false;
        }
      },
      deep: true
    }
  },
  mounted() {
    
    let _this = this;
    this.$nextTick(function () {
      //获取传递的参数
      let objParams = this.$route.params.topic;
      this.pushObj.content = objParams ? "#" + objParams : "";

      let urlPars = new UrlSearch();
      if (local.get('imp')) {
        _this.getIMPdata(local.get('imp'));
      } else if (urlPars.article_id) {
        _this.getIMPdata({
          pl: urlPars.pl,
          type: urlPars.type,
          article_id: urlPars.article_id
        });
      }

    });

    window.onbeforeunload = function (e) {

      if (_this.topicTitle != "" ||
        _this.pushObj.content != "" ||
        _this.videoResources.length > 0 ||
        _this.fileListImgs.length > 0 ||
        _this.fileListGifImgs.length > 0
      ) {
        var message = '关闭';
        e = e || window.event;
        if (e) {
          e.returnValue = message;
        }
        return "";
      }
    };

  },
  beforeRouteLeave(to, from, next) {

    if (this.topicTitle != "" ||
      this.pushObj.content != "" ||
      this.videoResources.length > 0 ||
      this.fileListAudio.length > 0 ||
      this.fileListImgs.length > 0 ||
      this.fileListGifImgs.length > 0
    ) {
      setTimeout(() => {
        this.$confirm('系统可能不会保存您所做的更改。', '离开此页面？', {
          confirmButtonText: '离开',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next()
        }).catch(() => {

        })
      }, 300)
    } else {
      next()
    }
  },
  destroyed() {
    window.onbeforeunload = null;
    window.removeEventListener('resize', this.GetWindowInfoFn)
  },
  methods: {
    GetWindowInfoFn(){
      this.GetWindowInfo.height=window.innerHeight - 200 +'px';
      this.GetWindowInfo.width=window.innerWidth+'px';
    },
    getMemberUserData(id) {
      let that = this;
      this.submitTeamId = id;
      this.memberResult = [];
      getMemberUser({
        userId: null,
        teamId: id
      }).then(response => {
        let res = response.data.data
        this.memberResult = res.filter(u => u);
        setTimeout(() => {
          that.loading = false;
        }, 1000)

      }).catch(err => {
        setTimeout(() => {
          that.loading = false;
        }, 1000)
      })

    },
    //团队添加
    teamRadioSelect(val) {
      this.loading = true;
      this.getMemberUserData(val)
    },
    handleCheckAllMemberChange(val) {
      let finalCheckAll = [];
      this.memberResult.forEach((v, k) => {
        finalCheckAll.push(v.id)
      })

      this.checkedUsers = val ? this.memberResult : []
    },
    handleCheckedMemberChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.memberResult.length;
    },
    //账号添加
    closeSocialDialog(done) {
      done()
    },
    addSocial() {
      this.selectUserDialogVisible = true
      if (this.finalCheckedUsers.length > 0 && this.checkedUsers.length == 0) {
        this.finalCheckedUsers.forEach((v, k) => {
          this.checkedUsers.push(v.id)
        })
      } else {
        this.handlecheckedUsersChange(this.checkedUsers)
      }
    },
    handleCheckAllChange(val) {
      let finalCheckAll = [];
      this.filteredOauthUsers.forEach((v, k) => {
        finalCheckAll.push(v.id)
      })
      this.checkAllAccount = val
      this.checkedUsers = val ? finalCheckAll : []
    },
    accountHandleClick(tab, eve) {
      this.checkedUsers = [];
    },

    //初始化imp数据
    getIMPdata(data) {

      getByUrl(data).then(res => {
        this.topicTitle = res.data.title;
        this.pushObj.content = res.data.content;
        let value = this.pushObj.content;

        //中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
        let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
        let mat = value.match(cnReg);

        if (mat) {
          this.currentLength = mat.length * 2 + (value.length - mat.length);
        } else {
          this.currentLength = value.length;
        }

        res.data.images.forEach((item, idx) => {
          if (idx <= 8) {
            if (/\.gif/.test(item.url)) {
              this.showuploadImg = 'image';
              this.fileListGifImgs.push(item);
            } else {
              this.showuploadImg = 'image';
              this.fileListImgs.push(item)
            }
          }
        })
        res.data.videos.forEach((item, idx) => {
          if (idx < 2) {
            this.showuploadVideo = 'video';
            this.video.url = item.url;
            this.videoResources.push(item);
          }
        })
        local.remove('imp');
      }).catch(err => {

      })
    },
    //定时日期
    getPicker(val, idx) {
      this.finalCheckedUsers[idx] =
        Object.assign(this.finalCheckedUsers[idx], val)

    },
    //定时时区
    getTimeZone(val, idx) {
      this.finalCheckedUsers[idx] =
        Object.assign(this.finalCheckedUsers[idx], val)
    },
    pcTophone(type) {
      if (type == "isPC") {
        this.ispcTophone = type;
      } else {
        this.ispcTophone = type;
      }
    },
    weiboVideoAlert() {
      this.$notify({
        title: "错误",
        message: "微博平台不支持上传视频！",
        type: "error",
        duration: 5000,
      });
    },
    validateTextLength(value) {
      //中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      let mat = value.match(cnReg);
      let length = 0;
      let editState = !1;
      //子数据有未保存状态
      this.editItem.forEach((v, k) => {
        if (v) {
          editState = !0;
        }
      });

      if (editState) {
        this.pushObj.content = value.substr(0, value.length - 1);
        this.$message.error("你有编辑状态的贴文！");
        return false;
      }

      if (mat) {
        this.currentLength = mat.length * 2 + (value.length - mat.length);
      } else {
        this.currentLength = value.length;
      }

      if (value.length > 1) {
        this._isEmpty = true;
      } else {
        this._isEmpty = false;
      }

      this.finalCheckedUsers.forEach((v, k) => {
        v.child_content = value;
      });
    },
    topicTitleFn(value) {

      if (value.length > 1) {
        this.isEmpty = true;
        this.pushStatus = false;
      } else {
        this.isEmpty = false;
        this.pushStatus = true;
      }

      this.finalCheckedUsers.forEach((v, k) => {
        v.child_topicTitle = value;
      });

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
        this.storageArr.push({
          id: v.id,
          content: ""
        });

        //博客类型
        if (v.oauthType.toLowerCase() == 'podcast' && v.podcastInfo.type == 0) {
          this.isOauthType_Podcast = true;
        }

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
      this.isConfirm = true;
      //这里处理一下数据加入图片和视频的单选操作标识
      let checkedUsers = JSON.parse(JSON.stringify(this.checkedUsers));
      let checkedUsersArr = []
      if (this.activeName == 'personal') {
        this.filteredOauthUsers.forEach((item) => {
          checkedUsers.forEach((v, k) => {
            if (v == item.id) {
              checkedUsersArr.push(item)
            }
          })
        })

        checkedUsersArr.forEach((v, k) => {
          v.child_content = this.pushObj.content;
          v.scheduleTimeZone = '(+08:00) China Time - Beijing';
          v.schedulePicker = new Date();
          v.initScheduleTime = moment().format("HH:mm:ss");
          v.scheduleTime = moment().subtract(-1, "hours").format("HH:mm:ss");
          v.checkoutBox = true;
        });

      } else {
        this.memberResult.forEach((item) => {
          checkedUsers.forEach((v, k) => {
            if (v.id == item.id) {
              checkedUsersArr.push(item)
            }
          })
        })

        let arry2 = [];
        checkedUsersArr.map(((item, index) => {
          arry2.push(Object.assign({},
            item, {
              oauthType: item.source,
              child_content: this.pushObj.content,
              scheduleTimeZone: '(+08:00) China Time - Beijing',
              schedulePicker: new Date(),
              initScheduleTime: moment().format("HH:mm:ss"),
              scheduleTime: moment().subtract(-1, "hours").format("HH:mm:ss"),
              checkoutBox: true
            }
          ))
        }))

        checkedUsersArr = JSON.parse(JSON.stringify(arry2));

      }


      if (this.fileListImgs.length == 0 &&
        this.fileListGifImgs.length > 0
      ) {
        checkedUsersArr.forEach((item) => {
          item.mediaType = "2";
        });
      } else if (
        this.fileListImgs.length > 0 &&
        this.fileListGifImgs.length == 0
      ) {
        checkedUsersArr.forEach((item) => {
          item.mediaType = "1";
        });

      } else if (
        this.fileListImgs.length == 0 &&
        this.fileListGifImgs.length == 0 &&
        this.videoResources.length > 0
      ) {
        checkedUsersArr.forEach((item) => {
          item.mediaType = "3";
        });
      } else if (
        this.isOauthType_Podcast
      ) {
        checkedUsersArr.forEach(item => {
          item.mediaType = "4";
        })
      } else {
        checkedUsersArr.forEach((item) => {
          item.mediaType = "1";
        });
      }

      if (this.activeName == 'personal') {
        this.finalCheckedUsers = JSON.parse(JSON.stringify(checkedUsersArr));
        this.setUserTypes(this.finalCheckedUsers);
      } else {
        this.checkedMember = JSON.parse(JSON.stringify(checkedUsersArr));
        this.finalCheckedUsers = JSON.parse(JSON.stringify(checkedUsersArr));
        this.setUserTypes(this.finalCheckedUsers);

      }

      if (this.weiboUserSelectedVideo) {
        this.weiboVideoAlert();
      }
    },
    removeUser(targetUser, index) {

      if (this.activeName == 'personal') {

        this.finalCheckedUsers = this.finalCheckedUsers.filter(
          (u) => u != targetUser
        );
        let count = 0;
        this.finalCheckedUsers.forEach((item, idx) => {
          if (item.oauthType.toLowerCase() == 'podcast' && item.podcastInfo.type == 0) {
            count++;
          }
        })

        if (!count) {
          this.isOauthType_Podcast = false;
        }
        this.storageArr = this.arrSlice(this.storageArr, index);

        let finalCheckedArr = [];
        this.finalCheckedUsers.forEach((v, k) => {
          finalCheckedArr.push(v.id)
        })

        this.checkedUsers = finalCheckedArr
        this.handlecheckedUsersChange(this.checkedUsers)

      } else {
        this.finalCheckedUsers = this.checkedMember = this.checkedMember.filter(
          (u) => u != targetUser
        );
        let count = 0;
        this.checkedMember.forEach((item, idx) => {
          if (item.source.toLowerCase() == 'podcast' && item.podcastInfo.type == 0) {
            count++;
          }
        })

        if (!count) {
          this.isOauthType_Podcast = false;
        }
        this.storageArr = this.arrSlice(this.storageArr, index);

        let finalCheckedArr = [];
        this.checkedMember.forEach((v, k) => {
          finalCheckedArr.push(v.id)
        })
        this.checkedUsers = JSON.parse(JSON.stringify(finalCheckedArr))
      }
    },
    exceed() {
      this.$message.error("最多只能上传9张图片");
    },
    handlecheckedUsersChange(val) {
      if (val) {
        let checkedCount = val.length;
        this.checkAllAccount = checkedCount === this.filteredOauthUsers.length;
      }
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
      if (type == "audio-btn") {
        this.open(() => {
          this.showuploadAudio = "audio";
          this.showupload = "audio";
        });
      }
    },
    uploadLink() {
      this.open(() => {
        this.showupload = "link";
      });
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
          type: "warning",
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
    containsGif() {
      if (this.pushObj.resourcesUrl.length === 0) {
        return false;
      }
      for (let index = 0; index < this.pushObj.resourcesUrl.length; index++) {
        const url = this.pushObj.resourcesUrl[index];
        if (url.indexOf("gif") > -1) {
          return true;
        }
      }
      return false;
    },
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
      this.getTimes(file);
      this.uploadVideo("video-btn");
      return true;
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
    //视频重命名
    saveEdit() {
      let param = {
        id: this.video.id,
        url: this.video.url,
        title: this.video.name,
        description: null,
        tags: null,
        public: false
      }
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
        this.$message.warning('名字长度不能超过50字');
        return;
      }
      putPic(param).then((response) => {
          this.$message.success('成功');
        })
        .catch(msg => {
          this.$message.error('失败');
        })
    },
    uploadProgressVideo(ev, file, fileList) {
      this.progressBarVideo = Math.floor(ev.percent)
    },
    handleRemove(file, fileList) {
      this.videoResources = [];
    },
    beforeRemove(file, fileList) {
      return false;
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
    handleRemoveList(file, idx) {
      let filterImg = [];
      filterImg = this.fileListImgs;
      this.fileListImgs.splice(idx, 1)

      this.imageResources = this.imageResources.filter((u) => {
        u.url != file.url;
      });

      if (this.fileListImgs.length == 0 && this.fileListGifImgs.length == 0) {
        this.showuploadImg = "";
      }

      this.pushObj.resourcesUrl = this.pushObj.resourcesUrl.filter((u) => {
        u !== file.url;
      });
    },
    handleRemoveListGif(file, idx) {

      this.fileListGifImgs.splice(idx, 1);
      if (this.fileListGifImgs.length > 0) {
        this.imageResources = this.imageResources.filter((u) => {
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
    exceedVideo() {
      this.$message.error("最多可上传1个视频");
    },
    exceedAudio() {
      this.$message.error("最多可上传1个音频");
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
        mediaType: "",
      };
      this.$nextTick(() => {
          let res = (response.data[0])
          let checkedUsers = JSON.parse(JSON.stringify(this.checkedUsers));
          if (res.obj.resourceType == "IMAGE") {
            this.imgLoading = false;
            this.showupload = "image";
            this.uploadImg("img-btn");
            this.pushObj.resourcesUrl.push(res.url);
            imgObj.name = res.obj.name;
            imgObj.url = res.obj.url;
            imgObj.id = res.obj.id;
            imgObj.width = res.obj.width;
            imgObj.height = res.obj.height;

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
                this.finalCheckedUsers.forEach((item) => {
                  item.mediaType = "2";
                });

                imgObj.mediaType = "2";
                this.fileListGifImgs.push(imgObj);
              } else {
                //非gif
                imgObj.mediaType = "1";
                this.fileListImgs.push(imgObj);

                this.finalCheckedUsers.forEach((item) => {
                  item.mediaType = "1";
                });
              }

              checkedArr.push(imgObj);
            }
            // this.finalCheckedUsers = checkedUsers;
          } else {
            this.progressBarShow = false;
            this.progressBarVideo = 0;
            this.videoLoading = false;
            this.pushObj.resourcesUrl.push(res.url);
            this.videoResources.push(res.obj);
            this.video.url = res.url;
            this.video.name = res.name;
            this.video.id = res.id;
            this.editVideoName = res.name;
            this.finalCheckedUsers.forEach((item) => {
              item.mediaType = "3";
            });
            // this.finalCheckedUsers = checkedUsers;
          }
      });
    },
    uploadProgressAudio(ev, file, fileList) {
      this.progressBarAudio = Math.floor(ev.percent)
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
        this.videoLoading = false;
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
    changePublishBtnStatus() {
      this.publishing = !this.publishing;
    },
    //关闭图片
    imageClose() {
      if (this.fileListImgs.length > 0) {
        this.$confirm("是否删除已添加的图片?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
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
    //关闭音视频
    videoClose(type) {

      if (type == 'clearData') {
        this.beforeRemove();

        this.$refs.uploadVideo.abort();
        this.videoResources = [];
        this.fileList = [];
        this.video.url = '';
        this.video.name = '';
        this.open(() => {
          this.showuploadVideo = "";
        });

        this.$refs.uploadAudio.abort();
        this.audioResources = [];
        this.fileListAudio = [];
        this.audio.url = '';
        this.audio.name = '';
        this.open(() => {
          this.showuploadAudio = "";
        });

      }


      if (this.videoResources.length > 0 || this.fileListAudio.length > 0) {
        this.$confirm("是否删除已添加的素材?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            // this.pushObj.resourcesUrl = [];
            if (type == 'video') {
              this.videoResources = [];
              this.fileList = [];
              this.video.url = '';
              this.video.name = '';
              this.pushObj.contentType = "";
              this.pushObj.linkUrl = "";
              this.open(() => {
                this.showuploadVideo = "";
              });
            } else {
              this.fileListAudio = [];
              this.audioResources = [];
              this.audio.url = '';
              this.audio.name = '';
              this.pushObj.contentType = "";
              this.pushObj.linkUrl = "";
              this.open(() => {
                this.showuploadAudio = "";
              });
            }
          })
          .catch(() => {});
      } else {
        this.beforeRemove();
        if (type == 'video') {
          this.$refs.uploadVideo.abort();
          this.videoResources = [];
          this.fileList = [];
          this.video.url = '';
          this.video.name = '';
          this.open(() => {
            this.showuploadVideo = "";
          });
        } else {
          this.$refs.uploadAudio.abort();
          this.audioResources = [];
          this.fileListAudio = [];
          this.audio.url = '';
          this.audio.name = '';
          this.open(() => {
            this.showuploadAudio = "";
          });
        }
      }
    },
    open(func) {
      func();
    },
    checkPushContent() {
      if (this.weiboUserSelectedVideo && this.pushObj.resourcesUrl.length > 0) {
        this.weiboVideoAlert();
        return false;
      }
      if (this.containsWeibo) {
        if (!this.pushObj.linkUrl) {
          this.$notify({
            title: "错误",
            message: "微博平台必须输入链接！",
            type: "error",
            duration: 5000,
          });
          return false;
        } else if (this.currentLength > this.maxlength) {
          this.$notify({
            title: "注意",
            message: "内容字数超过微博上限！",
            type: "error",
            duration: 2000,
          });
          return false;
        }
      }
      if (this.containsTwitter && this.checkTextFlag) {
        if (
          "link" === this.pushObj.contentType &&
          this.currentLength + this.pushObj.linkUrl.length > this.twTextMaxLen
        ) {
          this.$notify({
            title: "注意",
            message: "内容字数超过Twitter上限！(含链接字数)",
            type: "error",
            duration: 2000,
          });
          return false;
        }
        if (this.currentLength > this.maxlength) {
          this.$notify({
            title: "注意",
            message: "内容字数超过Twitter上限！",
            type: "error",
            duration: 2000,
          });
          return false;
        }
      }

      if (this.containsFacebook && this.checkTextFlag) {
        if (
          "link" === this.pushObj.contentType &&
          this.currentLength + this.pushObj.linkUrl.length > this.fbTextMaxLen
        ) {
          this.$notify({
            title: "注意",
            message: "内容字数超过Facebook上限！(含链接字数)",
            type: "error",
            duration: 2000,
          });
          return false;
        }
        if (this.currentLength > this.maxlength) {
          this.$notify({
            title: "注意",
            message: "内容字数超过Facebook上限！",
            type: "error",
            duration: 2000,
          });
          return false;
        }
      }

      return true;
    },
    //重置
    reset() {
      let itemEdit = false;
      let text = document.querySelectorAll(".ispc-text");
      for (let i = 0; i < text.length; i++) {
        if (text[i].length > 0) {
          let osfipin = text[i].replace(/(^\s*)|(\s*$)/g, "");
          if (osfipin.length > 0) itemEdit = true;
        }
      }

      if (
        this.topicTitle.length > 0 ||
        this.pushObj.content.length > 0 ||
        this.showupload.length > 0 ||
        itemEdit
      ) {
        this.$confirm("清空编辑，预览内容?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            this.topicTitle = "";
            this.pushObj.content = "";
            if (this.aloneArr.length > 0) {
              this.aloneArr.forEach((val, idx) => {
                this.$refs.message.innerText = "";
                this.$set(this.editItem, idx, false);
                this.$set(this.editActive, idx, true);
                this.$set(this.cancelActive, idx, false);
                this.$set(this.saveActive, idx, false);
                this.$set(this.active, idx, false);
                this.publishing = false;
              });
            } else {
              this.finalCheckedUsers.forEach((val, idx) => {
                this.$refs.message.innerText = "";
                this.isEmpty = true;
                this.publishing = false;
                this.$set(this.editItem, idx, false);
                this.$set(this.editActive, idx, true);
                this.$set(this.cancelActive, idx, false);
                this.$set(this.saveActive, idx, false);
                this.$set(this.active, idx, false);
              });
            }

            this.open(() => {
              this.showupload = "";
            });
          })
          .catch(() => {});
      }
    },
    changeKey(arr, key) {
      let newArr = [];
      arr.forEach((item, index) => {
        let newObj = {};
        for (var i = 0; i < key.length; i++) {
          newObj[key[i]] = item[Object.keys(item)[i]]
        }
        newArr.push(newObj);
      })
      return newArr;
    },
    //一键发布
    update() {
      this.allPush = true;
      this.checkTextFlag = false;
      this.pushStatus = true;
      let podcastAudio = false;
      let podcastVideo = false;

      if (this.activeName == 'team') {
        this.auditTopic = true;
        this.auditContent = true;
        this.isHide = true;
        this.pushObj.teamId = this.submitTeamId;
      } else {
        this.pushObj.teamId = false;
      }

      //验证右边字数
      let checkText = function (value) {
        //中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
        let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
        let mat = value.match(cnReg);
        let length = 0;
        if (mat) {
          return Number(mat.length * 2 + (value.length - mat.length));
        } else {
          return Number(value.length);
        }
      };

      this.finalCheckedUsers.forEach((user, idx) => {
        //obj=JSON.parse(JSON.stringify(pushObj));
        let text = document.querySelectorAll(".ispc-text")[idx];
        if (
          checkText(user.child_content) > this.fbTextMaxLen &&
          user.oauthType.toLowerCase() == "facebook"
        ) {
          this.checkTextFlag = true;
          this.$notify({
            title: "注意",
            message: user.nick + "内容字数超过Facebook上限！",
            type: "error",
            duration: 2000,
          });
          return false;
        }
        if (
          checkText(user.child_content) > this.twTextMaxLen &&
          user.oauthType.toLowerCase() == "twitter"
        ) {
          this.checkTextFlag = true;
          this.$notify({
            title: "注意",
            message: user.nick + "内容字数超过Twitter上限！",
            type: "error",
            duration: 2000,
          });
          return false;
        }
        if (
          user.oauthType.toLowerCase() == "podcast"
        ) {
          if (
            user.podcastInfo.type == 1 &&
            this.videoResources.length < 1
          ) {
            podcastVideo = true;
          }
          if (
            user.podcastInfo.type == 0 &&
            this.fileListAudio.length < 1
          ) {
            podcastAudio = true;
          }
        }
      });

      if (this.checkTextFlag) {
        return false;
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

      if (
        !this.pushObj.content &&
        this.fileListGifImgs.length == 0 &&
        this.fileListAudio.length == 0 &&
        this.fileListImgs.length == 0 &&
        this.videoResources.length == 0
      ) {
        this.$notify({
          title: "注意",
          message: "请输入要上传的数据！",
          type: "error",
          duration: 2000
        });
        this.changePublishBtnStatus();
        return;
      }

      if (
        podcastAudio &&
        this.fileListAudio.length < 1
      ) {
        this.$notify({
          title: "注意",
          message: "播客的音频不能为空！",
          type: "error",
          duration: 2000,
        });
        this.changePublishBtnStatus();
        return;
      }

      if (
        podcastVideo &&
        this.fileListAudio.length < 1
      ) {
        this.$notify({
          title: "注意",
          message: "播客的视频不能为空！",
          type: "error",
          duration: 2000,
        });
        this.changePublishBtnStatus();
        return;
      }

      // if (this.pushObj.pushType === "schedule" && !this.pushObj.scheduleTime) {
      //   this.$notify({
      //     title: "注意",
      //     message: "请输入推送时间！",
      //     type: "error",
      //     duration: 2000,
      //   });
      //   this.changePublishBtnStatus();
      //   return;
      // }
      let isSaved;
      this.saveActive.forEach((val, idx) => {
        if (val) isSaved = true;
      });
      if (isSaved) {
        this.$notify({
          title: "注意",
          message: "你有未保存贴文！",
          type: "error",
          duration: 2000,
        });
        this.changePublishBtnStatus();
        return;
      }

      // 选择图片or视频但未上传
      if (
        this.pushObj.resourcesUrl.length === 0 &&
        (this.showupload === "image" || this.showupload === "video")
      ) {
        this.pushObj.contentType = "";
      } else if (this.showupload === "link" && !this.pushObj.linkUrl) {
        //选择链接但未填写
        this.pushObj.contentType = "";
      } else {
        this.pushObj.contentType = this.showupload;
      }
      if (!this.checkPushContent()) {
        this.changePublishBtnStatus();
        return;
      }

      pushTopic({
          title: this.topicTitle,
          auditTopic: this.auditTopic,
          hidden: this.isHide,
          containAuditContent: this.auditContent
        })
        .then((r) => {
          let requestList = [];
          let pushObj = this.pushObj;
          let that = this;
          let textTips;
          if (this.activeName == 'team') {
            textTips = '贴文已提交审核，请到我的提审列表中查看审核状态'
          } else {
            textTips = '贴文即将发布，可到贴文列表查看发布状态'
          }

          this.$notify({
            title: "消息",
            dangerouslyUseHTMLString: true,
            onClick: () => {
              this.activeName == 'team' ? this.$router.push("/postreview/reviewer") : this.$router.push("/pushlist/index");
            },
            message: '<span style="cursor: pointer;text-decoration: underline;">' + textTips + '</span>',
            type: "success",
            duration: 2000,
          });

          this.finalCheckedUsers.forEach((user, idx) => {
            //obj=JSON.parse(JSON.stringify(pushObj));
            // if (this.active[idx]) {
            //    单发
            //   return false;
            // }

            let obj = Object.assign({}, pushObj);
            obj.checkedUsers = [user];
            obj.topicId = r.data.id;
            that.topicId = r.data.id;
            obj.topicTitle = this.topicTitle;
            obj.content = user.child_content;

            if (user.scheduleTimeZone.indexOf('Beijing') != -1) {
              var _timeZone = '+0800'
            } else {
              var _timeZone = user.scheduleTimeZone
            }

            if (user._scheduleTime) {
              var _scheduleTime = user._scheduleTime
            } else {
              var _scheduleTime = user.scheduleTime
            }

            obj.scheduleTime = this.pushObj.pushType == "schedule" ? new Date(
              moment(
                new Date(user.schedulePicker).getTime()
              ).format('YYYY-MM-DD') + ' ' +
              _scheduleTime + ' ' +
              _timeZone
            ).getTime() : new Date().getTime();


            //图片or视频参数
            if (user.mediaType == "1") {
              obj.contentType = "image";
              obj.resourcesUrl = [];
              if (obj.checkedUsers[0].oauthType.toLowerCase() == "twitter") {
                //twitter
                this.fileListImgs.forEach((item, idx) => {
                  if (idx <= 3) {
                    obj.resourcesUrl.push(item.url);
                    obj.resourceInfos.push(item);
                  }
                });
              } else {
                this.fileListImgs.forEach((item, idx) => {
                  if (idx <= 7) {
                    obj.resourcesUrl.push(item.url);
                    obj.resourceInfos.push(item);
                  }
                });
              }
            }

            if (user.mediaType == "2") {
              obj.contentType = "image";
              obj.resourcesUrl = [];
              if (obj.checkedUsers[0].oauthType.toLowerCase() == "twitter") {
                //twitter
                obj.resourcesUrl.push(this.fileListGifImgs[0].url);
              } else {
                obj.resourcesUrl.push(this.fileListGifImgs[0].url);
              }
              obj.resourceInfos.push(this.fileListGifImgs[0]);
            }

            // if (!this.showuploadImg &&
            //   this.videoResources.length > 0) {
            //   obj.contentType = "video";
            //   obj.resourcesUrl = [];
            //   this.videoResources.forEach((item) => {
            //     obj.resourcesUrl.push(item.url);
            //   });
            // }

            if (user.mediaType == "3") {
              obj.contentType = "video";
              obj.resourcesUrl = [];
              obj.resourceInfos = this.videoResources
              this.videoResources.forEach((item) => {
                obj.resourcesUrl.push(item.url);
              });
            }

            if (user.oauthType == 'GOOGLE') {
              if (this.videoResources.length > 0) {
                obj.contentType = "video";
                obj.videoTitle = this.video.name;
                obj.resourcesUrl = [];
                this.videoResources.forEach((item) => {
                  obj.resourcesUrl.push(item.url);
                });
              } else {
                obj.contentType = "video";
                obj.resourcesUrl = [];
              }
            }

            if (user.oauthType == 'PODCAST' &&
              this.videoResources.length > 0 &&
              user.podcastInfo.type == 1
            ) {
              obj.resourceInfos = this.videoResources
              obj.contentType = 'video'
            }

            if (user.oauthType == 'PODCAST' &&
              this.fileListAudio.length > 0 &&
              user.podcastInfo.type == 0
            ) {
              obj.resourcesUrl = [];
              obj.resourceInfos = this.fileListAudio
              this.fileListAudio.forEach((item) => {
                obj.resourcesUrl.push(item.url);
              });
              obj.contentType = 'audio'
            }

            if (this.fileListGifImgs.length < 1 &&
              this.fileListImgs.length < 1 &&
              this.videoResources.length < 1 &&
              user.oauthType != 'PODCAST'
            ) {
              obj.contentType = ""
            }

            //是否审核
            let p;
            if (this.auditContent) {
              p = pushContentSubmit(obj);
            } else {
              p = pushContent(obj);
            }

            requestList.push(p);

            p.then((response) => {
              let aloneObj = {};

              aloneObj.socialAccountId = response.data[0].socialAccountId;
              aloneObj.socialPlatform = response.data[0].socialPlatform;
              aloneObj.resourcesUrl = obj.resourcesUrl;
              aloneObj.contentType = obj.contentType;
              aloneObj.scheduleTime = obj.scheduleTime;
              aloneObj.linkUrl = obj.linkUrl;
              aloneObj.pushType = obj.pushType;
              that.aloneArr.push(aloneObj);

              //统计
              postActivity({
                oauthUserId: aloneObj.socialAccountId,
                oper: "push",
              }).then((res) => {});
            }).catch((e) => {
              console.error(e);
            });
          });

          this.clearData();

          Promise.all(requestList)
            .then((r) => {
              r.forEach((val, idx) => {
                if (val.data[0].code == 200) {
                  setTimeout(() => {
                    /*
                    this.$notify({
                      title: "消息",
                      message: "推送完成！",
                      type: "success",
                      duration: 1000,
                    });
                    */

                    // this.$set(this.active, idx, true);
                    this.$set(this.editActive, idx, true);
                  }, 1000);
                } else {}
              });
              this.changePublishBtnStatus();
              this.$store.dispatch("oauth/resetUsers").catch((e) => {
                console.log(e);
              });
            })
            .catch((e) => {
              this.changePublishBtnStatus();
              console.log(e);
            });
        })
        .catch((e) => {
          this.changePublishBtnStatus();
        });
    },
    //清空数据
    clearData() {
      this.storageArr = [];
      this.pushObj.resourcesUrl = [];
      this.pushObj.content = "";
      this.pushObj.linkUrl = "";
      this.pushObj.contentType = "";
      this.pushObj.resourceInfos = [];
      this.fileList = [];
      this.imageResources = [];
      this.videoResources = [];
      this.fileListAudio = [];
      this.audioResources = [];
      this.fileListImgs = [];
      this.topicTitle = "";
      this.finalCheckedUsers = [];
      this.video.name = "";
      this.video.url = "";
      this.audio.name = "";
      this.audio.url = "";
      this.fileListGifImgs = [];
      this.imageClose();
      this.videoClose('clearData');
      this.showuploadAudio = false;
      this.progressBarVideo = 0;
      this.progressBarAudio = 0;
      this.videoTitle = false;
    },
    //跳转
    handlePushlistClick() {
      this.$router.push("/pushlist/index");
    },
    arrSlice(val, index) {
      if (val) {
        return val.slice(0, index).concat(val.slice(index + 1, val.length));
      }
    },
    //单保存
    setEditingManuscripts(idx, child_content) {
      this.storageArr[idx].content = child_content;
      this.$set(this.finalCheckedUsers[idx], "child_content", child_content);
    },
    //单取消
    setCancelListItem(index, content) {
      this.$set(this.finalCheckedUsers[index], "child_content", content);
    },
    //素材库
    openChDialogPics() {
      this.$refs.cDialog.openDialog();
    },
    getShowuploadImg(msg) {
      this.showuploadImg = msg;
    },
    getImgLibCloseDialog(msg) {
      this.dialogPicsVisible = msg;
    },
    getFileListImgs(msg) {
      this.fileListImgs = msg;
    },
    getFileListGifImgs(msg) {
      this.fileListGifImgs = msg;
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
    //裁剪
    handleScissor(file, index) {
      let that = this;
      this.piccropperIndex = index;
    
      // this.cropperImg = file.url;
      setBase64(file.url, (base64) => {
        that.cropperImg = base64;
        that.imgFileName = file.title;
        that.$refs.cCropper.piccropper();
      })

    },
    handleZoom(file, index) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getPicSrc(msg) {
      this.fileListImgs[this.piccropperIndex].url = msg.url
    },
    //单选项
    handleRadio(user, idx, val) {
      //this.finalCheckedUsers[idx].mediaType = val;
    },

  },
};
