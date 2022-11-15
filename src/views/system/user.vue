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
        <el-button type="primary" @click="createUser">确定</el-button>
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
            <el-button slot="reference" type="text">重置密码</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </el-card>
</template>

<script>
import { createUser, deleteUser, findUserList, resetPassword } from '@/api/user'

export default {
  data() {
    return {
      visible: false,
      // form
      form: {
        username: '',
        password: '',
        authorityId: ''
      },
      // table
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.findUserList()
  },
  methods: {
    handleClose(done) {
      done()
    },
    // table
    sizeChangeHandle(val) {
      this.pagination.pageSize = val
      this.findUserList()
    },
    currentChangeHandle(val) {
      this.pagination.page = val
      this.findUserList()
    },
    indexMethod(index) {
      return (this.pagination.page - 1) * this.pagination.pageSize + index + 1
    },
    // crud
    createUser() {
      this.visible = false
      createUser(this.form).then(r => {
        this.$message(r.msg)
        this.findUserList()
      })
    },
    findUserList() {
      const { page, pageSize } = this.pagination
      const data = {
        page,
        pageSize
      }
      findUserList(data).then(r => {
        this.data = r.result.list
        this.pagination.total = r.result.total
      })
    },
    deleteUser(uuid) {
      const data = { uuid }
      deleteUser(data).then(r => {
        this.$message(r.msg)
        this.findUserList()
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
