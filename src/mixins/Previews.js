export default {
  data() {
    return {
      dialogPreviewsVisible: false,
      showupload: "",
      showuploadVideo: "",
      showuploadImg: "",
      showuploadAudio: "",
      topicTitle: "",
      editContents: [],
      pushActive: [],
      saveActive: [],
      editItem: [],
      isEdit: false,
      cancelActive: [],
      editActive: [],
      active: [],
      storageArr: [],
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
      fileListImgs: [],
      fileListGifImgs: [],
      fileListAudio: [],
      fileList: [],
      imageResources: [],
      videoResources: [],
      audioResources: [],
      radio: "imageType",
      ispcTophone: "isPC",
      checkedUsers: [],
      finalCheckedUsers: [],
      publishing: true,
      pushStatus: false,
      video: {
        url: "",
        name: ""
      },
      audio: {
        url: "",
        name: ""
      },
      isPreviews: true,
      previewsLoading: true
    }
  },
  methods: {
    pcTophone(type) {
      if (type == "isPC") {
        this.ispcTophone = type;
      } else {
        this.ispcTophone = type;
      }
    },
    previews(item, index) {
      let _item;
      if (item.hasOwnProperty('pushContents')) {
        _item = item.pushContents[0];
        item = _item;
      }
console.log(item);
      this.$nextTick(() => {
        let avatar;
        let mediaType;
        let podcastInfo = {};
        this.dialogPreviewsVisible = true;
        this.filteredOauthUsers.forEach((v, k) => {
          if (v.id == item.socialAccountId) {
            avatar = v.avatar
          }
        })
        if (item.contentType.toLowerCase() == 'image') {
          item.resourcesUrl.forEach((v, k) => {
            if (k == 0) {
              this.fileListImgs.push(item.resourceInfos[0]);
            } else {
              this.fileListImgs.push({
                url: v
              });
            }
          })
          this.showuploadImg = 'image';
          mediaType = 1;
          if (item.resourcesUrl[0].indexOf('.gif') > 0) {
            mediaType = 2;
            this.fileListGifImgs.push({
              url: item.resourcesUrl[0]
            })
          }
        }

        if (item.contentType.toLowerCase() == 'audio') {
          this.audioResources = item.resourcesUrl
          this.audio.url = item.resourcesUrl[0]
          this.showuploadAudio = 'audio'
          podcastInfo.type = 0;
        }
        if (item.contentType.toLowerCase() == 'video') {
          this.videoResources = item.resourcesUrl
          this.video.url = item.resourcesUrl[0]
          this.showuploadVideo = 'video'
          mediaType = 3;
          if (item.socialPlatform.toLowerCase() == 'podcast') {
            podcastInfo.type = 1;
          }
        }

        this.finalCheckedUsers.push(Object.assign({},
          item, {
            avatar: avatar,
            oauthType: item.socialPlatform,
            nick: item.socialAccount,
            child_content: item.content,
            mediaType: mediaType,
            podcastInfo: podcastInfo,
            child_topicTitle: item.topicTitle
          }
        ))

        setTimeout(() => {
          this.previewsLoading = !this.previewsLoading;
        }, 1200)

      })
    },
    dialogClose() {
      this.finalCheckedUsers = [];
      this.fileListImgs = [];
      this.audioResources = [];
      this.videoResources = [];
      this.video = {};
      this.audio = {};
      this.previewsLoading = !this.previewsLoading;
    },
  }
}
