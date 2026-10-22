<template>
  <div class="page">
    <!-- 概览条 -->
    <section class="paper-overview">
      <div v-for="item in overview" :key="item.label" class="ov-item">
        <p class="ov-label">{{ item.label }}</p>
        <p class="ov-value">{{ item.value }}<small>{{ item.unit }}</small></p>
      </div>
      <div class="ov-actions">
        <el-input
          v-model="keyword"
          placeholder="搜索试卷名称"
          clearable
          :prefix-icon="Search"
          style="width: 200px"
        />
        <el-button type="primary" :icon="Plus" @click="openCreate">新建试卷</el-button>
      </div>
    </section>

    <!-- 试卷列表 -->
    <section class="panel">
      <div class="panel-head">
        <h3 class="panel-title">试卷列表</h3>
        <p class="panel-desc">共 {{ filtered.length }} 套试卷</p>
      </div>

      <el-table :data="filtered" row-key="id" style="width: 100%">
        <el-table-column label="试卷名称" min-width="260">
          <template #default="{ row }">
            <div class="paper-name">
              <span class="paper-title">{{ row.title }}</span>
              <span class="stem-meta">
                {{ row.category }} · {{ row.creator }} 创建于 {{ row.createdAt }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="题目数" width="96" align="center">
          <template #default="{ row }">{{ row.questionIds.length }} 题</template>
        </el-table-column>
        <el-table-column label="总分" width="86" align="center">
          <template #default="{ row }">
            <span class="score-text">{{ paperScore(row) }}</span> 分
          </template>
        </el-table-column>
        <el-table-column label="时长" width="86" align="center">
          <template #default="{ row }">{{ row.duration }} 分钟</template>
        </el-table-column>
        <el-table-column label="状态" width="96" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="light" :type="statusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="258" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="View" @click="openDetail(row)">预览</el-button>
            <el-button link type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            <el-button link :type="row.status === '已发布' ? 'warning' : 'success'" @click="toggleStatus(row)">
              {{ row.status === '已发布' ? '下线' : '发布' }}
            </el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="还没有试卷，点击右上角新建一套吧" />
        </template>
      </el-table>
    </section>

    <!-- 新建 / 编辑 -->
    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑试卷' : '新建试卷'"
      width="820px"
      top="6vh"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="86px">
        <div class="form-row-2">
          <el-form-item label="试卷名称" prop="title">
            <el-input v-model="form.title" placeholder="例如：Web 前端基础测评卷 A" />
          </el-form-item>
          <el-form-item label="所属分类">
            <el-select v-model="form.category" style="width: 100%">
              <el-option v-for="item in CATEGORIES" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row-3">
          <el-form-item label="考试时长">
            <el-input-number v-model="form.duration" :min="10" :max="180" :step="5" />
            <span class="unit">分钟</span>
          </el-form-item>
          <el-form-item label="试卷状态">
            <el-select v-model="form.status" style="width: 130px">
              <el-option v-for="item in PAPER_STATUSES" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="组卷结果">
            <el-tag type="primary" effect="plain">{{ form.questionIds.length }} 题</el-tag>
            <el-tag type="success" effect="plain" style="margin-left: 6px">
              共 {{ draftScore }} 分
            </el-tag>
          </el-form-item>
        </div>

        <el-form-item label="选择题目">
          <el-transfer
            v-model="form.questionIds"
            :data="transferData"
            :titles="['题库可选题目', '已选入本卷']"
            filterable
            filter-placeholder="搜索题干关键词"
            class="paper-transfer"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="saving" @click="submitForm">
            {{ form.id ? '保存修改' : '创建试卷' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 试卷预览 -->
    <el-dialog v-model="detailVisible" :title="detail ? detail.title : '试卷预览'" width="720px">
      <template v-if="detail">
        <el-descriptions :column="4" border size="small" class="detail-desc">
          <el-descriptions-item label="分类">{{ detail.category }}</el-descriptions-item>
          <el-descriptions-item label="题目数">{{ detail.questionIds.length }} 题</el-descriptions-item>
          <el-descriptions-item label="总分">{{ paperScore(detail) }} 分</el-descriptions-item>
          <el-descriptions-item label="时长">{{ detail.duration }} 分钟</el-descriptions-item>
        </el-descriptions>

        <el-table :data="detailQuestions" style="width: 100%; margin-top: 14px">
          <el-table-column type="index" label="#" width="46" align="center" />
          <el-table-column label="题干" min-width="240">
            <template #default="{ row }">
              <div class="stem-cell">
                <span class="stem-text">{{ row.stem }}</span>
                <span class="stem-meta">{{ row.category }} · {{ typeLabel(row.type) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="答案" width="80" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="success" effect="dark">{{ answerText(row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="difficulty" label="难度" width="76" align="center" />
          <el-table-column label="分值" width="70" align="center">
            <template #default="{ row }">{{ row.score }} 分</template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus, Search, View } from '@element-plus/icons-vue'
import {
  CATEGORIES,
  PAPER_STATUSES,
  answerText,
  db,
  nextId,
  paperScore,
  questionById,
  today,
  typeLabel,
} from '@/store/db'

const keyword = ref('')

const overview = computed(() => [
  { label: '试卷总数', value: db.papers.length, unit: ' 套' },
  { label: '已发布', value: db.papers.filter((p) => p.status === '已发布').length, unit: ' 套' },
  { label: '草稿', value: db.papers.filter((p) => p.status === '草稿').length, unit: ' 套' },
  {
    label: '平均题量',
    value: db.papers.length
      ? Math.round(
          db.papers.reduce((sum, p) => sum + p.questionIds.length, 0) / db.papers.length
        )
      : 0,
    unit: ' 题',
  },
])

const filtered = computed(() => {
  const key = keyword.value.trim()
  if (!key) return db.papers
  return db.papers.filter((item) => item.title.includes(key) || item.category.includes(key))
})

const statusType = (status) =>
  ({ 已发布: 'success', 草稿: 'info', 已下线: 'warning' }[status] || 'info')

/* ---------------- 表单 ---------------- */
const blankForm = () => ({
  id: null,
  title: '',
  category: CATEGORIES[0],
  duration: 45,
  status: '草稿',
  questionIds: [],
})

const dialogVisible = ref(false)
const detailVisible = ref(false)
const saving = ref(false)
const formRef = ref(null)
const form = reactive(blankForm())
const detail = ref(null)

const rules = {
  title: [
    { required: true, message: '请输入试卷名称', trigger: 'blur' },
    { min: 4, message: '名称至少 4 个字', trigger: 'blur' },
  ],
}

const transferData = computed(() =>
  db.questions.map((item) => ({
    key: item.id,
    label: `[${item.category}] ${item.stem.length > 20 ? item.stem.slice(0, 20) + '…' : item.stem}`,
    disabled: false,
  }))
)

const draftScore = computed(() =>
  form.questionIds.reduce((sum, id) => {
    const question = questionById(id)
    return sum + (question ? Number(question.score) : 0)
  }, 0)
)

const detailQuestions = computed(() => {
  if (!detail.value) return []
  return detail.value.questionIds.map((id) => questionById(id)).filter(Boolean)
})

const openCreate = () => {
  Object.assign(form, blankForm())
  dialogVisible.value = true
}

const openEdit = (row) => {
  Object.assign(form, {
    id: row.id,
    title: row.title,
    category: row.category,
    duration: row.duration,
    status: row.status,
    questionIds: [...row.questionIds],
  })
  dialogVisible.value = true
}

const openDetail = (row) => {
  detail.value = row
  detailVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  if (!form.questionIds.length) {
    ElMessage.warning('请至少选择一道题目')
    return
  }

  saving.value = true
  try {
    if (form.id) {
      const target = db.papers.find((item) => item.id === form.id)
      Object.assign(target, {
        title: form.title.trim(),
        category: form.category,
        duration: form.duration,
        status: form.status,
        questionIds: [...form.questionIds],
      })
      ElMessage.success('试卷已更新')
    } else {
      db.papers.push({
        id: nextId(db.papers),
        title: form.title.trim(),
        category: form.category,
        duration: form.duration,
        status: form.status,
        questionIds: [...form.questionIds],
        creator: '张子炀',
        createdAt: today(),
      })
      ElMessage.success('试卷已创建')
    }
    dialogVisible.value = false
  } finally {
    saving.value = false
  }
}

const toggleStatus = (row) => {
  const next = row.status === '已发布' ? '已下线' : '已发布'
  const action = next === '已发布' ? '发布' : '下线'
  ElMessageBox.confirm(`确定${action}试卷「${row.title}」吗？`, `${action}确认`, {
    type: 'warning',
    confirmButtonText: `确定${action}`,
    cancelButtonText: '取消',
  })
    .then(() => {
      row.status = next
      ElMessage.success(`试卷已${action}`)
    })
    .catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除试卷「${row.title}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
  })
    .then(() => {
      const index = db.papers.findIndex((item) => item.id === row.id)
      if (index !== -1) db.papers.splice(index, 1)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>

<style scoped>
.paper-overview {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 16px 22px;
  background: #fff;
  border: 1px solid var(--ql-border);
  border-radius: var(--ql-radius);
  box-shadow: var(--ql-shadow);
}

.ov-item {
  min-width: 92px;
}

.ov-label {
  margin: 0;
  font-size: 12px;
  color: var(--ql-muted);
}

.ov-value {
  margin: 4px 0 0;
  font-size: 21px;
  font-weight: 700;
  color: #202744;
}

.ov-value small {
  font-size: 12px;
  font-weight: 500;
  color: var(--ql-muted);
}

.ov-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.paper-name {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.paper-title {
  font-size: 13.5px;
  color: #232a45;
  font-weight: 500;
}

.score-text {
  font-weight: 600;
  color: #4f74ff;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 14px;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 0 14px;
}

.unit {
  margin-left: 8px;
  font-size: 12px;
  color: var(--ql-muted);
  white-space: nowrap;
}

.paper-transfer {
  width: 100%;
}

.paper-transfer :deep(.el-transfer) {
  flex-wrap: nowrap;
}

.paper-transfer :deep(.el-transfer-panel) {
  width: 292px;
}

.paper-transfer :deep(.el-transfer__buttons) {
  padding: 0 8px;
}

.form-row-3 :deep(.el-form-item__content) {
  flex-wrap: nowrap;
}

.detail-desc {
  margin-bottom: 4px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
