<template>
  <base-layout>
    <el-card shadow="never">
      <el-form :inline="true" class="filter">
        <el-form-item label="角色">
          <el-select v-model="role" placeholder="全部角色" clearable style="width: 120px">
            <el-option v-for="item in roles" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="用户名或登录账号" clearable style="width: 180px" @keyup.enter="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="openAdd">新增用户</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="pageData" border>
        <el-table-column prop="id" label="编号" width="70" align="center"></el-table-column>
        <el-table-column prop="name" label="用户名" width="120"></el-table-column>
        <el-table-column prop="account" label="登录账号" width="140"></el-table-column>
        <el-table-column label="角色" width="100" align="center">
          <template #default="scope">
            <el-tag size="small" :type="tagType(scope.row.role)">{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
        <el-table-column prop="date" label="注册日期" width="130"></el-table-column>
        <el-table-column label="操作" width="90" align="center">
          <template #default="scope">
            <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        background
        layout="total, prev, pager, next"
        :total="filtered.length"
        :page-size="pageSize"
        v-model:current-page="page"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="新增用户" v-model="dialogVisible" width="440px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="登录账号">
          <el-input v-model="form.account" placeholder="不填则自动生成"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="不少于 6 位"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="form.confirm" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 130px">
            <el-option v-for="item in roles" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </base-layout>
</template>

<script>
import BaseLayout from '../components/BaseLayout.vue'
import { userList } from '../data'

export default {
  name: 'UserView',
  components: { BaseLayout },
  data() {
    return {
      roles: ['管理员', '教师', '学生'],
      list: userList.slice(),
      role: '',
      keyword: '',
      page: 1,
      pageSize: 5,
      dialogVisible: false,
      form: { name: '', account: '', password: '', confirm: '', role: '学生' }
    }
  },
  computed: {
    filtered() {
      return this.list.filter((item) => {
        if (this.role && item.role !== this.role) return false
        if (this.keyword) {
          return item.name.indexOf(this.keyword) !== -1 || item.account.indexOf(this.keyword) !== -1
        }
        return true
      })
    },
    pageData() {
      const start = (this.page - 1) * this.pageSize
      return this.filtered.slice(start, start + this.pageSize)
    }
  },
  methods: {
    tagType(role) {
      if (role === '管理员') return 'danger'
      if (role === '教师') return 'warning'
      return 'info'
    },
    search() {
      this.page = 1
    },
    reset() {
      this.role = ''
      this.keyword = ''
      this.page = 1
    },
    openAdd() {
      this.form = { name: '', account: '', password: '', confirm: '', role: '学生' }
      this.dialogVisible = true
    },
    today() {
      const d = new Date()
      const pad = (n) => (n < 10 ? '0' + n : '' + n)
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
    },
    submit() {
      const name = this.form.name.trim()
      if (!name) {
        this.$message.warning('请先填写用户名')
        return
      }
      if (!this.form.password || this.form.password.length < 6) {
        this.$message.warning('密码不能少于 6 位')
        return
      }
      if (this.form.password !== this.form.confirm) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      const ids = this.list.map((item) => item.id)
      const id = Math.max.apply(null, ids.concat(0)) + 1
      this.list.unshift({
        id: id,
        name: name,
        account: this.form.account.trim() || 'user' + id,
        role: this.form.role,
        email: '',
        date: this.today()
      })
      this.dialogVisible = false
      this.page = 1
      this.$message.success('保存成功')
    },
    remove(row) {
      this.$confirm('确定删除用户「' + row.name + '」吗？', '提示', { type: 'warning' })
        .then(() => {
          const index = this.list.indexOf(row)
          if (index !== -1) this.list.splice(index, 1)
          const max = Math.ceil(this.filtered.length / this.pageSize) || 1
          if (this.page > max) this.page = max
          this.$message.success('已删除')
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.filter :deep(.el-form-item) {
  margin-bottom: 12px;
  margin-right: 12px;
}

.pager {
  margin-top: 15px;
  text-align: right;
}
</style>
