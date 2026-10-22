<template>
  <div class="page">
    <!-- 筛选区 -->
    <section class="panel filter-panel">
      <el-form :inline="true" :model="filters" @submit.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索题干内容，回车查询"
            clearable
            style="width: 230px"
            :prefix-icon="Search"
            @keyup.enter="applyFilters"
            @clear="resetFilters"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="全部分类" clearable style="width: 150px">
            <el-option v-for="item in CATEGORIES" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="filters.difficulty" placeholder="全部难度" clearable style="width: 130px">
            <el-option v-for="item in DIFFICULTIES" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select v-model="filters.type" placeholder="全部题型" clearable style="width: 130px">
            <el-option v-for="item in QUESTION_TYPES" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="applyFilters">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 列表区 -->
    <section class="panel">
      <div class="panel-head">
        <div class="head-left">
          <h3 class="panel-title">题目列表</h3>
          <el-tag size="small" effect="plain" round>共 {{ filtered.length }} 条</el-tag>
          <el-tag v-if="selected.length" size="small" type="warning" effect="light" round>
            已选 {{ selected.length }} 条
          </el-tag>
        </div>
        <div class="head-right">
          <el-button
            type="danger"
            plain
            :icon="Delete"
            :disabled="!selected.length"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <el-button type="primary" :icon="Plus" @click="openCreate">新增题目</el-button>
        </div>
      </div>

      <el-table
        :data="pageRows"
        row-key="id"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="46" reserve-selection />
        <el-table-column label="题干" min-width="300">
          <template #default="{ row }">
            <div class="stem-cell">
              <span class="stem-text">{{ row.stem }}</span>
              <span class="stem-meta">
                #{{ row.id }} · {{ row.creator }} 更新于 {{ row.updatedAt }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" round>{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="题型" width="92" align="center">
          <template #default="{ row }">
            <span class="type-text">{{ typeLabel(row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="82" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="light" :type="difficultyType(row.difficulty)">
              {{ row.difficulty }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="答案" width="104" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="success" effect="dark">{{ answerText(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="正确率" width="140">
          <template #default="{ row }">
            <div v-if="accuracyOf(row) !== null" class="acc-cell">
              <el-progress
                :percentage="accuracyOf(row)"
                :stroke-width="7"
                :color="accuracyColor(accuracyOf(row))"
                :show-text="false"
              />
              <span class="acc-text">{{ accuracyOf(row) }}%</span>
            </div>
            <span v-else class="text-muted">暂无作答</span>
          </template>
        </el-table-column>
        <el-table-column label="发布" width="76" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.published" size="small" @change="handlePublish(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="164" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="没有匹配的题目，换个关键词试试" />
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

    <!-- 新增 / 编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="form.id ? '编辑题目' : '新增题目'"
      size="620px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="88px">
        <el-form-item label="题干" prop="stem">
          <el-input
            v-model="form.stem"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入题干，建议一句话内说清楚问题"
          />
        </el-form-item>

        <div class="form-row-2">
          <el-form-item label="分类" prop="category">
            <el-select v-model="form.category" style="width: 100%">
              <el-option v-for="item in CATEGORIES" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="题型">
            <el-select v-model="form.type" style="width: 100%" @change="handleTypeChange">
              <el-option
                v-for="item in QUESTION_TYPES"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row-2">
          <el-form-item label="难度">
            <el-radio-group v-model="form.difficulty">
              <el-radio-button v-for="item in DIFFICULTIES" :key="item" :value="item">
                {{ item }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分值">
            <el-input-number v-model="form.score" :min="1" :max="20" style="width: 120px" />
          </el-form-item>
        </div>

        <template v-if="form.type !== 'judge'">
          <el-form-item label="选项">
            <div class="option-editor">
              <div v-for="(_, index) in form.options" :key="index" class="option-row">
                <span class="option-key">{{ optionKey(index) }}</span>
                <el-input
                  v-model="form.options[index]"
                  :placeholder="`选项 ${optionKey(index)} 的内容`"
                />
                <el-button
                  v-if="form.options.length > 2"
                  link
                  type="danger"
                  :icon="Remove"
                  @click="removeOption(index)"
                />
              </div>
              <el-button
                v-if="form.options.length < 6"
                link
                type="primary"
                :icon="Plus"
                @click="addOption"
              >
                增加一个选项
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="正确答案">
            <el-radio-group v-if="form.type === 'single'" v-model="form.answerLetter">
              <el-radio v-for="(_, index) in form.options" :key="index" :value="optionKey(index)">
                {{ optionKey(index) }}
              </el-radio>
            </el-radio-group>
            <el-checkbox-group v-else v-model="form.answerLetters">
              <el-checkbox v-for="(_, index) in form.options" :key="index" :value="optionKey(index)">
                {{ optionKey(index) }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>

        <el-form-item v-else label="正确答案">
          <el-radio-group v-model="form.answerJudge">
            <el-radio value="对">正确</el-radio>
            <el-radio value="错">错误</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="答案解析">
          <el-input
            v-model="form.explanation"
            type="textarea"
            :rows="2"
            placeholder="可选，便于学员复盘时查看"
          />
        </el-form-item>

        <el-form-item label="立即发布">
          <el-switch v-model="form.published" />
          <span class="form-hint">关闭时保存为草稿，学员不可见</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="saving" @click="submitForm">
            {{ form.id ? '保存修改' : '确认新增' }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Delete,
  Edit,
  Plus,
  RefreshLeft,
  Remove,
  Search,
} from '@element-plus/icons-vue'
import {
  CATEGORIES,
  DIFFICULTIES,
  QUESTION_TYPES,
  accuracyOf,
  answerText,
  db,
  nextId,
  today,
  typeLabel,
} from '@/store/db'

/* ---------------- 筛选 ---------------- */
const filters = reactive({
  keyword: '',
  category: '',
  difficulty: '',
  type: '',
})

const applied = reactive({ ...filters })

const applyFilters = () => {
  Object.assign(applied, filters)
  currentPage.value = 1
}

const resetFilters = () => {
  Object.assign(filters, { keyword: '', category: '', difficulty: '', type: '' })
  applyFilters()
}

/* ---------------- 列表 ---------------- */
const currentPage = ref(1)
const pageSize = ref(8)
const selected = ref([])

const filtered = computed(() => {
  const keyword = applied.keyword.trim().toLowerCase()
  return db.questions
    .filter((row) => {
      if (keyword && !row.stem.toLowerCase().includes(keyword)) return false
      if (applied.category && row.category !== applied.category) return false
      if (applied.difficulty && row.difficulty !== applied.difficulty) return false
      if (applied.type && row.type !== applied.type) return false
      return true
    })
    .sort((a, b) => b.id - a.id)
})

const pageRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch([filtered, pageSize], () => {
  const maxPage = Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

const handleSelectionChange = (rows) => {
  selected.value = rows
}

const difficultyType = (level) =>
  ({ 简单: 'success', 中等: 'warning', 困难: 'danger' }[level] || 'info')

const accuracyColor = (value) => {
  if (value >= 80) return '#00b894'
  if (value >= 60) return '#e6a23c'
  return '#f56c6c'
}

const handlePublish = (row) => {
  ElMessage.success(`「${row.stem.slice(0, 12)}…」已${row.published ? '发布' : '转为草稿'}`)
}

/* ---------------- 表单 ---------------- */
const blankForm = () => ({
  id: null,
  stem: '',
  category: CATEGORIES[0],
  type: 'single',
  difficulty: '简单',
  score: 2,
  options: ['', '', '', ''],
  answerLetter: 'A',
  answerLetters: [],
  answerJudge: '对',
  explanation: '',
  published: true,
})

const formRef = ref(null)
const drawerVisible = ref(false)
const saving = ref(false)
const form = reactive(blankForm())

const rules = {
  stem: [
    { required: true, message: '请输入题干内容', trigger: 'blur' },
    { min: 4, message: '题干至少 4 个字', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
}

const optionKey = (index) => String.fromCharCode(65 + index)

const addOption = () => {
  if (form.options.length < 6) form.options.push('')
}

const removeOption = (index) => {
  form.options.splice(index, 1)
  const keys = form.options.map((_, i) => optionKey(i))
  form.answerLetters = form.answerLetters.filter((key) => keys.includes(key))
  if (!keys.includes(form.answerLetter)) form.answerLetter = keys[0] || ''
}

const handleTypeChange = (type) => {
  if (type === 'judge') {
    form.options = ['对', '错']
  } else if (form.options.length < 2) {
    form.options = ['', '', '', '']
  }
  if (type === 'multiple' && !form.answerLetters.length) {
    form.answerLetters = [form.answerLetter || 'A']
  }
}

const openCreate = () => {
  Object.assign(form, blankForm())
  drawerVisible.value = true
}

const openEdit = (row) => {
  Object.assign(form, {
    id: row.id,
    stem: row.stem,
    category: row.category,
    type: row.type,
    difficulty: row.difficulty,
    score: row.score,
    options: [...row.options],
    answerLetter: row.type === 'single' ? row.answer : 'A',
    answerLetters: row.type === 'multiple' ? row.answer.split('') : [],
    answerJudge: row.type === 'judge' ? row.answer : '对',
    explanation: row.explanation || '',
    published: row.published,
  })
  drawerVisible.value = true
}

const validateForm = () => {
  if (!form.stem.trim()) return '请填写题干内容'
  if (form.stem.trim().length < 4) return '题干至少 4 个字'
  if (!form.category) return '请选择题目分类'
  if (!Number(form.score) || Number(form.score) < 1) return '分值必须大于 0'

  if (form.type === 'judge') {
    if (!form.answerJudge) return '请选择判断题答案'
    return ''
  }

  if (form.options.length < 2) return '至少需要 2 个选项'
  if (form.options.some((text) => !String(text || '').trim())) return '请填写完整的选项内容'

  if (form.type === 'single' && !form.answerLetter) return '请选择正确答案'
  if (form.type === 'multiple' && !form.answerLetters.length) return '请至少勾选一个正确答案'
  return ''
}

const submitForm = async () => {
  const formValid = await formRef.value.validate().catch(() => false)
  if (!formValid) return

  const error = validateForm()
  if (error) {
    ElMessage.warning(error)
    return
  }

  saving.value = true
  try {
    const answer =
      form.type === 'judge'
        ? form.answerJudge
        : form.type === 'single'
          ? form.answerLetter
          : [...form.answerLetters].sort().join('')

    const payload = {
      stem: form.stem.trim(),
      category: form.category,
      type: form.type,
      difficulty: form.difficulty,
      score: Number(form.score),
      options: form.type === 'judge' ? ['对', '错'] : form.options.map((t) => t.trim()),
      answer,
      explanation: form.explanation.trim(),
      published: form.published,
      updatedAt: today(),
    }

    if (form.id) {
      const target = db.questions.find((item) => item.id === form.id)
      Object.assign(target, payload)
      ElMessage.success('题目已更新')
    } else {
      db.questions.push({
        id: nextId(db.questions),
        attempts: 0,
        correct: 0,
        creator: '张子炀',
        ...payload,
      })
      ElMessage.success('题目已新增')
      currentPage.value = 1
    }
    drawerVisible.value = false
  } finally {
    saving.value = false
  }
}

/* ---------------- 删除 ---------------- */
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除题目「${row.stem.slice(0, 20)}」吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
  })
    .then(() => {
      const index = db.questions.findIndex((item) => item.id === row.id)
      if (index !== -1) db.questions.splice(index, 1)
      // 同步清理试卷中的引用，避免出现空题目
      db.papers.forEach((paper) => {
        paper.questionIds = paper.questionIds.filter((id) => id !== row.id)
      })
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

const handleBatchDelete = () => {
  if (!selected.value.length) return
  ElMessageBox.confirm(
    `即将删除所选中的 ${selected.value.length} 道题目，确定继续吗？`,
    '批量删除',
    { type: 'warning', confirmButtonText: '确定删除', cancelButtonText: '取消' }
  )
    .then(() => {
      const ids = selected.value.map((row) => row.id)
      db.questions = db.questions.filter((item) => !ids.includes(item.id))
      db.papers.forEach((paper) => {
        paper.questionIds = paper.questionIds.filter((id) => !ids.includes(id))
      })
      selected.value = []
      ElMessage.success(`已删除 ${ids.length} 道题目`)
    })
    .catch(() => {})
}
</script>

<style scoped>
.filter-panel {
  padding-bottom: 4px;
}

.filter-panel :deep(.el-form-item) {
  margin-bottom: 14px;
}

.head-left,
.head-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-text {
  font-size: 12.5px;
  color: #5a6480;
}

.acc-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.acc-cell :deep(.el-progress) {
  flex: 1;
}

.acc-text {
  width: 34px;
  font-size: 12px;
  color: var(--ql-muted);
  text-align: right;
}

.option-editor {
  width: 100%;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: #eef2ff;
  color: #4f74ff;
  font-size: 12px;
  font-weight: 600;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 12px;
}

.form-hint {
  margin-left: 10px;
  font-size: 12px;
  color: var(--ql-muted);
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
