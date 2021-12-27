<template>
  <div class="app-container">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按主题排列" name="first" :key="'first'">
       <topics v-if="isFirst" />
      </el-tab-pane>
      <el-tab-pane label="按贴文排列" name="second" :key="'second'">
          <essay v-if="isSecond" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import topics from "./topics"
import essay from "./essay"
export default {
  name: 'PushContentList',
  components: { topics, essay },
  data(){
    return {
      activeName: 'first',
      isFirst: true,
      isSecond: false
    }
  },
  methods: {
    //切换内容
    handleClick() {
      if (this.activeName == 'first') {
        this.activeName = 'first'
        this.isFirst = true
        this.isSecond = false
      }
      else {
        this.activeName = 'second';
        this.isFirst = false
        this.isSecond = true
      }
    }

  }
}
</script>
<style lang="scss" scoped>

@import "../../styles/variables.scss";

.article-box{
  overflow-y:auto;
  max-height: 400px;
  .box-card {
    &:hover {
        border-color:$primary;
    }
    .right-wrap{
        width:30%;
        border: rgb(242, 237, 243) solid 1px;
        border-radius: 5px;
        padding: 20px;
        background-color: $bg;
       
    }
    .data-wrap {
        .right-title {
            color: $primary_dark;
            text-align: center;
        }
        
        li {
            list-style: none;
            padding: 10px 0;
        }
    }
  }
}

//折叠区
.app-container ::v-deep .el-menu-wrap{
  .el-menu-item, .el-submenu__title{
    height:auto;
  }
  .el-submenu__title{
    padding:0px;
    height: 115px;
  }
  .title{
    &-checkbox{
      height: 28px;
    }
    &-times{
      height: 30px;
    }
    .item .el-badge__content{
        background-color: green;
    }
    .fb-svg-container{
      background-color:#1e69f5;
    }
    .wrap-lists-user{
      display: inline-block;
      margin-right: 10px;
      margin-top: 25px;
    }
    .el-badge__content.is-fixed{
      top:12px;
    }
  }
}

#app .hideSidebar .el-submenu > .el-submenu__title .el-submenu__icon-arrow{
  display: block!important;
}


//新开
.app-container ::v-deep .article-wrap{
  .article-header{
    padding: 10px 0px;
    border-bottom: 1px solid #dddddd;
  }
  .article-title{
    width: 300px;
  }
  .title{
    max-width: 800px;
  }
  .title .title-topics,
  .title .article-box-title{
     font-weight: 600;
  }
  .FACEBOOK,
  .TWITTER{
    width:auto;
    margin-left:10px;
    font-size: 14px;
  }
  .bottom-wrap p{
    font-size: 14px;
    padding:0px 10px;
    line-height: 1.8em;
  }
  .left-wrap{
    width:60%
  }
  
  .data-wrap{
    background-color: #f6f7fb;
    height: auto;
    width:315px;
  }
  .data-wrap>div{
    text-align: center;
    padding:20px 0px;
    color:#4c1bab;
    font-size:18px;
  }
  .data-wrap ul{
    list-style: none;
    padding: 0px;
    margin: 0px;    
    padding-bottom: 20px;
  }
  .data-wrap li{
    padding:10px 30px 20px 30px;
  }
  .data-wrap li span{
    display: inline-block;
  }
  .zs-progress{
    background-color:#7d79f1;
    height:6px;
    border-radius: 9px;
    margin:0 10px;
  }
  .zf-progress{
    background-color:#fc6b72;
    height:6px;
     border-radius: 9px;
     margin:0 10px;
  }
  .hf-progress{
    background-color:#64c52a;
    height:6px;
     border-radius: 9px;
     margin:0 10px;
  }
  .dz-progress{
    background-color: $primary;
    height:6px;
     border-radius: 9px;
     margin:0 10px;
  }
  .tiems{
    color:#cbccd0;
  }
  // 贴文排列
  .article-status-success{
    padding:10px;
    background-color: #f1f9ec;
    color:#6bc532;
    margin:0px 10px;
  }
  .article-title{
    padding:10px;
    background-color:#f3f3ff;
    color:#8176ff;
  }
  .el-card__body{
    padding: 10px 20px;
  }
}

</style>
