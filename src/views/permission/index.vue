<template>
  <div class="app-container">
    <el-button type="primary" @click="handleBatchAdd">添加根节点</el-button>
    <p> </p>
    <el-tree ref="tree"  :data="perms" 
        :props="defaultProps" 
        :default-expand-all = "defaultExpandAll"
        node-key="pid" 
        :expand-on-click-node="false"
        class="permission-tree" >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
                <el-button
                    v-if="data.children"
                    type="text"
                    size="mini"
                    @click="() => {handleAdd(node, data)}">
                    添加
                </el-button>
                <el-button v-if="data.children"
                    type="text"
                    size="mini"
                    @click="() => handleDeleteByModel(node, data)">
                    删除
                </el-button>
                <el-button v-if="!data.children"
                    type="text"
                    size="mini"
                    @click="() => handleDelete(node, data)">
                    删除
                </el-button>
            </span>
        </span>
    </el-tree>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'" id="perm-dialog">
      <el-form :model="temp" label-width="70px" label-position="left"
        ref="permForm"
        :rules="permRules"
      >
        <el-form-item label="编号" :required="true" prop="pid">
          <el-input v-model="temp.pid" placeholder="id" >
              <template v-if="temp.pre" slot="prepend">{{ temp.pre }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" :required="true" prop="name">
          <el-input v-model="temp.name" placeholder="名称" />
        </el-form-item>
        <el-form-item label="子项" v-if="dialogType==='batchAdd'" prop="children" >
          <el-checkbox-group v-model="temp.children">
            <el-checkbox v-for="(value,key) in items" :key="key" :label="key">{{ value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger " @click="dialogVisible=false">
          取消
        </el-button>
        <el-button  type="primary" @click="confirmOper">
          确定
        </el-button>
         
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getAllPerms, addPerm, batchAdd, deletePerm, deleteByModel } from '@/api/perms'

const defaultPerm = {
  pid: '',
  name: '',
  pre: '',
  children: []
}

export default {
  data() {
    return {
      items: {
        add: '添加',
        update: '修改',
        list: '查询',
        info: '查看',
        del: '删除',
      },
      permRules: {
        pid: [{ required: true, trigger: ['blur'], validator: (rule, value, callback) => {
                    if (!value  ) {
                        callback(new Error('请输入编号!'))
                    } else if (this.perms.some(p=> p.pid.toLowerCase() === (this.temp.pre  + value).toLowerCase() )) {
                        callback(new Error('已经存在相同的编号，不能重复添加!'))
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
      perms: [],
      temp: {},
      operData: {},
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      defaultExpandAll: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getPerms()
  },
  methods: {
    async getPerms() {
      const res = await getAllPerms()
      this.perms = this.generatePemsTree(res.data)
    },
    
    handleAdd(node,data) {
      node.expanded = true
      this.temp = Object.assign( {}, defaultPerm, { pre:data.pid + ":" })
      this.operData = data
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.permForm.clearValidate()
      })
    },
    handleBatchAdd(data) {
      this.temp = Object.assign( {}, defaultPerm)
      this.temp.children = ['add','update','list','info','del']
      this.operData = data
      this.dialogType = 'batchAdd'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.permForm.clearValidate()
      })
    },
    confirmOper() {
        this.$refs['permForm'].validate((valid) => {
            if (valid) {
                if( this.dialogType === 'batchAdd') {
                    var perms = []
                    var perm = {pid: this.temp.pid, name: this.temp.name}
                    perms.push(perm)
                    if(this.temp.children){
                        this.temp.children.forEach(e => perms.push({pid: perm.pid+":"+e, name: this.items[e]+perm.name}))
                    }
                    this.batchAdd(perms)
                }else{
                    this.addOne({pid: this.temp.pre + this.temp.pid, name: this.temp.name })
                }
            }
        })
      
    },
    addOne(perm){
        addPerm(perm)
        .then(res => {
            var data = res.data
            var operData = this.operData
            if (!operData.children) {
                this.$set(operData, 'children', []);
            }
            this.setLabel(data)
            operData.children.push(data);
            this.dialogVisible = false
            this.$notify({
                title: '操作成功',
                dangerouslyUseHTMLString: true,
                message: `
                    操作成功
                `,
                type: 'success'
            })
        })
    },
    batchAdd(perms){
        batchAdd(perms)
        .then(res => {
            var data = res.data
            this.perms.push( ...this.generatePemsTree(data))
            this.dialogVisible = false
            this.$notify({
                title: '操作成功',
                dangerouslyUseHTMLString: true,
                message: `
                    操作成功
                `,
                type: 'success'
            })
        })
    },
    handleDelete(node,data) {
      var alertMsg = `确定要删除[${data.name}]吗?`
      this.$confirm(alertMsg, 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deletePerm(data.pid)
          const parent = node.parent
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.pid === data.pid);
          children.splice(index, 1);
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    handleDeleteByModel(node,data) {
      node.expanded = true
      var alertMsg = `确定要删除[${data.name}]吗?这会同时删除其所有子项！！`
      this.$confirm(alertMsg, 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteByModel(data.pid)
          const parent = node.parent
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.pid === data.pid);
          children.splice(index, 1);
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generatePemsTree(data) {
        if(!data || data.size<1) {
            return [];
        }
        data.forEach(this.setLabel)
        var temp = data.filter(p => p.pid.indexOf(":") === -1)
        temp.forEach(t => {
            t.children = data.filter(p => p.pid.length>t.pid.length && p.pid.indexOf(t.pid+":")===0)
        })
        return temp
    },
    setLabel(perm) {
        perm.label = perm.name + "(" + perm.pid + ")"
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>

