// 页面用的初始数据，直接写在前端，没有接后端接口
export const categories = ['计算机基础', '操作系统', '办公软件', '网络常识']

export const difficulties = ['简单', '中等', '困难']

export const questionList = [
  {
    id: 1,
    stem: '计算机中 1 KB 等于多少字节？',
    category: '计算机基础',
    options: ['100', '1024', '512', '2048'],
    answer: 'B',
    difficulty: '简单'
  },
  {
    id: 2,
    stem: '下列哪个属于操作系统？',
    category: '操作系统',
    options: ['Word', 'Windows', 'Excel', 'Chrome'],
    answer: 'B',
    difficulty: '简单'
  },
  {
    id: 3,
    stem: '二进制数 1101 转换成十进制是多少？',
    category: '计算机基础',
    options: ['11', '12', '13', '14'],
    answer: 'C',
    difficulty: '中等'
  },
  {
    id: 4,
    stem: '电子邮件地址中必须包含的符号是？',
    category: '网络常识',
    options: ['#', '@', '&', '%'],
    answer: 'B',
    difficulty: '简单'
  },
  {
    id: 5,
    stem: '下列哪个不是输入设备？',
    category: '计算机基础',
    options: ['键盘', '鼠标', '显示器', '扫描仪'],
    answer: 'C',
    difficulty: '简单'
  },
  {
    id: 6,
    stem: '一个字节（Byte）由多少位（bit）组成？',
    category: '计算机基础',
    options: ['4', '8', '16', '32'],
    answer: 'B',
    difficulty: '简单'
  },
  {
    id: 7,
    stem: 'Word 中把选中的文字加粗，快捷键是？',
    category: '办公软件',
    options: ['Ctrl + B', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'],
    answer: 'A',
    difficulty: '中等'
  },
  {
    id: 8,
    stem: '显示器属于输出设备。',
    category: '计算机基础',
    options: ['对', '错', '不确定', '以上都不对'],
    answer: 'A',
    difficulty: '中等'
  }
]

export const userList = [
  { id: 1, name: '张子炀', account: 'admin', role: '管理员', email: 'zhangziyang@quiz.cn', date: '2024-03-11' },
  { id: 2, name: '王浩然', account: 'wanghaoran', role: '教师', email: 'wanghaoran@quiz.cn', date: '2024-03-14' },
  { id: 3, name: '李思颖', account: 'lisiying', role: '教师', email: 'lisiying@quiz.cn', date: '2024-03-17' },
  { id: 4, name: '陈子轩', account: 'chenzixuan', role: '学生', email: 'chenzixuan@quiz.cn', date: '2024-03-20' },
  { id: 5, name: '刘雨晴', account: 'liuyuqing', role: '学生', email: 'liuyuqing@quiz.cn', date: '2024-03-23' },
  { id: 6, name: '孙文杰', account: 'sunwenjie', role: '学生', email: 'sunwenjie@quiz.cn', date: '2024-03-27' },
  { id: 7, name: '周若彤', account: 'zhouruotong', role: '学生', email: 'zhouruotong@quiz.cn', date: '2024-04-02' }
]
