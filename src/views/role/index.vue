<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole"> 新增 </el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" v-loading="listLoading" border>
      <el-table-column align="center" label="角色id" width="220">
        <template slot-scope="scope">
          {{ scope.row.rid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>listQuery.size"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'" id="role-dialog">
      <el-form :model="role" ref="roleForm" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="编号" prop="rid"  :required="true">
          <el-input v-model="role.rid" placeholder="角色id" />
        </el-form-item>
        <el-form-item label="名称" prop="name"  :required="true">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="role.desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="权限" prop="perms">
          <el-tree 
            ref="tree"
            :check-strictly="checkStrictly" 
            :data="perms"
            :props="defaultProps"
            :default-expand-all = "defaultExpandAll"
            show-checkbox 
            node-key="pid"
            class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmRole">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { getAllPerms } from '@/api/perms'
import Pagination from '@/components/Pagination'

const defaultRole = {
  rid: '',
  name: '',
  desc: '',
  perms: []
}

export default {
  components: { Pagination },
  data() {
    return {
      perms: [],
      role: Object.assign({}, defaultRole),
      rolesList: [],
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
      },
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultExpandAll: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: true
      },
      rules: {
        rid: [{ required: true, trigger: ['blur'], validator: (rule, value, callback) => {
                    if (!value  ) {
                        callback(new Error('请输入编号!'))
                    } else {
                        callback()
                    }
                } 
            }],
        name: [{ required: true, trigger: ['blur'], validator: (rule, value, callback) => {
                    if (!value  ) {
                        callback(new Error('请输入名称!'))
                    } else {
                        callback()
                    }
                }
            }]
      },
    }
  },
  computed: {
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getPerms()
    this.getList()
  },
  methods: {
    async getPerms() {
      const res = await getAllPerms()
      this.perms = this.generatePemsTree(res.data)
    },
    async getList() {
      const res = await getRoles(this.listQuery)
      this.rolesList = res.list
      this.total = res.total
      this.listLoading = false
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs.roleForm.clearValidate()
        this.$refs.tree.setCheckedKeys(this.role.perms)
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除吗?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.rid)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    
    confirmRole() {
        this.$refs['roleForm'].validate((valid) => {
            if (valid) {
                const isEdit = this.dialogType === 'edit'
                const checkedKeys = this.$refs.tree.getCheckedKeys(true)
                this.role.perms = checkedKeys
                if (isEdit) {
                    updateRole(this.role).then( res=> {
                        for (let index = 0; index < this.rolesList.length; index++) {
                            if (this.rolesList[index].rid === this.role.rid) {
                                this.rolesList.splice(index, 1, Object.assign({}, this.role))
                                break
                            }
                        }
                    })
                    
                } else {
                    addRole(this.role)
                    .then(res => {
                        this.role.rid = res.data.rid
                        this.rolesList.push(this.role)
                    })
                }

                const { desc, rid, name } = this.role
                this.dialogVisible = false
                this.$notify({
                    title: '操作成功',
                    dangerouslyUseHTMLString: true,
                    message: `
                        <div>角色Id: ${rid}</div>
                        <div>角色名称: ${name}</div>
                        <div>描述: ${desc}</div>
                    `,
                    type: 'success',
                    duration: 3000
                })
            }
        })
    },
    generatePemsTree(data) {

        if(!data || data.size<1) {
            return [];
        }
        var temp = data.filter(p => p.pid.indexOf(":") === -1)
        console.log(temp)
        temp.forEach(t => {
            t.children = data.filter(p => p.pid.length>t.pid.length && p.pid.indexOf(t.pid)===0)
        })
        return temp
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
  
}
.el-dialog__wrapper ::v-deep .el-dialog__body {
  padding-bottom: 20px;
}
</style>
