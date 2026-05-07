<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <!-- 인증 페이지(로그인/회원가입)에서는 사이드바 없이 풀스크린 -->
  <RouterView v-if="!auth.isLoggedIn" />

  <!-- 로그인 상태: 사이드바 + 메인 레이아웃 -->
  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <i class="fa-solid fa-wallet brand-icon"></i>
        <div>
          <div class="brand-title">MoneyBook</div>
          <div class="brand-sub">Smart Ledger</div>
        </div>
      </div>

      <nav class="nav flex-column gap-1">
        <RouterLink to="/" class="nav-link" active-class="active" exact-active-class="active">
          <i class="fa-solid fa-chart-pie"></i>
          <span>대시보드</span>
        </RouterLink>
        <RouterLink to="/transactions" class="nav-link" active-class="active">
          <i class="fa-solid fa-list-ul"></i>
          <span>거래 내역</span>
        </RouterLink>
        <RouterLink to="/add" class="nav-link" active-class="active">
          <i class="fa-solid fa-plus-circle"></i>
          <span>거래 추가</span>
        </RouterLink>
      </nav>

      <!-- 사용자 정보 + 로그아웃 -->
      <div class="sidebar-user">
        <div class="user-avatar">
          {{ auth.userName.charAt(0) }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ auth.userName }}</div>
          <div class="user-email">{{ auth.user?.email }}</div>
        </div>
        <button class="logout-btn" @click="handleLogout" title="로그아웃">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      <div class="sidebar-footer">
        <i class="fa-solid fa-circle-info"></i> Vue 3 · Pinia · Bootstrap 5
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* 사용자 정보 영역 */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: .65rem;
  background: rgba(255, 255, 255, .08);
  border-radius: 12px;
  padding: .65rem .75rem;
  margin-top: auto;
  margin-bottom: .75rem;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a5b4fc, #818cf8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: #1e1b4b;
  flex-shrink: 0;
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-size: .85rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-email {
  font-size: .72rem;
  color: rgba(255, 255, 255, .55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.logout-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, .6);
  cursor: pointer;
  padding: .25rem;
  border-radius: 6px;
  transition: color .2s, background .2s;
  flex-shrink: 0;
}
.logout-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, .12);
}

/* 반응형: 모바일에서 사이드바 좁아질 때 */
@media (max-width: 768px) {
  .user-info,
  .sidebar-footer { display: none; }
  .sidebar-user { justify-content: center; padding: .5rem; }
}
</style>
