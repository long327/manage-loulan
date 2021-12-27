<template>
  <div class="app-container">
    <div class="title">社交号管理</div>
    <div class="filter-container">
      <div class="filter-btn" @click="handleFilter('')">
        <span class="all-svg-container"><svg-icon icon-class="all" class="icon" /></span>
      </div>
      <div class="filter-btn" @click="handleFilter('facebook')">
        <span class="fb-svg-container"><svg-icon icon-class="facebook" class="icon" /></span>
      </div>
      <div class="filter-btn" @click="handleFilter('twitter')">
        <span class="tt-svg-container"><svg-icon icon-class="twitter" class="icon" /></span>
      </div>
      <div class="filter-btn isYoutube-authorized" @click="handleFilter('google')">
        <span class="google-svg-container"><svg-icon icon-class="google" class="icon" /></span>
      </div>

      <!-- <div class="filter-btn" @click="handleFilter('wechat')">
        <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span>
      </div>
      <div class="filter-btn" @click="handleFilter('weibo')">
        <span class="wb-svg-container"><svg-icon icon-class="weibo" class="icon" /></span>
      </div> -->
       <!-- <div class="filter-btn"  @click="showDialog=true">
         <span class="pl-svg-container"><i class="el-icon-circle-plus-outline" @click="showDialog=true"/></span>
      </div> -->
      <div class="right">
        <el-input
          size="mini"
          style="width: 200px;margin-right:1em"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="listQuery.keyword">
          <!-- <el-button slot="append" icon="el-icon-search" @click="searchByKeyword"></el-button> -->
          
        </el-input>
        <el-button size="mini" type="primary" @click="showDialog=true">+添加社交号</el-button>
      </div>
    </div>
    <div class="mytable">
  <el-table
        class="mytable"
        :key="tableKey"
        v-loading="listLoading"
        :data="filteredOauthUsers"
        :border = "false"
        header-cell-class-name="tb-header"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="社交号"
          min-width="300"
        >
          <template slot-scope="scope">
            <el-avatar :size="40" :src="scope.row.avatar" :class="scope.row.unAuthorized?'unauth':''" />
            <span class="nick">{{ scope.row.nick }}<svg-icon :icon-class="scope.row.oauthType.toLowerCase()" :class="'badge '+ (scope.row.unAuthorized?'unauth':'') + ' '+ scope.row.oauthType.toLowerCase()" /></span>
          </template>
        </el-table-column>
        <el-table-column label="发帖数量" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ pushCounts[scope.row.id] || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权日期" align="center" width="150">
          <template slot-scope="scope">
            <span v-if="!scope.row.unAuthorized">{{scope.row.created}}</span>
            <span v-else>{{scope.row.unAuthorized | transState}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-if="row.unAuthorized" type="text" size="mini" style="width:50px" @click="showDialog=true" >重新授权</el-button>
            <el-button v-else type="text" size="mini" style="width:50px" @click="handleDelete(row)" >解除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    /> -->
    <el-dialog title="添加帐号" :visible.sync="showDialog">
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>

// import Pagination from "@/components/Pagination" // secondary package based on el-pagination
import { mapGetters } from 'vuex'
import { getSocialAccountPushCount } from "@/api/pusher"
import SocialSign from './components/SocialSignin'
import { handleAuthResult } from '@/utils/auth'

export default {
  name: 'MyAccounts',
  components: { SocialSign },
  // components: { Pagination },
  data() {
    return {
      tableKey: 0,
      showDialog: false,
      listLoading: false,
      listQuery: {
        type: '',
        keyword: '',
      },
      pushCounts: {}
    }
  },
  mounted(){
    getSocialAccountPushCount(this.filteredOauthUsers.map(t=>t.id)).then(res => {
      this.pushCounts = res.data
    })
  },
  computed: {
    ...mapGetters([
      'oauthUsers'
    ]),
    filteredOauthUsers() {
      alert(123);
      this.tableKey = Math.random();
      var users = this.oauthUsers.filter( u=> u.admin);
      if(this.listQuery.keyword) {
        return users.filter(u => u.nick && u.nick.indexOf(this.listQuery.keyword) > -1 && u.oauthType != 'PODCAST')
      }
      if (this.listQuery.type) {
        return users.filter(u => u.oauthType === this.listQuery.type.toUpperCase())
      } else {
        return users.filter(u => u.oauthType != 'PODCAST')
      }
    }
  },
  methods: {
    handleFilter(type) {
      this.listQuery.type = type
    },
    // searchByKeyword(){
      
    // },
    handleDelete(row) {
      this.$confirm('确定要解除该帐号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store
            .dispatch('oauth/unbind', row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '解除成功!',
                type: 'success',
                duration: 2000
              })
            })
            .catch((res) => {
              this.$alert(res.msg, '错误', {
                type: "error",
                confirmButtonText: '确定'
              })
            })
        })
        .catch(() => {

        })
    }
  },
  created() {
    var self = this
    window.handleAuthResult = function(id) {
      handleAuthResult(id,self)
    }
  },
  filters: {
    transState(value) {
      return !value?'已授权':'未授权'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import "./index.scss";
</style>

