import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import UserManagement from '../views/UserManagement.vue'
import ProfileManagement from '../views/ProfileManagement.vue'
import StatisticsView from '../views/Statistics.vue'
import SettingsView from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, roles: ['admin', 'hr'] }
  },
  {
    path: '/profiles',
    name: 'ProfileManagement',
    component: ProfileManagement,
    meta: { requiresAuth: true, roles: ['hr'] }
  },
  {
    path: '/statistics',
    name: 'StatisticsView',
    component: StatisticsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/configuracoes',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // You can adjust this based on your auth logic
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 