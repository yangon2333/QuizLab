<template>
  <div class="page">
    <!-- 欢迎区 -->
    <section class="hero">
      <div class="hero-main">
        <p class="hero-kicker">QUIZ ADMIN · {{ todayText }}</p>
        <h2 class="hero-title">你好，{{ displayName }}</h2>
        <p class="hero-desc">
          题库里现在有 <b>{{ stats.questions }}</b> 道题目、
          <b>{{ stats.papers }}</b> 套试卷、<b>{{ stats.users }}</b> 位成员；
          其中 <b>{{ stats.drafts }}</b> 道题目还未发布。
        </p>
        <div class="hero-actions">
          <el-button type="primary" @click="go('/questions')">
            <el-icon><Plus /></el-icon>去录题
          </el-button>
          <el-button plain @click="go('/papers')">
            <el-icon><Tickets /></el-icon>去组卷
          </el-button>
          <el-button plain @click="go('/users')">
            <el-icon><User /></el-icon>管理成员
          </el-button>
        </div>
      </div>
      <div class="hero-ring">
        <el-progress
          type="dashboard"
          :percentage="stats.publishRate"
          :width="132"
          :stroke-width="10"
          color="#ffffff"
        >
          <template #default="{ percentage }">
            <div class="ring-inner">
              <strong>{{ percentage }}%</strong>
              <span>题目发布率</span>
            </div>
          </template>
        </el-progress>
      </div>
    </section>

    <!-- 数据卡片 -->
    <section class="stats">
      <article
        v-for="card in cards"
        :key="card.label"
        class="stat-card"
        :style="{ '--accent': card.color }"
      >
        <div class="stat-icon">
          <el-icon><component :is="card.icon" /></el-icon>
        </div>
        <div class="stat-body">
          <p class="stat-label">{{ card.label }}</p>
          <p class="stat-value">
            {{ card.value }}<small v-if="card.unit">{{ card.unit }}</small>
          </p>
          <p class="stat-hint">{{ card.hint }}</p>
        </div>
      </article>
    </section>

    <!-- 图表区 -->
    <section class="grid-2">
      <div class="panel">
        <div class="panel-head">
          <h3 class="panel-title">难度分布</h3>
          <p class="panel-desc">按题目难度统计</p>
        </div>
        <div class="diff-list">
          <div v-for="row in difficultyRows" :key="row.name" class="diff-row">
            <span class="diff-name">
              <i :style="{ backgroundColor: row.color }"></i>
              {{ row.name }}
            </span>
            <div class="diff-track">
              <div
                class="diff-fill"
                :style="{ width: row.percent + '%', background: row.gradient }"
              ></div>
            </div>
            <span class="diff-count">{{ row.count }} 题</span>
          </div>
        </div>
        <el-divider />
        <div class="diff-note">
          <span class="text-muted">平均正确率</span>
          <strong>{{ stats.accuracy }}%</strong>
          <el-tag
            size="small"
            :type="stats.accuracy >= 70 ? 'success' : 'warning'"
            effect="light"
          >
            {{ stats.accuracy >= 70 ? '整体掌握良好' : '建议补充基础题' }}
          </el-tag>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h3 class="panel-title">分类覆盖</h3>
          <p class="panel-desc">共 {{ CATEGORIES.length }} 个知识标签</p>
        </div>
        <div class="category-list">
          <div v-for="row in categoryRows" :key="row.name" class="category-row">
            <div class="category-head">
              <span>{{ row.name }}</span>
              <span class="text-muted">{{ row.count }} 题</span>
            </div>
            <el-progress
              :percentage="row.percent"
              :stroke-width="8"
              :show-text="false"
              :color="row.color"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 最近更新 + 待办 -->
    <section class="grid-3">
      <div class="panel span-2">
        <div class="panel-head">
          <h3 class="panel-title">最近更新的题目</h3>
          <el-button link type="primary" @click="go('/questions')">
            查看全部
          </el-button>
        </div>
        <el-table :data="recentQuestions" style="width: 100%">
          <el-table-column label="题干" min-width="260">
            <template #default="{ row }">
              <div class="stem-cell">
                <span class="stem-text">{{ row.stem }}</span>
                <span class="stem-meta">
                  {{ row.category }} · {{ typeLabel(row.type) }} ·
                  {{ row.score }} 分
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="难度" width="80" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="difficultyType(row.difficulty)"
                effect="light"
              >
                {{ row.difficulty }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="更新时间" width="120" />
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="row.published ? 'success' : 'info'"
                effect="plain"
              >
                {{ row.published ? '已发布' : '草稿' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h3 class="panel-title">待处理事项</h3>
        </div>
        <ul class="todo-list">
          <li v-for="todo in todos" :key="todo.label" class="todo-item">
            <span class="todo-dot" :style="{ backgroundColor: todo.color }"></span>
            <div class="todo-body">
              <p class="todo-label">{{ todo.label }}</p>
              <p class="todo-hint">{{ todo.hint }}</p>
            </div>
            <span class="todo-count">{{ todo.count }}</span>
          </li>
        </ul>
        <el-divider />
        <div class="owner-box">
          <p class="owner-title">作业信息</p>
          <p class="owner-line">{{ APP.course }}</p>
          <p class="owner-line">{{ APP.owner.name }} · {{ APP.owner.id }}</p>
          <p class="owner-line text-muted">数据仅保存在本地浏览器</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { APP } from '@/config'
import {
  CATEGORIES,
  DIFFICULTIES,
  accuracyOf,
  db,
  typeLabel,
} from '@/store/db'
import { useSession } from '@/store/session'

const router = useRouter()
const { displayName } = useSession()

const go = (path) => router.push(path)

const todayText = computed(() => {
  const now = new Date()
  const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
  return `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} 星期${week}`
})

const stats = computed(() => {
  const questions = db.questions
  const published = questions.filter((item) => item.published).length
  const attempts = questions.reduce((sum, item) => sum + (item.attempts || 0), 0)
  const correct = questions.reduce((sum, item) => sum + (item.correct || 0), 0)
  return {
    questions: questions.length,
    published,
    drafts: questions.length - published,
    papers: db.papers.length,
    users: db.users.length,
    accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
    publishRate: questions.length
      ? Math.round((published / questions.length) * 100)
      : 0,
  }
})

const cards = computed(() => [
  {
    label: '题目总数',
    value: stats.value.questions,
    unit: ' 题',
    hint: `${stats.value.drafts} 道待发布`,
    icon: 'Notebook',
    color: '#4f74ff',
  },
  {
    label: '试卷总数',
    value: stats.value.papers,
    unit: ' 套',
    hint: `${db.papers.filter((item) => item.status === '已发布').length} 套已发布`,
    icon: 'Tickets',
    color: '#9b5cff',
  },
  {
    label: '成员数量',
    value: stats.value.users,
    unit: ' 人',
    hint: `${db.users.filter((item) => item.role === '学员').length} 名学员`,
    icon: 'User',
    color: '#00b894',
  },
  {
    label: '平均正确率',
    value: stats.value.accuracy,
    unit: '%',
    hint: '依据全部答题记录统计',
    icon: 'TrendCharts',
    color: '#e6a23c',
  },
])

const difficultyRows = computed(() => {
  const palette = {
    简单: { color: '#00b894', gradient: 'linear-gradient(90deg,#3ddc97,#00b894)' },
    中等: { color: '#e6a23c', gradient: 'linear-gradient(90deg,#ffc978,#e6a23c)' },
    困难: { color: '#f56c6c', gradient: 'linear-gradient(90deg,#ff9c97,#f56c6c)' },
  }
  const max = Math.max(
    ...DIFFICULTIES.map(
      (level) => db.questions.filter((item) => item.difficulty === level).length
    ),
    1
  )
  return DIFFICULTIES.map((level) => {
    const count = db.questions.filter((item) => item.difficulty === level).length
    return {
      name: level,
      count,
      percent: Math.round((count / max) * 100),
      color: palette[level].color,
      gradient: palette[level].gradient,
    }
  })
})

const categoryRows = computed(() => {
  const colors = ['#4f74ff', '#9b5cff', '#00b894', '#e6a23c', '#f56c6c', '#13c2c2', '#eb6a9a']
  const total = db.questions.length || 1
  return CATEGORIES.map((name, index) => {
    const count = db.questions.filter((item) => item.category === name).length
    return {
      name,
      count,
      percent: Math.round((count / total) * 100),
      color: colors[index % colors.length],
    }
  }).sort((a, b) => b.count - a.count)
})

const recentQuestions = computed(() =>
  [...db.questions]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5)
)

const todos = computed(() => [
  {
    label: '未发布题目',
    hint: '补充答案后即可上线',
    count: stats.value.drafts,
    color: '#e6a23c',
  },
  {
    label: '草稿试卷',
    hint: '组卷完成记得发布',
    count: db.papers.filter((item) => item.status === '草稿').length,
    color: '#4f74ff',
  },
  {
    label: '停用账号',
    hint: '确认是否需要恢复',
    count: db.users.filter((item) => !item.status).length,
    color: '#f56c6c',
  },
  {
    label: '低正确率题目',
    hint: '正确率低于 60% 需要复盘',
    count: db.questions.filter((item) => {
      const acc = accuracyOf(item)
      return acc !== null && acc < 60
    }).length,
    color: '#9b5cff',
  },
])

const difficultyType = (level) =>
  ({ 简单: 'success', 中等: 'warning', 困难: 'danger' }[level] || 'info')
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 26px 30px;
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(110deg, #2a356e 0%, #3c4a94 45%, #5b47a5 100%);
  box-shadow: 0 14px 34px rgba(45, 55, 120, 0.28);
}

.hero-kicker {
  margin: 0 0 10px;
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.62);
}

.hero-title {
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 700;
}

.hero-desc {
  margin: 0 0 20px;
  max-width: 560px;
  font-size: 13.5px;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.78);
}

.hero-desc b {
  color: #fff;
  font-size: 15px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-actions :deep(.el-button--primary) {
  background: #fff;
  border-color: #fff;
  color: #3a4a95;
  font-weight: 600;
}

.hero-actions :deep(.el-button.is-plain) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.32);
  color: #fff;
}

.hero-actions :deep(.el-button.is-plain:hover) {
  background: rgba(255, 255, 255, 0.18);
  border-color: #fff;
  color: #fff;
}

.hero-ring {
  flex: 0 0 auto;
  opacity: 0.95;
}

.ring-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.3;
}

.ring-inner strong {
  color: #fff;
  font-size: 22px;
}

.ring-inner span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
}

.hero-ring :deep(.el-progress__text) {
  color: #fff;
}

.hero-ring :deep(.el-progress-circle__track) {
  stroke: rgba(255, 255, 255, 0.2);
}

/* 数据卡片 */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid var(--ql-border);
  border-radius: var(--ql-radius);
  box-shadow: var(--ql-shadow);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(31, 41, 70, 0.1);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  font-size: 21px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, #fff);
}

.stat-label {
  margin: 0;
  font-size: 12.5px;
  color: var(--ql-muted);
}

.stat-value {
  margin: 2px 0;
  font-size: 24px;
  font-weight: 700;
  color: #202744;
  line-height: 1.2;
}

.stat-value small {
  font-size: 12px;
  font-weight: 500;
  color: var(--ql-muted);
}

.stat-hint {
  margin: 0;
  font-size: 11.5px;
  color: #a3abc2;
}

/* 图表区 */
.grid-2 {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 16px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.span-2 {
  min-width: 0;
}

.diff-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.diff-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.diff-name {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 0 0 58px;
  font-size: 13px;
  color: #4a5470;
}

.diff-name i {
  width: 8px;
  height: 8px;
  border-radius: 3px;
}

.diff-track {
  flex: 1;
  height: 12px;
  border-radius: 8px;
  background: #f0f3fa;
  overflow: hidden;
}

.diff-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.5s ease;
}

.diff-count {
  flex: 0 0 52px;
  text-align: right;
  font-size: 12.5px;
  color: var(--ql-muted);
}

.diff-note {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.diff-note strong {
  font-size: 18px;
  color: #202744;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.category-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12.5px;
  color: #4a5470;
}

/* 待办 */
.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  transition: background 0.16s ease;
}

.todo-item:hover {
  background: #f7f9ff;
}

.todo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: 0 0 8px;
}

.todo-body {
  flex: 1;
  min-width: 0;
}

.todo-label {
  margin: 0;
  font-size: 13px;
  color: #333a52;
}

.todo-hint {
  margin: 2px 0 0;
  font-size: 11.5px;
  color: #a3abc2;
}

.todo-count {
  font-size: 17px;
  font-weight: 700;
  color: #202744;
}

.owner-box {
  padding: 2px 4px;
}

.owner-title {
  margin: 0 0 8px;
  font-size: 12.5px;
  color: var(--ql-muted);
}

.owner-line {
  margin: 4px 0;
  font-size: 12.5px;
  color: #4a5470;
}

@media (max-width: 1180px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }

  .hero-ring {
    display: none;
  }
}
</style>
