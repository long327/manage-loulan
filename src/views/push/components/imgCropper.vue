<template>
  <div>
    <!-- 图片剪裁 -->
    <el-dialog
      title="图片剪裁"
      width="860px"
      ref="dialogCropper"
      @open="diaLogOpen"
      :visible.sync="cropperVisible"
      :before-close="cropperClose"
    >
      <div class="cropper-wrapper clearfix" v-if="cropperVisible">
        <div v-loading="imgLoading" class="loading-box">
          <div class="cropper-content">
            <div class="cropper-area">
              <div class="cropper-img cropper-bg">
                <vue-cropper
                  ref="cropper"
                  preview=".preview"
                  :auto-crop="true"
                  :can-scale="false"
                  :view-mode="1"
                  :auto-crop-area="1"
                  :center-box="false"
                  :min-container-width="600"
                  :min-container-height="400"
                  :autoCropWidth="autoCropWidth"
                  :autoCropHeight="autoCropHeight"
                  :aspect-ratio="cropperAspectWH"
                  :src="cropperImgSrc"
                  :outputType="jpeg"
                  :container-style="{ width: '100%', height: '400px' }"
                  :img-style="{ 'max-width': '100%', 'max-height': '100%' }"
                  @realTime="realTime"
                  @img-load="imgLoad"
                  :class="cropperImgSrc == '' ? 'loading' : 'loaded'"
                />
              </div>
            </div>
          </div>
          <div class="cropper-sider">
            <div class="cropper-preview">
              <template v-if="false">
                <div class="preview"></div>
              </template>
              <template v-if="false">
                <div class="cropped">
                  <img :src="cropperImg" alt="" />
                </div>
              </template>
            </div>
            <div class="cropper-scale">
              <el-radio-group
                v-model="cropperRadioVal"
                @change="cropperRadioChange"
              >
                <el-radio :label="1 / 1">1:1</el-radio>
                <!-- <el-radio :label="3/4">3:4</el-radio> -->
                <el-radio :label="4 / 3">4:3</el-radio>
                <!-- <el-radio :label="9/16">9:16</el-radio> -->
                <el-radio :label="16 / 9">16:9</el-radio>
                <el-radio :label="0">自由拖拽</el-radio>
              </el-radio-group>
              <a
                href="javascript:;"
                role="button"
                class="reset"
                title="重置"
                @click.prevent="cropperReset()"
                >重置</a
              >
            </div>
            <div class="cropper-actions" v-if="false">
              <ul class="rows">
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="move-left"
                    title="向左移动"
                    @click.prevent="cropperMove(-10, 0)"
                    >向左移动</a
                  >
                </li>
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="move-right"
                    title="向右移动"
                    @click.prevent="cropperMove(10, 0)"
                    >向右移动</a
                  >
                </li>
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="move-up"
                    title="向上移动"
                    @click.prevent="cropperMove(0, -10)"
                    >向上移动</a
                  >
                </li>
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="move-down"
                    title="向下移动"
                    @click.prevent="cropperMove(0, 10)"
                    >向下移动</a
                  >
                </li>
              </ul>
              <ul class="rows">
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="rotate-right"
                    title="向右旋转90度"
                    @click.prevent="cropperRotate(90)"
                    >向右旋转90度</a
                  >
                </li>
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="rotate-left"
                    title="向左旋转90度"
                    @click.prevent="cropperRotate(-90)"
                    >向左旋转90度</a
                  >
                </li>
              </ul>
              <ul class="rows">
                <li>
                  <a
                    ref="flipX"
                    href="javascript:;"
                    role="button"
                    class="flip-x"
                    title="上下翻转"
                    @click.prevent="cropperFlipX()"
                    >上下翻转</a
                  >
                </li>
                <li>
                  <a
                    ref="flipY"
                    href="javascript:;"
                    role="button"
                    class="flip-y"
                    title="左右翻转"
                    @click.prevent="cropperFlipY()"
                    >左右翻转</a
                  >
                </li>
              </ul>
              <ul class="rows">
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="zoom-out"
                    title="放大"
                    @click.prevent="cropperZoom(0.2)"
                    >放大</a
                  >
                </li>
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="zoom-in"
                    title="缩小"
                    @click.prevent="cropperZoom(-0.2)"
                    >缩小</a
                  >
                </li>
              </ul>
              <ul class="rows">
                <li>
                  <a
                    href="javascript:;"
                    role="button"
                    class="reset"
                    title="全部重置"
                    @click.prevent="cropperReset()"
                    >全部重置</a
                  >
                </li>
              </ul>
              <input
                ref="input"
                type="hidden"
                name="image"
                accept="image/*"
                @change="cropperSetImage"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cropperCancel()">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="cropperStart()"
          v-loading="cropperUploadloading"
          :disabled="cropperUploadloading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import {uploadPush} from "@/api/pusher"
import { Loading } from 'element-ui';

export default {
  name:'imgCropper',
  components: {
    VueCropper,
  },
  props:{
    cropperImgSrc:{
      type: String,
      default: ""
    },
    imgName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      cropperVisible: false,
      cropperLoading: false,
      cropperUploadloading: false,
      cropperRadioVal: 1,
      cropperAspectWH: 1,
      cropperImg: "",
      imgLoading: true,
      cropperData: null,
      cropImg: null,
      autoCropWidth: 200,
      autoCropHeight: 200,
      cropperForm: {
        id: 0,
        purpose: 2,
        group_id: 0,
        file_name: "",
        file_address: "",
      },
    };
  },
  methods: {
    diaLogOpen(src, scope, index) {},
    // 图片裁剪
    piccropper(src, scope, index) {
      var that = this;
      this.imgLoading = true;

      this.$nextTick(() => {
        this.cropperVisible = true;
        this.cropperImg = this.cropperImgSrc;
        setTimeout(() => {
          this.imgLoading = false;
        }, 1000);
      });
    },
    imgLoad(ev) {
      this.imgLoading = true;
    },
    realTime() {
    },
    //确定裁剪
    cropperStart() {
      this.cropperUploadloading = true;
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpg');
      // 上传裁剪后的图片
      this.normTagIcoUpload();
      
    },
    //上传图片
    normTagIcoUpload() {
      let that = this;
      let formData = new FormData();
      let width = this.$refs.cropper.getCroppedCanvas().width;
      let height = this.$refs.cropper.getCroppedCanvas().height;
      //base64转文件
      let imgName = this.imgName.replace(/(\.jpg$)|(\.png$)|(\.jpeg$)/, '');
      imgName = imgName.replace(/_\d+x\d+$/g, '');
      imgName = imgName + '_' + width + 'x' + height;
      var imgFile = that.dataURLtoFile(
        that.cropImg,
        imgName
      );

      formData.append("file", imgFile);
      /*
      //formData.append("oldFile", that.imgSrc); //本地原图地址
      formData.append("purpose", that.cropperForm.purpose);
      formData.append("group_id", that.cropperForm.group_id);
      formData.append("fileName", that.imgName);
      let config = { "Content-Type": "multipart/form-data" };
      */

    uploadPush(formData).then((res) => {
        this.$emit('srcscissor', {url: res.data[0].url, name: res.data[0].name});
        that.cropperUploadloading = false;
        that.cropperVisible = false;
      })
      .catch((error) => {
        that.cropperUploadloading = false;
        // that.$message("ajax error");
      });
    },
    // 关闭操作框
    cropperClose() {
      var that = this;
      that.cropperVisible = false;
      that.cropperRadioVal = 1;
    },
    // 取消操作框
    cropperCancel() {
      var that = this;
      that.cropperVisible = false;
      that.cropperRadioVal = 1;
    },
    //将图片Base64 转成文件
    dataURLtoFile(dataurl, filename) {
      // 获取文件扩展名称
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1];
      var extension = mime.split("/")[1];

      var bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename + "." + extension, { type: mime });
    },
    cropperRadioChange(e) {
      this.aspectWH = e;
      // console.log("当前比例:");
      // console.log(this.aspectWH);
      this.$refs.cropper.setAspectRatio(this.aspectWH);
    },
    cropperFlipX() {
      const dom = this.$refs.flipX;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleX(scale);
      dom.setAttribute("data-scale", scale);
    },
    cropperFlipY() {
      const dom = this.$refs.flipY;
      let scale = dom.getAttribute("data-scale");
      scale = scale ? -scale : -1;
      this.$refs.cropper.scaleY(scale);
      dom.setAttribute("data-scale", scale);
    },
    cropperMove(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    cropperReset() {
      this.$refs.cropper.reset();
    },
    cropperRotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    cropperZoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    cropperGetCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    cropperGetData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    cropperSetCropBoxData() {
      if (!this.data) return;

      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    cropperSetData() {
      if (!this.data) return;

      this.$refs.cropper.setData(JSON.parse(this.data));
    },
    cropperSetImage(e) {
      const file = e.target.files[0];

      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = (event) => {
          this.cropperImgSrc = event.target.result;
          this.$refs.cropper.replace(event.target.result);
          console.log(event.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    cropperShowFileChooser() {
      this.$refs.input.click();
    },
  },
};
</script>

<style lang="scss" scoped>

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}

$textCent: center;
.cropper-wrap {
  .cropper-bg {
    width: 770px;
    height: 470px;
    margin: 0 auto;
  }
  .set-val,
  .btns,
  .wh {
    padding: 20px 0px;
    text-align: $textCent;
  }
  .clipper {
    width: 100%;
    max-width: 700px;
  }
}
.loading-box {
  padding: 20px 0px;
}
.cropper-scale{
  padding-top:20px;
  text-align: center;
}
.reset{
  display: inline-block;
  margin-left: 20px;
  font-size: 12px;
  vertical-align: middle;
  padding: 10px 0px;
}
</style>
