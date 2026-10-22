/**
 * 全局站点配置：标题、课程信息、作者信息、演示账号。
 * 如需改成自己的姓名 / 学号，只改这一处即可。
 */
export const APP = {
  name: 'QuizLab 题库管理后台',
  short: 'QuizLab',
  subtitle: '题目 · 试卷 · 用户',
  version: 'v1.0.0',
  course: 'Web 前端技术课程作业',
  owner: {
    name: '张子炀',
    id: '2323040304',
  },
  demo: {
    account: 'admin',
    password: '123456',
  },
}

export const initialsOf = (name = '') => name.slice(0, 1) || 'Q'
