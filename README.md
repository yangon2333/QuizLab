# 题库管理系统

Web 前端技术课程作业　张子炀　2323040304

## 功能

- 题目管理：顶部按分类分栏（全部 / 计算机基础 / 操作系统 / 办公软件 / 网络常识，带题目数量），可再按难度和题干关键词筛选；表格里选项单独一列显示，正确答案标绿；支持分页、新增题目、删除题目
- 用户管理：可以按角色筛选，按用户名或登录账号搜索；支持分页、新增用户、删除用户

## 技术

Vue 3、Vite、Element Plus、vue-router

## 目录

```
src/
├── main.js                    入口文件
├── App.vue                    根组件
├── data.js                    题目和用户的初始数据
├── router/index.js            路由配置
├── components/BaseLayout.vue  顶部标题栏 + 横向菜单
├── styles/base.css            基础样式
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
