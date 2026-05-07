import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Transactions from '../views/Transactions.vue'
import AddTransaction from '../views/AddTransaction.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login',    name: 'login',    component: Login,    meta: { guest: true } },
    { path: '/register', name: 'register', component: Register, meta: { guest: true } },
    { path: '/',         name: 'dashboard',    component: Dashboard,       meta: { requiresAuth: true } },
    { path: '/transactions', name: 'transactions', component: Transactions, meta: { requiresAuth: true } },
    { path: '/add',      name: 'add',      component: AddTransaction,  meta: { requiresAuth: true } }
  ]
})

// 네비게이션 가드
router.beforeEach((to, _from, next) => {
  const user = JSON.parse(localStorage.getItem('auth_user') || 'null')
  const isLoggedIn = !!user

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 로그인이 필요한 페이지 → 로그인 페이지로
    next({ name: 'login' })
  } else if (to.meta.guest && isLoggedIn) {
    // 이미 로그인한 상태에서 로그인/회원가입 접근 → 대시보드로
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
