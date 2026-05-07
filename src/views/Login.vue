<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    auth.error = '이메일과 비밀번호를 입력해주세요.'
    return
  }
  const ok = await auth.login(email.value, password.value)
  if (ok) router.push('/')
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- 로고 -->
      <div class="auth-logo">
        <i class="fa-solid fa-wallet"></i>
      </div>
      <h2 class="auth-title">MoneyBook</h2>
      <p class="auth-sub">스마트 가계부에 로그인하세요</p>

      <!-- 에러 메시지 -->
      <div v-if="auth.error" class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ auth.error }}</span>
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <!-- 이메일 -->
        <div class="mb-3">
          <label class="form-label fw-semibold">이메일</label>
          <div class="input-group">
            <span class="input-group-text bg-white">
              <i class="fa-regular fa-envelope text-muted"></i>
            </span>
            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="example@email.com"
              autocomplete="email"
              @focus="auth.clearError()"
            />
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-4">
          <label class="form-label fw-semibold">비밀번호</label>
          <div class="input-group">
            <span class="input-group-text bg-white">
              <i class="fa-solid fa-lock text-muted"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="비밀번호 입력"
              autocomplete="current-password"
              @focus="auth.clearError()"
            />
            <button
              type="button"
              class="input-group-text bg-white"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" class="text-muted"></i>
            </button>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <button
          type="submit"
          class="btn btn-primary w-100 py-2 mb-3"
          :disabled="auth.loading"
        >
          <span v-if="auth.loading">
            <span class="spinner-border spinner-border-sm me-2"></span>로그인 중...
          </span>
          <span v-else>
            <i class="fa-solid fa-right-to-bracket me-2"></i>로그인
          </span>
        </button>
      </form>

      <div class="divider"><span>또는</span></div>

      <!-- 회원가입 링크 -->
      <p class="text-center mb-0 mt-3 text-muted" style="font-size:.9rem">
        아직 계정이 없으신가요?
        <RouterLink to="/register" class="auth-link">회원가입</RouterLink>
      </p>

      <!-- 데모 계정 안내 -->
      <div class="demo-hint mt-3">
        <i class="fa-solid fa-circle-info me-1"></i>
        데모 계정: <strong>demo@moneybook.com</strong> / <strong>demo1234</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #818cf8 100%);
  padding: 1.5rem;
}
.auth-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}
.auth-logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4f46e5, #818cf8);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.8rem;
  color: #fff;
}
.auth-title {
  text-align: center;
  font-weight: 800;
  font-size: 1.6rem;
  color: #1e1b4b;
  margin-bottom: .25rem;
}
.auth-sub {
  text-align: center;
  color: #6b7280;
  font-size: .9rem;
  margin-bottom: 1.5rem;
}
.input-group-text {
  border-color: #e5e7eb;
}
.form-control {
  border-color: #e5e7eb;
}
.form-control:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, .15);
}
.btn-primary {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: .3px;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #4338ca, #4f46e5);
}
.divider {
  display: flex;
  align-items: center;
  gap: .75rem;
  color: #9ca3af;
  font-size: .85rem;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.auth-link {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}
.auth-link:hover { text-decoration: underline; }
.demo-hint {
  background: #eef2ff;
  border-radius: 8px;
  padding: .6rem .9rem;
  font-size: .8rem;
  color: #4338ca;
  text-align: center;
}
</style>
