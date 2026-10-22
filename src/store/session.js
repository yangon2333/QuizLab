import { computed, ref } from 'vue'

const TOKEN_KEY = 'quizlab:token'
const USER_KEY = 'quizlab:user'

const readUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

const token = ref(localStorage.getItem(TOKEN_KEY) || '')
const currentUser = ref(readUser())

export const useSession = () => ({
  token,
  currentUser,
  isLoggedIn: computed(() => Boolean(token.value)),
  displayName: computed(
    () => (currentUser.value && currentUser.value.name) || '访客'
  ),
})

export const signIn = (user) => {
  // 演示环境：用时间戳充当 token，真实项目请替换为后端下发的凭证
  const fakeToken = `quizlab-${Date.now()}`
  token.value = fakeToken
  currentUser.value = {
    id: user.id,
    name: user.name,
    account: user.account,
    role: user.role,
    color: user.color,
  }
  localStorage.setItem(TOKEN_KEY, fakeToken)
  localStorage.setItem(USER_KEY, JSON.stringify(currentUser.value))
}

export const signOut = () => {
  token.value = ''
  currentUser.value = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
