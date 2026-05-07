<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const validationError = ref('')

const passwordStrength = computed(() => {
  const pw = password.value
  if (!pw) return {}
  if (pw.length < 6) return { cls: 'weak', width: '33%', label: '약함', textCls: 'text-danger' }
  if (pw.length < 10 || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) {
    return { cls: 'medium', width: '66%', label: '보통', textCls: 'text-warning' }
  }
  return { cls: 'strong', width: '100%', label: '강함', textCls: 'text-success' }
})

const clearErrors = () => {
  validationError.value = ''
  auth.clearError()
}

const handleRegister = async () => {
  clearErrors()

  if (!name.value.trim()) {
    validationError.value = '이름을 입력해주세요.'
    return
  }
  if (!email.value) {
    validationError.value = '이메일을 입력해주세요.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    validationError.value = '올바른 이메일 형식이 아닙니다.'
    return
  }
  if (password.value.length < 6) {
    validationError.value = '비밀번호는 6자 이상이어야 합니다.'
    return
  }
  if (password.value !== passwordConfirm.value) {
    validationError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  const ok = await auth.register(name.value.trim(), email.value, password.value)
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
      <h2 class="auth-title">회원가입</h2>
      <p class="auth-sub">MoneyBook 계정을 만들어보세요</p>

      <!-- 에러 메시지 -->
      <div v-if="validationError || auth.error" class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ validationError || auth.error }}</span>
      </div>

      <form @submit.prevent="handleRegister" novalidate>
        <!-- 이름 -->
        <div class="mb-3">
          <label class="form-label fw-semibold">이름</label>
          <div class="input-group">
            <span class="input-group-text bg-white">
              <i class="fa-regular fa-user text-muted"></i>
            </span>
            <input
              v-model="name"
              type="text"
              class="form-control"
              placeholder="홍길동"
              autocomplete="name"
              @focus="clearErrors"
            />
          </div>
        </div>

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
              @focus="clearErrors"
            />
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-3">
          <label class="form-label fw-semibold">
            비밀번호
            <span class="text-muted fw-normal" style="font-size:.8rem">(6자 이상)</span>
          </label>
          <div class="input-group">
            <span class="input-group-text bg-white">
              <i class="fa-solid fa-lock text-muted"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="비밀번호 입력"
              autocomplete="new-password"
              @focus="clearErrors"
            />
            <button type="button" class="input-group-text bg-white" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" class="text-muted"></i>
            </button>
          </div>
          <!-- 강도 표시 -->
          <div v-if="password" class="mt-1">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :class="passwordStrength.cls"
                :style="{ width: passwordStrength.width }"
              ></div>
            </div>
            <small :class="passwordStrength.textCls">{{ passwordStrength.label }}</small>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="mb-4">
          <label class="form-label fw-semibold">비밀번호 확인</label>
          <div class="input-group">
            <span class="input-group-text bg-white">
              <i class="fa-solid fa-lock text-muted"></i>
            </span>
            <input
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              class="form-control"
              :class="passwordConfirm ? (passwordConfirm === password ? 'is-valid' : 'is-invalid') : ''"
              placeholder="비밀번호 재입력"
              autocomplete="new-password"
              @focus="clearErrors"
            />
            <button type="button" class="input-group-text bg-white" @click="showPasswordConfirm = !showPasswordConfirm">
              <i :class="showPasswordConfirm ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" class="text-muted"></i>
            </button>
          </div>
          <div v-if="passwordConfirm && passwordConfirm !== password" class="invalid-feedback d-block">
            비밀번호가 일치하지 않습니다.
          </div>
        </div>

        <!-- 가입 버튼 -->
        <button
          type="submit"
          class="btn btn-primary w-100 py-2 mb-3"
          :disabled="auth.loading"
        >
          <span v-if="auth.loading">
            <span class="spinner-border spinner-border-sm me-2"></span>처리 중...
          </span>
          <span v-else>
            <i class="fa-solid fa-user-plus me-2"></i>회원가입
          </span>
        </button>
      </form>

      <div class="divider"><span>또는</span></div>

      <p class="text-center mb-0 mt-3 text-muted" style="font-size:.9rem">
        이미 계정이 있으신가요?
        <RouterLink to="/login" class="auth-link">로그인</RouterLink>
      </p>
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
.input-group-text { border-color: #e5e7eb; }
.form-control { border-color: #e5e7eb; }
.form-control:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, .15);
}
.btn-primary {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  border: none;
  border-radius: 10px;
  font-weight: 600;
}
.btn-primary:hover { background: linear-gradient(135deg, #4338ca, #4f46e5); }
.divider {
  display: flex;
  align-items: center;
  gap: .75rem;
  color: #9ca3af;
  font-size: .85rem;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.auth-link { color: #4f46e5; font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
.strength-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 4px;
  transition: width .3s, background .3s;
}
.strength-fill.weak   { background: #ef4444; }
.strength-fill.medium { background: #f59e0b; }
.strength-fill.strong { background: #10b981; }
</style>
