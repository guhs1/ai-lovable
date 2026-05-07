import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from './api'

export const useAuthStore = defineStore('auth', () => {
  // state — localStorage로 새로고침 후에도 유지
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  // getters
  const isLoggedIn = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')

  // actions
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/users', { params: { email, password } })
      if (data.length === 0) {
        error.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
        return false
      }
      const { password: _pw, ...safeUser } = data[0]
      user.value = safeUser
      localStorage.setItem('auth_user', JSON.stringify(safeUser))
      return true
    } catch (e) {
      error.value = '로그인 중 오류가 발생했습니다.'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (name, email, password) => {
    loading.value = true
    error.value = null
    try {
      // 이메일 중복 체크
      const { data: existing } = await api.get('/users', { params: { email } })
      if (existing.length > 0) {
        error.value = '이미 사용 중인 이메일입니다.'
        return false
      }
      // 신규 사용자 저장
      const { data: newUser } = await api.post('/users', { name, email, password })
      const { password: _pw, ...safeUser } = newUser
      user.value = safeUser
      localStorage.setItem('auth_user', JSON.stringify(safeUser))
      return true
    } catch (e) {
      error.value = '회원가입 중 오류가 발생했습니다.'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user, loading, error,
    isLoggedIn, userName,
    login, register, logout, clearError
  }
})
