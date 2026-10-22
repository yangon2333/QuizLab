import { reactive, watch } from 'vue'

/* ------------------------------------------------------------------ *
 * 常量定义：分类 / 难度 / 题型 / 角色，页面与表单共用
 * ------------------------------------------------------------------ */
export const CATEGORIES = [
  'HTML/CSS',
  'JavaScript',
  'Vue.js',
  '计算机网络',
  '数据库',
  'Git 与工程化',
  '算法基础',
]

export const DIFFICULTIES = ['简单', '中等', '困难']

export const QUESTION_TYPES = [
  { value: 'single', label: '单选题' },
  { value: 'multiple', label: '多选题' },
  { value: 'judge', label: '判断题' },
]

export const USER_ROLES = ['管理员', '教师', '学员']

export const PAPER_STATUSES = ['已发布', '草稿', '已下线']

export const typeLabel = (value) => {
  const hit = QUESTION_TYPES.find((item) => item.value === value)
  return hit ? hit.label : value
}

/* ------------------------------------------------------------------ *
 * 初始演示数据
 * ------------------------------------------------------------------ */
const seedQuestions = () => [
  {
    id: 1,
    stem: 'HTTP 协议默认使用的端口号是多少？',
    category: '计算机网络',
    type: 'single',
    difficulty: '简单',
    score: 2,
    options: ['21', '80', '443', '8080'],
    answer: 'B',
    attempts: 320,
    correct: 288,
    published: true,
    creator: '张子炀',
    updatedAt: '2024-04-02',
  },
  {
    id: 2,
    stem: 'HTML 中用于定义无序列表的标签是？',
    category: 'HTML/CSS',
    type: 'single',
    difficulty: '简单',
    score: 2,
    options: ['<ol>', '<ul>', '<dl>', '<li>'],
    answer: 'B',
    attempts: 210,
    correct: 186,
    published: true,
    creator: '张子炀',
    updatedAt: '2024-04-02',
  },
  {
    id: 3,
    stem: 'CSS 中用于设置元素内边距的属性是？',
    category: 'HTML/CSS',
    type: 'single',
    difficulty: '简单',
    score: 2,
    options: ['margin', 'padding', 'border', 'outline'],
    answer: 'B',
    attempts: 180,
    correct: 149,
    published: true,
    creator: '李明轩',
    updatedAt: '2024-04-03',
  },
  {
    id: 4,
    stem: '下列选项中，属于 JavaScript 基本数据类型的有？',
    category: 'JavaScript',
    type: 'multiple',
    difficulty: '中等',
    score: 6,
    options: ['string', 'number', 'array', 'boolean'],
    answer: 'ABD',
    attempts: 150,
    correct: 96,
    published: true,
    creator: '张子炀',
    updatedAt: '2024-04-04',
  },
  {
    id: 5,
    stem: 'Vue 3 中用于创建基本类型响应式数据的 API 是？',
    category: 'Vue.js',
    type: 'single',
    difficulty: '中等',
    score: 4,
    options: ['ref', 'reactive', 'computed', 'watch'],
    answer: 'A',
    attempts: 240,
    correct: 201,
    published: true,
    creator: '张子炀',
    updatedAt: '2024-04-05',
  },
  {
    id: 6,
    stem: '以下关于 Vue 组件 props 的说法，正确的有？',
    category: 'Vue.js',
    type: 'multiple',
    difficulty: '困难',
    score: 8,
    options: [
      'props 由父组件传入',
      '子组件可以随意修改 props 的值',
      'props 可以声明类型校验',
      'props 需要在组件中先声明后使用',
    ],
    answer: 'ACD',
    attempts: 120,
    correct: 58,
    published: true,
    creator: '王雨桐',
    updatedAt: '2024-04-06',
  },
  {
    id: 7,
    stem: '数据库事务的 ACID 特性中，“A” 指的是原子性。',
    category: '数据库',
    type: 'judge',
    difficulty: '中等',
    score: 3,
    options: ['对', '错'],
    answer: '对',
    attempts: 96,
    correct: 74,
    published: true,
    creator: '李明轩',
    updatedAt: '2024-04-07',
  },
  {
    id: 8,
    stem: 'SQL 中用于对查询结果去重的关键字是？',
    category: '数据库',
    type: 'single',
    difficulty: '简单',
    score: 2,
    options: ['UNIQUE', 'DISTINCT', 'GROUP', 'FILTER'],
    answer: 'B',
    attempts: 88,
    correct: 70,
    published: true,
    creator: '李明轩',
    updatedAt: '2024-04-07',
  },
  {
    id: 9,
    stem: 'Git 中创建并立即切换到新分支的命令是？',
    category: 'Git 与工程化',
    type: 'single',
    difficulty: '中等',
    score: 3,
    options: ['git branch -d', 'git checkout -b', 'git merge', 'git remote -v'],
    answer: 'B',
    attempts: 130,
    correct: 104,
    published: true,
    creator: '张子炀',
    updatedAt: '2024-04-09',
  },
  {
    id: 10,
    stem: 'HTTP 状态码 404 表示“请求的资源不存在”。',
    category: '计算机网络',
    type: 'judge',
    difficulty: '简单',
    score: 2,
    options: ['对', '错'],
    answer: '对',
    attempts: 260,
    correct: 236,
    published: true,
    creator: '张子炀',
    updatedAt: '2024-04-09',
  },
  {
    id: 11,
    stem: '下列排序算法中，平均时间复杂度为 O(n log n) 的有？',
    category: '算法基础',
    type: 'multiple',
    difficulty: '困难',
    score: 8,
    options: ['快速排序', '冒泡排序', '归并排序', '堆排序'],
    answer: 'ACD',
    attempts: 70,
    correct: 31,
    published: false,
    creator: '王雨桐',
    updatedAt: '2024-04-11',
  },
  {
    id: 12,
    stem: 'CSS Flex 布局中，控制主轴方向的属性是？',
    category: 'HTML/CSS',
    type: 'single',
    difficulty: '中等',
    score: 4,
    options: ['flex-wrap', 'flex-direction', 'justify-content', 'align-items'],
    answer: 'B',
    attempts: 165,
    correct: 132,
    published: true,
    creator: '张子炀',
    updatedAt: '2024-04-12',
  },
]

const seedPapers = () => [
  {
    id: 1,
    title: 'Web 前端基础测评卷 A',
    category: 'HTML/CSS',
    questionIds: [2, 3, 12, 9],
    duration: 45,
    status: '已发布',
    creator: '张子炀',
    createdAt: '2024-04-05',
  },
  {
    id: 2,
    title: 'JavaScript 核心语法专项卷',
    category: 'JavaScript',
    questionIds: [4, 11, 1],
    duration: 60,
    status: '草稿',
    creator: '王雨桐',
    createdAt: '2024-04-08',
  },
  {
    id: 3,
    title: 'Vue 3 组合式 API 提高卷',
    category: 'Vue.js',
    questionIds: [5, 6],
    duration: 30,
    status: '已发布',
    creator: '张子炀',
    createdAt: '2024-04-10',
  },
]

const seedUsers = () => [
  {
    id: 1,
    name: '张子炀',
    account: 'admin',
    password: '123456',
    role: '管理员',
    email: 'xizhentao@quizlab.cn',
    phone: '13800001234',
    status: true,
    joinedAt: '2024-02-18',
    color: '#4f74ff',
  },
  {
    id: 2,
    name: '李明轩',
    account: 'limingxuan',
    password: '123456',
    role: '教师',
    email: 'limingxuan@quizlab.cn',
    phone: '13800002345',
    status: true,
    joinedAt: '2024-03-02',
    color: '#00b894',
  },
  {
    id: 3,
    name: '王雨桐',
    account: 'wangyutong',
    password: '123456',
    role: '教师',
    email: 'wangyutong@quizlab.cn',
    phone: '13800003456',
    status: true,
    joinedAt: '2024-03-06',
    color: '#9b5cff',
  },
  {
    id: 4,
    name: '陈嘉豪',
    account: 'chenjiahao',
    password: '123456',
    role: '学员',
    email: 'chenjiahao@quizlab.cn',
    phone: '13800004567',
    status: true,
    joinedAt: '2024-03-12',
    color: '#e6a23c',
  },
  {
    id: 5,
    name: '赵欣怡',
    account: 'zhaoxinyi',
    password: '123456',
    role: '学员',
    email: 'zhaoxinyi@quizlab.cn',
    phone: '13800005678',
    status: true,
    joinedAt: '2024-03-15',
    color: '#f56c6c',
  },
  {
    id: 6,
    name: '刘思远',
    account: 'liusiyuan',
    password: '123456',
    role: '学员',
    email: 'liusiyuan@quizlab.cn',
    phone: '13800006789',
    status: false,
    joinedAt: '2024-03-21',
    color: '#409eff',
  },
  {
    id: 7,
    name: '周文博',
    account: 'zhouwenbo',
    password: '123456',
    role: '学员',
    email: 'zhouwenbo@quizlab.cn',
    phone: '13800007890',
    status: true,
    joinedAt: '2024-03-28',
    color: '#13c2c2',
  },
  {
    id: 8,
    name: '孙可欣',
    account: 'sunkexin',
    password: '123456',
    role: '学员',
    email: 'sunkexin@quizlab.cn',
    phone: '13800008901',
    status: true,
    joinedAt: '2024-04-01',
    color: '#eb6a9a',
  },
]

/* ------------------------------------------------------------------ *
 * 本地持久化：把后台数据写进 localStorage，刷新不丢
 * ------------------------------------------------------------------ */
const STORAGE_KEY = 'quizlab:data:v1'

const buildSeed = () => ({
  questions: seedQuestions(),
  papers: seedPapers(),
  users: seedUsers(),
})

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const valid =
        parsed &&
        Array.isArray(parsed.questions) &&
        Array.isArray(parsed.papers) &&
        Array.isArray(parsed.users)
      if (valid) return parsed
    }
  } catch (error) {
    console.warn('[quizlab] 本地数据解析失败，已回退到初始数据', error)
  }
  return buildSeed()
}

export const db = reactive(loadState())

watch(
  db,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch (error) {
      console.warn('[quizlab] 本地数据写入失败', error)
    }
  },
  { deep: true }
)

export const resetDb = () => {
  const seed = buildSeed()
  db.questions = seed.questions
  db.papers = seed.papers
  db.users = seed.users
}

/* ------------------------------------------------------------------ *
 * 通用工具
 * ------------------------------------------------------------------ */
export const nextId = (list) =>
  list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1

export const today = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export const accuracyOf = (question) => {
  if (!question.attempts) return null
  return Math.round((question.correct / question.attempts) * 100)
}

export const questionById = (id) => db.questions.find((item) => item.id === id)

export const answerText = (question) => {
  if (question.type === 'judge') return question.answer
  if (question.type === 'multiple') return question.answer.split('').join('、')
  return question.answer
}

export const paperScore = (paper) =>
  paper.questionIds.reduce((sum, id) => {
    const question = questionById(id)
    return sum + (question ? Number(question.score) || 0 : 0)
  }, 0)
