<template>


    <div class="user-profile">
      <div class="box-center">
        <!-- <el-avatar></el-avatar>
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.nick }}
        </pan-thumb> -->
      </div>

      <div class="box-center">
 <el-button @click="toggleShow" class="primary">设置头像</el-button>
        <my-upload field="file"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
          v-model="show"
          :width="100"
          :height="100"
          :url="uploadUrl"
          :withCredentials="true"
          img-format="png"></my-upload>
        
      </div>
    </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import myUpload from 'vue-image-crop-upload'

export default {
  components: { PanThumb, myUpload },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          nick: '',
          roles: ''
        }
      }
    }
  },
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}/resource/avatar`,
      show: true
    }
  },
  methods: {
    toggleShow() {
				this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
				console.log('-------- crop success --------')
    },
    /**
			 * upload success
			 *
			 * [param] jsonData   服务器返回数据，已进行json转码
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field) {
				console.log('-------- upload success --------');
        this.$store.dispatch("user/updateAvatar",jsonData.url)
        .then(d => {
          this.user.avatar = jsonData.url
        })
				// console.log('field: ' + field)
			},
			/**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
			cropUploadFail(status, field){
				console.log('-------- upload fail --------')
				console.log(status)
				console.log('field: ' + field)
			}
  }
}
</script>

<style lang="scss" scoped>
  .el-card ::v-deep .user-profile {
    & {height: 400px;}
    .box-center:first-child{
      margin-top: 100px;
    }
  }
 .box-center {
   & {
    margin: 0 auto;
    display: table;
    padding: 10px 0;
   }
   button {
     color: #7e7ef4;
     border:1px solid #7e7ef4;
   }
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
