<template>
  <div class="login-page">
    <!-- 左侧品牌介绍 -->
    <section class="brand-side">
      <div class="brand-top">
        <div class="brand-mark">
          <el-icon><Notebook /></el-icon>
        </div>
        <div class="brand-name">
          <strong>QuizLab</strong>
          <span>题库管理后台</span>
        </div>
      </div>

      <div class="brand-copy">
        <h1>把题目、试卷与人<br />放进同一个工作台</h1>
        <p>
          一套面向课程作业的轻量题库管理系统：题目打标分类、可视化组卷、
          成员权限一目了然。
        </p>
        <ul class="brand-list">
          <li>
            <el-icon><Select /></el-icon>支持单选、多选、判断三类题型
          </li>
          <li>
            <el-icon><Select /></el-icon>七类知识标签，难度与正确率同步统计
          </li>
          <li>
            <el-icon><Select /></el-icon>数据保存在浏览器本地，刷新不丢失
          </li>
        </ul>
      </div>

      <div class="brand-foot">
        <span>{{ APP.course }}</span>
        <span>{{ APP.owner.name }} · {{ APP.owner.id }}</span>
      </div>

      <div class="blob blob-a"></div>
      <div class="blob blob-b"></div>
    </section>

    <!-- 右侧登录表单 -->
    <section class="form-side">
      <div class="form-box">
        <p class="form-kicker">QUIZ ADMIN CONSOLE</p>
        <h2>登录后台</h2>
        <p class="form-sub">请使用演示账号进入，或点击下方按钮快速体验。</p>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="登录账号" prop="account">
            <el-input
              v-model="form.account"
              size="large"
              placeholder="请输入账号"
              :prefix-icon="User"
              autocomplete="username"
            />
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              show-password
              placeholder="请输入密码"
              :prefix-icon="Lock"
              autocomplete="current-password"
              @keyup.enter="handleSubmit"
            />
          </el-form-item>

          <div class="form-row">
            <el-checkbox v-model="remember">记住我的账号</el-checkbox>
            <el-button link type="primary" @click="fillDemo">填入演示账号</el-button>
          </div>

          <el-button
            type="primary"
            size="large"
            class="submit-btn"
            :loading="loading"
            @click="handleSubmit"
          >
            登 录
          </el-button>
        </el-form>

        <div class="demo-box">
          <el-icon><InfoFilled /></el-icon>
          <span>
            演示账号：<code>admin</code> / 密码：<code>123456</code>
          </span>
        </div>

        <p class="form-foot">
          {{ APP.course }} · {{ APP.owner.name }} · {{ APP.owner.id }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { APP } from '@/config'
import { db } from '@/store/db'
import { signIn } from '@/store/session'

const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const loading = ref(false)
const remember = ref(true)

const form = reactive({
  account: '',
  password: '',
})

const rules = {
  account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}

const REMEMBER_KEY = 'quizlab:last-account'

onMounted(() => {
  const last = localStorage.getItem(REMEMBER_KEY)
  if (last) form.account = last
})

const fillDemo = () => {
  form.account = APP.demo.account
  form.password = APP.demo.password
  ElMessage.info('已填入演示账号')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const account = form.account.trim()
    const user = db.users.find((item) => item.account === account)

    if (!user) {
      ElMessage.error('账号不存在，请重新输入')
      return
    }
    if (user.password !== form.password) {
      ElMessage.error('密码错误，请重试')
      return
    }
    if (!user.status) {
      ElMessage.warning('该账号已被停用，请联系管理员')
      return
    }

    signIn(user)
    if (remember.value) {
      localStorage.setItem(REMEMBER_KEY, account)
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }

    ElMessage.success(`欢迎回来，${user.name}`)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.replace(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: #fff;
}

/* 左侧品牌栏 */
.brand-side {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 46%;
  max-width: 620px;
  padding: 40px 52px;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(160deg, #1b2350 0%, #232a5c 45%, #131a38 100%);
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  font-size: 22px;
  background: linear-gradient(135deg, #4f74ff, #9b5cff);
  box-shadow: 0 8px 20px rgba(79, 116, 255, 0.45);
}

.brand-name {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.brand-name strong {
  font-size: 17px;
  letter-spacing: 1px;
}

.brand-name span {
  font-size: 11px;
  color: #9aa6c9;
}

.brand-copy {
  z-index: 2;
  margin: 24px 0;
}

.brand-copy h1 {
  margin: 0 0 16px;
  font-size: 34px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.brand-copy p {
  max-width: 390px;
  margin: 0 0 26px;
  color: #adb7d6;
  font-size: 14px;
  line-height: 1.9;
}

.brand-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  color: #ccd4ea;
  font-size: 13.5px;
}

.brand-list .el-icon {
  color: #63e6be;
  font-size: 15px;
}

.brand-foot {
  display: flex;
  justify-content: space-between;
  z-index: 2;
  font-size: 12px;
  color: #7b87ac;
  letter-spacing: 0.3px;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(6px);
  opacity: 0.55;
}

.blob-a {
  top: -110px;
  right: -90px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(79, 116, 255, 0.55), transparent 65%);
}

.blob-b {
  bottom: -140px;
  left: -80px;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, rgba(155, 92, 255, 0.45), transparent 65%);
}

/* 右侧表单 */
.form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 24px;
  background: #fbfcff;
}

.form-box {
  width: 100%;
  max-width: 380px;
}

.form-kicker {
  margin: 0 0 10px;
  font-size: 11px;
  letter-spacing: 2.4px;
  color: #9aa3bf;
}

.form-box h2 {
  margin: 0 0 8px;
  font-size: 26px;
  color: #1b2138;
}

.form-sub {
  margin: 0 0 26px;
  font-size: 13px;
  color: #7b849d;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0 22px;
}

.submit-btn {
  width: 100%;
  letter-spacing: 4px;
  background: linear-gradient(99deg, #4f74ff, #7c5cff);
  border: none;
  box-shadow: 0 10px 22px rgba(79, 116, 255, 0.32);
}

.demo-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 10px 14px;
  border: 1px dashed #c9d4f5;
  border-radius: 10px;
  background: #f4f7ff;
  color: #5b6685;
  font-size: 12.5px;
}

.demo-box .el-icon {
  color: #4f74ff;
}

.demo-box code {
  padding: 1px 6px;
  border-radius: 5px;
  background: #e6ecff;
  color: #3b4f9e;
  font-family: Consolas, Monaco, monospace;
}

.form-foot {
  margin: 28px 0 0;
  text-align: center;
  font-size: 11.5px;
  color: #a7aec3;
}

@media (max-width: 900px) {
  .brand-side {
    display: none;
  }

  .form-side {
    flex: 1;
  }
}
</style>
