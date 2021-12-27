<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="用户名"
        style="width: 100px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.nick"
        placeholder="昵称"
        style="width: 100px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.role"
        placeholder="角色"
        clearable
        style="width: 90px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="role in roles" :key="role.rid" :label="role.name" :value="role.rid" />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        placeholder="排序"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="用户名"
        prop="username"
        sortable="custom"
        align="center"
        width="160"
        :class-name="getSortClass('username')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="昵称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nick }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.avatar" />
          <el-button type="primary" size="mini" @click="handleUpdateAvatar(scope.row)" icon="el-icon-edit" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.roles.join(",") }}</template>
      </el-table-column>
      <el-table-column align="center" label="公司">
        <template slot-scope="scope">
          <span>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
       <el-table-column label="注册时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.lock | statusFilter">{{ scope.row.lock ? '锁定':'正常' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}" >
          <template v-if="row.id !== currentUserId">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button v-if="!row.lock" size="mini" @click="handleModifyStatus(row, true)">锁定</el-button>
            <el-button v-if="row.lock" size="mini" type="danger" @click="handleModifyStatus(row, false)">启用</el-button>
          </template>
          <template v-else>
            <span>我自己</span>
          </template>
        </template>
        
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="max-width:500px; margin-left:20px;"
      >
        <el-form-item label="用户名" prop="username" :required="true">
          <el-input v-model="temp.username" placeholder="用户名" :disabled="!isAdd" :required="isAdd" />
        </el-form-item>
        <el-form-item label="昵称" prop="nick" :required="true">
          <el-input v-model="temp.nick" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname" :required="false">
          <el-input v-model="temp.realname" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="isAdd" >
          <el-input v-model="temp.password" :placeholder="isAdd?'密码':'如不修改请留空'" :type="passwordType" @focus="setPasswordType" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" :required="isAdd" v-if="isAdd || temp.password">
          <el-input v-model="temp.confirmPassword" placeholder="昵称" :type="passwordType" @focus="setPasswordType"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" placeholder="电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="temp.company" placeholder="公司" />
        </el-form-item>
        <el-form-item label="角色" prop="roles" :required="true">
          <el-checkbox-group v-model="temp.roles" >
            <el-checkbox v-for="role in roles " :key="role.rid" :label="role.rid">{{ role.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" prop="lock" :required="true" >
          <el-radio-group v-model="temp.lock">
            <el-radio :label="false"> 启用 </el-radio>
            <el-radio :label="true"> 锁定 </el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="max-width:500px">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

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
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import {format} from "@/utils/formDate"
import {
  searchUsers,
  createUser,
  updateUser,
  updateStatus,
  updateAvatar
} from '@/api/userManage'

import { getAllRoles } from '@/api/role'
import valid from '@/utils/user-valid'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const tempUser = {
  roles: [],
  lock: false
}
export default {
  name: 'UserManage',
  components: { Pagination, myUpload},
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: '成功',
        true: '失败'
      }
      return statusMap[status]
    },
    formatDate(val) {
      return format(val,"yyyy-MM-dd hh:mm:ss")
    }
  },
  data() {
    return {
      currentUserId: this.$store.getters.id,
      passwordType: 'text',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        // title: undefined,
        // type: undefined,
        sort: '',
        role: ''
      },
      sortOptions: [
        { label: '用户名', key: '+username' },
        { label: '用户名倒序', key: '-username' }
      ],
      statusOptions: ['true', 'false'],
      temp: tempUser,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        ...valid.userInfoRules,
        username: [ { required: true, trigger: ['blur','change'], validator: valid.validateUsername } ],
        password: [ { required: true, trigger: ['blur','change'], validator: valid.validatePassword } ],
        confirmPassword: [
          { required: true, trigger: ['blur','change'], validator: (rule, value, callback) => {
              if (!value || value !== this.temp.password ) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            } 
          }
        ],
        roles: [ 
          { trigger: [ 'blur', 'change'], validator:  (rule, value, callback) => {
              if (!value || value.size === 0) {
                callback(new Error('请至少选择一个角色!'))
              } else {
                callback()
              }
            } 
          }],
        lock: []
      },
      roles: [],
      downloadLoading: false,

      //avatar relation
      uploadUrl: `${process.env.VUE_APP_BASE_API}/resource/avatar`,
      show: false,
      currentRow: ''
    }
  },
  computed: {
    isAdd() {
      return this.dialogStatus === "create"
    },
  },
  
  created() {
    this.getRoles()
    this.getList()
  },
  methods: {
    setPasswordType() { 
      this.passwordType = 'password'
    },
    clearPasswordType() {
      this.passwordType = 'text'
    },
    getRoles() {
      getAllRoles().then((res) => {
        this.roles = res.data
      })
    },
    getList() {
      this.listLoading = true
      searchUsers(this.listQuery).then((response) => {
        this.list = response.list
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
      .catch(msg=>{
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'username') {
        this.sortByName(order)
      }
    },
    sortByName(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+username'
      } else {
        this.listQuery.sort = '-username'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = tempUser
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.rules.password[0].required = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then((res) => {
            this.list.unshift(res.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.rules.password[0].required = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then((res) => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, res.data)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleModifyStatus(row, status) {
      updateStatus( { id:row.id, status } )
      .then(res => {
          this.$message({
            message: "操作成功",
            type: "success",
          })
          row.lock = status
      })
    },
    // handleDelete(row) {
    //   this.$notify({
    //     title: '成功',
    //     message: '删除成功',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   const index = this.list.indexOf(row)
    //   this.list.splice(index, 1)
    // },

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    handleUpdateAvatar(row) {
        this.show = true
        this.currentRow = row
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
        updateAvatar({ id: this.currentRow.id, avatar: jsonData.url })
        .then(d => {
          this.currentRow.avatar = jsonData.url
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
.el-button--mini.is-circle {
    display: none;
    padding: 3px;
    position: absolute;
    bottom: 0;
    right: 0;
}
.cell:hover .el-button--mini.is-circle {
    display: inline;
  }
.el-dialog__wrapper ::v-deep .el-dialog__body {
  padding: 1em 1em
}  
</style>