<template>
  <div class="page">
    <!-- 筛选 -->
    <section class="panel">
      <el-form :inline="true" :model="filters" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            placeholder="姓名 / 账号 / 邮箱"
            clearable
            style="width: 220px"
            :prefix-icon="Search"
            @keyup.enter="applyFilters"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="filters.role" placeholder="全部角色" clearable style="width: 130px">
            <el-option v-for="item in USER_ROLES" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="正常" value="active" />
            <el-option label="已停用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="applyFilters">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
          <el-button type="success" :icon="Plus" @click="openCreate">新增成员</el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 列表 -->
    <section class="panel">
      <div class="panel-head">
        <div class="head-left">
          <h3 class="panel-title">成员列表</h3>
          <el-tag size="small" effect="plain" round>共 {{ filtered.length }} 人</el-tag>
        </div>
        <p class="panel-desc">管理员可停用账号，停用后无法登录后台</p>
      </div>

      <el-table :data="pageRows" row-key="id" style="width: 100%">
        <el-table-column label="成员" min-width="200">
          <template #default="{ row }">
            <div class="user-cell">
              <span class="avatar" :style="{ backgroundColor: row.color || '#4f74ff' }">
                {{ row.name.slice(0, 1) }}
              </span>
              <div class="user-meta">
                <span class="user-name">{{ row.name }}</span>
                <span class="user-account">@{{ row.account }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="light" :type="roleType(row.role)">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="190" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="joinedAt" label="加入时间" width="120" />
        <el-table-column label="状态" width="96" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" size="small" @change="handleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="164" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="没有找到匹配的成员" />
        </template>
      </el-table>

      <div class="pager">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 8, 10, 20]"
          :total="filtered.length"
          background
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </section>

    <!-- 新增 / 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑成员' : '新增成员'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="86px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="登录账号" prop="account">
          <el-input
            v-model="form.account"
            placeholder="英文或数字，用于登录"
            :disabled="Boolean(form.id)"
          />
        </el-form-item>
        <el-form-item v-if="!form.id" label="初始密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="不少于 6 位" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="form.role">
            <el-radio-button v-for="item in USER_ROLES" :key="item" :value="item">
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="name@example.com" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="选填" />
        </el-form-item>
        <el-form-item label="账号状态">
          <el-switch v-model="form.status" active-text="正常" inactive-text="停用" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="saving" @click="submitForm">
            {{ form.id ? '保存修改' : '确认新增' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus, RefreshLeft, Search } from '@element-plus/icons-vue'
import { USER_ROLES, db, nextId, today } from '@/store/db'

const filters = reactive({ keyword: '', role: '', status: '' })
const applied = reactive({ ...filters })

const currentPage = ref(1)
const pageSize = ref(8)

const applyFilters = () => {
  Object.assign(applied, filters)
  currentPage.value = 1
}

const resetFilters = () => {
  Object.assign(filters, { keyword: '', role: '', status: '' })
  applyFilters()
}

const filtered = computed(() => {
  const key = applied.keyword.trim().toLowerCase()
  return db.users.filter((row) => {
    if (key) {
      const hit = [row.name, row.account, row.email].some((field) =>
        String(field || '').toLowerCase().includes(key)
      )
      if (!hit) return false
    }
    if (applied.role && row.role !== applied.role) return false
    if (applied.status === 'active' && !row.status) return false
    if (applied.status === 'disabled' && row.status) return false
    return true
  })
})

const pageRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch([filtered, pageSize], () => {
  const maxPage = Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

const roleType = (role) => ({ 管理员: 'danger', 教师: 'warning', 学员: 'info' }[role] || 'info')

/* ---------------- 表单 ---------------- */
const blankForm = () => ({
  id: null,
  name: '',
  account: '',
  password: '',
  role: '学员',
  email: '',
  phone: '',
  status: true,
})

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref(null)
const form = reactive(blankForm())

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  account: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
      message: '以字母开头，3-20 位字母、数字或下划线',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        const duplicated = db.users.some(
          (item) => item.account === value && item.id !== form.id
        )
        return duplicated ? callback(new Error('该账号已存在')) : callback()
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请设置初始密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  phone: [{ pattern: /^1\d{10}$/, message: '请输入 11 位手机号', trigger: 'blur' }],
}

const openCreate = () => {
  Object.assign(form, blankForm())
  dialogVisible.value = true
}

const openEdit = (row) => {
  Object.assign(form, {
    id: row.id,
    name: row.name,
    account: row.account,
    password: '',
    role: row.role,
    email: row.email,
    phone: row.phone,
    status: row.status,
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    if (form.id) {
      const target = db.users.find((item) => item.id === form.id)
      Object.assign(target, {
        name: form.name.trim(),
        role: form.role,
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
      })
      ElMessage.success('成员信息已更新')
    } else {
      const colors = ['#4f74ff', '#00b894', '#9b5cff', '#e6a23c', '#f56c6c', '#13c2c2', '#eb6a9a']
      db.users.push({
        id: nextId(db.users),
        name: form.name.trim(),
        account: form.account.trim(),
        password: form.password,
        role: form.role,
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
        joinedAt: today(),
        color: colors[db.users.length % colors.length],
      })
      ElMessage.success('成员已新增')
      currentPage.value = 1
    }
    dialogVisible.value = false
  } finally {
    saving.value = false
  }
}

const handleStatus = (row) => {
  ElMessage.success(`「${row.name}」已${row.status ? '启用' : '停用'}`)
}

const handleDelete = (row) => {
  if (row.account === 'admin') {
    ElMessage.warning('演示账号 admin 不允许删除')
    return
  }
  ElMessageBox.confirm(`确定删除成员「${row.name}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
  })
    .then(() => {
      const index = db.users.findIndex((item) => item.id === row.id)
      if (index !== -1) db.users.splice(index, 1)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>

<style scoped>
.head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.45;
}

.user-name {
  font-size: 13.5px;
  color: #232a45;
  font-weight: 500;
}

.user-account {
  font-size: 12px;
  color: var(--ql-muted);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
