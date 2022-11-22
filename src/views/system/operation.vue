<template>
  <el-card>
    <el-form :model="form" :inline="true">
      <el-form-item label="操作用户">
        <el-input v-model="form.operator" placeholder="操作用户" />
      </el-form-item>
      <el-form-item label="请求路径">
        <el-input v-model="form.path" placeholder="请求路径" />
      </el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form>
    <el-table
      :data="data"
      class="top"
    >
      <el-table-column
        prop="operator"
        label="操作用户"
      />
      <el-table-column
        prop="createdAt"
        label="日期"
        width="200px"
      >
        <template v-slot="scope">
          {{ formatTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态码"
      />
      <el-table-column
        prop="ip"
        label="请求IP"
      />
      <el-table-column
        prop="method"
        label="请求方法"
      />
      <el-table-column
        prop="path"
        label="请求路径"
      />
      <el-table-column
        label="请求"
      >
        <template v-slot="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.body"
            placement="top-start"
          >
            <i class="el-icon-view" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="响应"
      >
        <template v-slot="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.resp"
            placement="top-start"
          >
            <i class="el-icon-view" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </el-card>
</template>

<script>
import { formatUtcTime } from '@/utils/timeFormat'
import { findOperationList } from '@/api/system'

export default {
  data() {
    return {
      // form
      form: {
        operator: '',
        path: ''
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
    this.findOperationList()
  },
  methods: {
    formatTime(text) {
      return formatUtcTime(text)
    },
    sizeChangeHandle(val) {
      this.pagination.pageSize = val
      this.findOperationList()
    },
    currentChangeHandle(val) {
      this.pagination.page = val
      this.findOperationList()
    },
    search() {
      this.pagination.page = 1
      this.findOperationList()
    },
    findOperationList() {
      const { operator, path } = this.form
      const { page, pageSize } = this.pagination
      const data = {
        page,
        pageSize,
        operator,
        path
      }
      findOperationList(data).then(r => {
        this.data = r.result.list
        this.pagination.total = r.result.total
      })
    }
  }
}
</script>

<style scoped>
.top {
  margin-bottom: 20px;
}
</style>
