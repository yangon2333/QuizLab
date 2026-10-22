import { createRouter, createWebHistory } from 'vue-router'
import { APP } from '@/config'
import { useSession } from '@/store/session'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '数据概览', icon: 'DataLine' },
      },
      {
        path: 'questions',
        name: 'questions',
        component: () => import('@/views/QuestionView.vue'),
        meta: { title: '题库管理', icon: 'Notebook' },
      },
      {
        path: 'papers',
        name: 'papers',
        component: () => import('@/views/PaperView.vue'),
        meta: { title: '试卷管理', icon: 'Tickets' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UserView.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, title: '页面不存在' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const { token } = useSession()

  if (to.meta.public) {
    if (to.name === 'login' && token.value) return { path: '/dashboard' }
    return true
  }

  if (!token.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

router.afterEach((to) => {
  const pageTitle = to.meta && to.meta.title
  document.title = pageTitle ? `${pageTitle} · ${APP.short}` : APP.name
})

export default router
