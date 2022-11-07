<template>
  <el-card>
    <el-button type="primary" @click="visible = true">新增用户</el-button>
    <el-dialog
      title="新增用户"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="50px">
        <el-form-item label="账户">
          <el-input
            v-model="form.username"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="form.authorityId"
          >
            <el-option
              label="admin"
              value="1"
            />
            <el-option
              label="user"
              value="2"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="data"
      class="top"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
      />
      <el-table-column
        prop="uuid"
        label="UUID"
        width="400px"
      />
      <el-table-column
        prop="username"
        label="用户名"
      />
      <el-table-column
        prop="authority.authorityName"
        label="用户角色"
      />
      <el-table-column
        label="操作"
        width="200px"
      >
        <template v-slot="scope">
          <el-popconfirm
            title="确认要删除吗"
            @onConfirm="deleteUser(scope.row.uuid)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
          <el-popconfirm
            class="cell-button"
            title="确认要重置吗"
            @onConfirm="resetPassword(scope.row.uuid)"
          >
            <el-button slot="reference" type="text">重置</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </el-card>
</template>

<script>
import { addUser, deleteUser, findUserList, resetPassword } from '@/api/system'
import md5 from 'md5'

export default {
  data() {
    return {
      // visible
      visible: false,
      // form
      form: {
        username: '',
        password: '',
        authorityId: ''
      },
      // table
      data: [],
      total: 0,
      page: 1,
      pageSize: 10
    }
  },
  created() {
    this.findList()
  },
  methods: {
    handleClose(done) {
      done()
    },
    sizeChangeHandle(val) {
      this.pageSize = val
      this.findList()
    },
    currentChangeHandle(val) {
      this.page = val
      this.findList()
    },
    indexMethod(index) {
      return (this.page - 1) * this.pageSize + index + 1
    },
    findList() {
      const data = {
        page: this.page,
        pageSize: this.pageSize
      }
      findUserList(data).then(r => {
        this.data = r.result.list
        this.total = r.result.total
      })
    },
    addUser() {
      this.visible = false
      const { username, password, authorityId } = this.form
      const data = {
        username: username,
        password: md5(password),
        authorityId: authorityId
      }
      addUser(data).then(r => {
        this.$message(r.msg)
        this.findList()
      })
    },
    deleteUser(uuid) {
      const data = { uuid }
      deleteUser(data).then(r => {
        this.$message(r.msg)
        this.findList()
      })
    },
    resetPassword(uuid) {
      const data = { uuid }
      resetPassword(data).then(r => {
        this.$message(r.msg)
      })
    }
  }
}
</script>

<style scoped>
.top {
  margin-bottom: 20px;
}
.cell-button {
  margin-left: 10px;
}
</style>
