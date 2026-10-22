import { createRouter, createWebHistory } from 'vue-router'
import QuestionView from '../views/QuestionView.vue'
import UserView from '../views/UserView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/question' },
    { path: '/question', component: QuestionView, meta: { title: '题目管理' } },
    { path: '/user', component: UserView, meta: { title: '用户管理' } },
    { path: '/:pathMatch(.*)*', redirect: '/question' }
  ]
})

router.afterEach((to) => {
  document.title = to.meta.title ? to.meta.title + ' - 题库管理后台' : '题库管理后台'
})

export default router
