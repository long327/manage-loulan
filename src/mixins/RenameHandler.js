import {
  putPic
} from '@/api/resource';

export default {
  data() {
    return {

    }
  },
  methods: {
    regexp(str) {
      return (/([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,}$/.test(str));
    },
    //重命名
    saveEdit(item) {
      if (item.title.replace(/\s/g, "") == '') {
        this.$message.error("名字不能为空");
        return;
      }
      if ((/\.$/).test(item.title)) {
        this.$message.error("名字最后一位不能为点");
        return;
      }
      let param = {
        id: item.id,
        url: item.url,
        title: item.title, // + this.imgType,
        description: item.description,
        tags: item.tags,
        public: item.public
      };

      let currentLen;
      /*中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算*/
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      let mat = item.title.match(cnReg);
      let length = 0;
      if (mat) {
        currentLen = mat.length*2 + (item.title.length - mat.length);
      } else {
        currentLen = item.title.length;
      }
      if (currentLen > 50) {
        this.$message.warning('名字长度不能超过50字');
        return;
      }
      putPic(param).then((response) => {
        this.$message.success('成功');
        item.title = response.data.title;
      })
      .catch(msg=>{
        this.$message.error('失败');
      })

      this.isEdit = -1;
      this.active = false;  
      this.current = false;
      
    },
    //编辑重命名
    picEdit(idx, item) {
      // let imgName = item.title;
      // let dot = imgName.lastIndexOf('.');
      // // this.imgType = imgName.substr(dot, imgName.length-1);
      // // let splitImgName = imgName.substr(0, dot);

      this.picTitle = item.title;
      // item.title = splitImgName;
      this.isEdit = idx;
      this.active = true;
      this.current = true;
    },
    //取消重命名
    cancelEdit(item) {
      this.current = false;
      this.isEdit = -1;
      this.active = false;
      item.title = this.picTitle;
    },
  }
}
