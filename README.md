# 题库管理后台

Web 前端技术课程作业　张子炀　2323040304

## 功能

- 题目管理：按题干关键词搜索，表格分页展示；可以查看题目的四个选项、添加题目、删除题目
- 用户管理：按用户名或登录账号搜索，表格分页展示；可以添加用户、删除用户

## 技术

Vue 3、Vite、Element Plus、vue-router

## 目录

```
src/
├── main.js                    入口文件
├── App.vue                    根组件
├── data.js                    题目和用户的初始数据
├── router/index.js            路由配置
├── components/BaseLayout.vue  顶部标题栏 + 左侧菜单
└── views/
    ├── QuestionView.vue       题目管理页
    └── UserView.vue           用户管理页
```

## 运行

```bash
npm install
npm run dev
```

打包用 `npm run build`，产物在 `dist` 目录。

## 说明

数据都写在前端，没有连后端接口，刷新页面后恢复成初始数据。

线上地址：https://quiz-lab-yangon2333s-projects.vercel.app
