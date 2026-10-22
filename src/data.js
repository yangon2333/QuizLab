// 页面用的初始数据，直接写在前端，没有接后端接口
export const categories = ['HTML/CSS', 'JavaScript', 'Vue', '计算机网络', '数据库']

export const difficulties = ['简单', '中等', '困难']

export const questionList = [
  {
    id: 1,
    stem: 'HTTP 协议默认使用的端口号是多少？',
    category: '计算机网络',
    options: ['21', '80', '443', '8080'],
    answer: 'B',
    difficulty: '简单'
  },
  {
    id: 2,
    stem: 'HTML 中用来定义无序列表的标签是哪一个？',
    category: 'HTML/CSS',
    options: ['<ol>', '<ul>', '<dl>', '<li>'],
    answer: 'B',
    difficulty: '简单'
  },
  {
    id: 3,
    stem: 'CSS 里设置元素内边距的属性是？',
    category: 'HTML/CSS',
    options: ['margin', 'padding', 'border', 'outline'],
    answer: 'B',
    difficulty: '简单'
  },
  {
    id: 4,
    stem: '下面哪个不是 JavaScript 的基本数据类型？',
    category: 'JavaScript',
    options: ['string', 'number', 'array', 'boolean'],
    answer: 'C',
    difficulty: '中等'
  },
  {
    id: 5,
    stem: 'Vue 3 中声明基本类型响应式数据用哪个 API？',
    category: 'Vue',
    options: ['ref', 'reactive', 'computed', 'watch'],
    answer: 'A',
    difficulty: '中等'
  },
  {
    id: 6,
    stem: '数据库事务 ACID 中的 A 指的是原子性。',
    category: '数据库',
    options: ['对', '错', '不确定', '以上都不对'],
    answer: 'A',
    difficulty: '中等'
  },
  {
    id: 7,
    stem: 'Git 中创建并切换到新分支的命令是？',
    category: 'JavaScript',
    options: ['git branch -d', 'git checkout -b', 'git merge', 'git remote -v'],
    answer: 'B',
    difficulty: '中等'
  },
  {
    id: 8,
    stem: 'HTTP 状态码 404 表示请求的资源不存在。',
    category: '计算机网络',
    options: ['对', '错', '不确定', '以上都不对'],
    answer: 'A',
    difficulty: '简单'
  }
]

export const userList = [
  { id: 1, name: '张子炀', account: 'admin', role: '管理员', date: '2024-03-11' },
  { id: 2, name: '李明轩', account: 'limingxuan', role: '普通用户', date: '2024-03-12' },
  { id: 3, name: '王雨桐', account: 'wangyutong', role: '普通用户', date: '2024-03-15' },
  { id: 4, name: '陈嘉豪', account: 'chenjiahao', role: '普通用户', date: '2024-03-18' },
  { id: 5, name: '赵欣怡', account: 'zhaoxinyi', role: '普通用户', date: '2024-03-21' },
  { id: 6, name: '刘思远', account: 'liusiyuan', role: '普通用户', date: '2024-03-25' }
]
