<template>
  <div class="shell">
    <!-- 左侧深色导航 -->
    <aside class="sidebar" :class="{ 'is-collapsed': collapsed }">
      <div class="brand" @click="$router.push('/dashboard')">
        <div class="brand-logo">
          <el-icon><Notebook /></el-icon>
        </div>
        <div v-show="!collapsed" class="brand-text">
          <strong>QuizLab</strong>
          <span>题库管理后台</span>
        </div>
      </div>

      <el-menu
        :default-active="activePath"
        :collapse="collapsed"
        :collapse-transition="false"
        router
        class="side-menu"
      >
        <el-menu-item
          v-for="item in menus"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>

      <div class="side-foot">
        <div v-show="!collapsed" class="side-foot-card">
          <p class="side-foot-title">{{ APP.course }}</p>
          <p class="side-foot-text">{{ APP.owner.name }} · {{ APP.owner.id }}</p>
        </div>
        <p v-show="collapsed" class="side-foot-mini">Q</p>
      </div>
    </aside>

    <!-- 右侧主区域 -->
    <div class="main">
      <header class="topbar">
        <div class="topbar-left">
          <button class="icon-btn" title="折叠菜单" @click="collapsed = !collapsed">
            <el-icon>
              <Expand v-if="collapsed" />
              <Fold v-else />
            </el-icon>
          </button>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="topbar-right">
          <span class="owner-chip">
            <el-icon><Medal /></el-icon>
            {{ APP.owner.name }}
            <em>{{ APP.owner.id }}</em>
          </span>

          <el-tooltip content="重置为初始演示数据" placement="bottom">
            <button class="icon-btn" @click="handleReset">
              <el-icon><RefreshLeft /></el-icon>
            </button>
          </el-tooltip>

          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-chip">
              <span class="avatar" :style="{ backgroundColor: avatarColor }">
                {{ initials }}
              </span>
              <span class="user-chip-name">{{ displayName }}</span>
              <el-icon class="user-chip-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><UserFilled /></el-icon>账号信息
                </el-dropdown-item>
                <el-dropdown-item command="reset">
                  <el-icon><RefreshLeft /></el-icon>重置演示数据
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <footer class="page-footer">
          {{ APP.course }} · {{ APP.owner.name }} · {{ APP.owner.id }} ·
          {{ APP.version }}
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { APP, initialsOf } from '@/config'
import { resetDb } from '@/store/db'
import { signOut, useSession } from '@/store/session'

const route = useRoute()
const router = useRouter()
const { currentUser, displayName } = useSession()

const collapsed = ref(false)

const menus = [
  { path: '/dashboard', title: '数据概览', icon: 'DataLine' },
  { path: '/questions', title: '题库管理', icon: 'Notebook' },
  { path: '/papers', title: '试卷管理', icon: 'Tickets' },
  { path: '/users', title: '用户管理', icon: 'User' },
]

const activePath = computed(() => {
  const hit = menus.find((item) => route.path.startsWith(item.path))
  return hit ? hit.path : route.path
})

const currentTitle = computed(
  () => (route.meta && route.meta.title) || '数据概览'
)

const initials = computed(() =>
  initialsOf((currentUser.value && currentUser.value.name) || APP.owner.name)
)

const avatarColor = computed(
  () => (currentUser.value && currentUser.value.color) || '#4f74ff'
)

const handleReset = () => {
  ElMessageBox.confirm(
    '将把题目、试卷、用户数据恢复为初始演示内容，确定继续吗？',
    '重置演示数据',
    { type: 'warning', confirmButtonText: '确定重置', cancelButtonText: '取消' }
  )
    .then(() => {
      resetDb()
      ElMessage.success('已恢复初始数据')
    })
    .catch(() => {})
}

const handleCommand = (command) => {
  if (command === 'reset') {
    handleReset()
    return
  }
  if (command === 'profile') {
    const user = currentUser.value || {}
    ElMessageBox.alert(
      `<p><b>姓名：</b>${user.name || APP.owner.name}</p>
       <p><b>账号：</b>${user.account || 'admin'}</p>
       <p><b>角色：</b>${user.role || '管理员'}</p>
       <p><b>学号：</b>${APP.owner.id}</p>`,
      '账号信息',
      { dangerouslyUseHTMLString: true, confirmButtonText: '知道了' }
    ).catch(() => {})
    return
  }
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出当前账号吗？', '退出登录', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    })
      .then(() => {
        signOut()
        router.replace('/login')
        ElMessage.success('已退出登录')
      })
      .catch(() => {})
  }
}
</script>

<style scoped>
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--ql-bg);
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 232px;
  width: 232px;
  padding: 16px 12px 12px;
  background: linear-gradient(185deg, #182144 0%, #131a32 60%, #0f1526 100%);
  transition: width 0.2s ease, flex-basis 0.2s ease;
}

.sidebar.is-collapsed {
  flex-basis: 76px;
  width: 76px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 18px;
  cursor: pointer;
  overflow: hidden;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  color: #fff;
  font-size: 19px;
  background: linear-gradient(135deg, #4f74ff, #9b5cff);
  box-shadow: 0 6px 16px rgba(79, 116, 255, 0.45);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  white-space: nowrap;
}

.brand-text strong {
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.brand-text span {
  color: #7f8bb0;
  font-size: 11px;
}

.side-menu {
  flex: 1;
  border-right: none;
  background: transparent;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #a8b2cf;
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.07);
  --el-menu-active-color: #ffffff;
}

.side-menu:not(.el-menu--collapse) {
  width: 100%;
}

.side-menu :deep(.el-menu-item) {
  height: 44px;
  margin-bottom: 6px;
  border-radius: 10px;
  font-size: 14px;
}

.side-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(79, 116, 255, 0.95), rgba(155, 92, 255, 0.7));
  box-shadow: 0 8px 18px rgba(79, 116, 255, 0.32);
}

.side-menu :deep(.el-menu-item .el-icon) {
  font-size: 17px;
}

.side-foot {
  margin-top: 12px;
}

.side-foot-card {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.07);
  line-height: 1.6;
}

.side-foot-title {
  margin: 0;
  color: #dfe4f4;
  font-size: 12px;
}

.side-foot-text {
  margin: 2px 0 0;
  color: #7f8bb0;
  font-size: 11px;
}

.side-foot-mini {
  margin: 0;
  text-align: center;
  color: #4c5878;
  font-size: 12px;
}

/* 主区域 */
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 62px;
  height: 62px;
  padding: 0 22px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--ql-border);
  z-index: 5;
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--ql-border);
  border-radius: 9px;
  background: #fff;
  color: #56607a;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.16s ease;
}

.icon-btn:hover {
  color: var(--ql-primary);
  border-color: #c7d4ff;
  background: #f5f8ff;
}

.owner-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: #f2f5ff;
  color: #4357a8;
  font-size: 12px;
}

.owner-chip em {
  padding-left: 6px;
  border-left: 1px solid #d8e0ff;
  color: #7a86ab;
  font-style: normal;
  letter-spacing: 0.4px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.16s ease;
  outline: none;
}

.user-chip:hover {
  background: #f2f5ff;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.user-chip-name {
  font-size: 13px;
  color: #333a52;
}

.user-chip-arrow {
  font-size: 12px;
  color: #9aa3bd;
}

.content {
  flex: 1;
  padding: 20px 22px 8px;
  overflow-y: auto;
}

.page-footer {
  padding: 18px 0 10px;
  text-align: center;
  font-size: 12px;
  color: #a9b1c7;
}
</style>
