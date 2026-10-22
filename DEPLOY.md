# 部署说明（Vercel）

项目已经构建成功，`dist/` 里是可直接发布的产物。下面三种方式任选一种，**方式一最快**。

---

## 方式一：网页端拖拽上传（不需要 Git，最省事）

1. 打开 <https://vercel.com/new>，登录你的账号；
2. 页面上的 **Deploy** 区域支持「拖拽整个项目文件夹」上传（有的账号显示为 *Drag and drop your project folder*）；
3. 把 `w5\quizlab-admin` 这个文件夹整体拖进去（`.gitignore` 已经排除 `node_modules`、`dist`，不用担心体积）；
4. 框架会被识别为 **Vite**，保持默认配置即可：
   - Build Command：`npm run build`
   - Output Directory：`dist`
5. 点击 **Deploy**，等 1 分钟左右拿到形如 `https://quizlab-admin-xxxx.vercel.app` 的地址。

> 说明：仓库里的 `vercel.json` 已写好 SPA 路由重写（所有路径回退到 `index.html`）和静态资源缓存头，
> 所以直接访问 `https://你的域名/questions` 也不会 404。

---

## 方式二：先推到 GitHub，再在 Vercel 导入（推荐，方便以后改）

```bash
cd "F:\大三上\web开发\w5\quizlab-admin"
git init
git add .
git commit -m "feat: QuizLab 题库管理后台"
git branch -M main
git remote add origin https://github.com/你的用户名/quizlab-admin.git
git push -u origin main
```

然后在 <https://vercel.com/new> 里选择这个仓库 → 直接 Deploy（配置会从 `vercel.json` 与 `package.json` 自动读取）。

---

## 方式三：命令行部署

```bash
cd "F:\大三上\web开发\w5\quizlab-admin"
npx vercel login          # 浏览器授权一次
npx vercel --prod         # 首次会问项目名、目录，直接回车即可
```

命令执行完最后一行会打印 Production 地址，把它交上去就行。

---

## 部署完成后自检清单

| 检查项 | 期望结果 |
| ---- | ---- |
| 打开首页 | 自动跳到 `/login` 登录页 |
| 用 `admin` / `123456` 登录 | 进入数据概览页，统计卡有数字 |
| 直接刷新 `/questions` | 页面正常，不出现 404 |
| 题库页点「新增题目」 | 右侧抽屉打开，题型切换后选项联动 |
| 试卷页点「新建试卷」 | 穿梭框可选题目，题数/总分实时变化 |
| 页面底部 | 显示 `张子炀 · 2323040304` |

## 需要改信息时

姓名、学号、演示账号、课程名称全部集中在 `src/config.js`，改完重新构建即可：

```js
export const APP = {
  course: 'Web 前端技术课程作业',
  owner: { name: '张子炀', id: '2323040304' },
  demo: { account: 'admin', password: '123456' },
}
```

## 本地预览（不部署也能演示）

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产物在 dist/
npm run preview    # 本地跑构建产物
```
