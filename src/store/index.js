import { createStore } from 'vuex'
import { authService, userService, profileService, statsService } from '@/services/api'

/* eslint-disable no-useless-catch */
export default createStore({
  state: {
    user: null,
    statistics: {
      downloads: [],
      evaluations: [],
      errors: [],
      newFeatures: []
    },
    users: [],
    profiles: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem('user')
    },
    setStatistics(state, { type, data }) {
      state.statistics[type] = data
    },
    setUsers(state, users) {
      state.users = users
    },
    setProfiles(state, profiles) {
      state.profiles = profiles
    },
    clearAllData(state) {
      state.statistics = {
        downloads: [],
        evaluations: [],
        errors: [],
        newFeatures: []
      }
      state.users = []
      state.profiles = []
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials)
        const { access_token, user } = response.data
        localStorage.setItem('token', access_token)
        commit('setUser', user)
        return user
      } catch (error) {
        console.error('Erro no login:', error)
        throw error
      }
    },
    async logout({ commit }) {
      try {
        // Limpa todos os dados primeiro
        commit('clearAllData')
        commit('clearUser')
        
        // Limpa o localStorage
        localStorage.clear()
        
        // Por fim, chama o serviço de logout
        await authService.logout()
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        // Força a limpeza mesmo em caso de erro
        localStorage.clear()
        throw error
      }
    },
    async fetchStatistics({ commit, state }, type) {
      if (!state.user) return
      
      try {
        let response
        switch (type) {
          case 'downloads':
            response = await statsService.getDownloads()
            break
          case 'evaluations':
            response = await statsService.getEvaluations()
            break
          case 'errors':
            response = await statsService.getErrors()
            break
          case 'newFeatures':
            response = await statsService.getFeatures()
            break
        }
        commit('setStatistics', { type, data: response.data })
        return response.data
      } catch (error) {
        console.error(`Erro ao buscar estatísticas de ${type}:`, error)
        throw error
      }
    },
    async fetchUsers({ commit, state }) {
      if (!state.user) return
      
      try {
        const response = await userService.getAll()
        commit('setUsers', response.data)
        return response.data
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        throw error
      }
    },
    async fetchProfiles({ commit, state }) {
      if (!state.user) return
      
      try {
        const response = await profileService.getAll()
        commit('setProfiles', response.data)
        return response.data
      } catch (error) {
        console.error('Erro ao buscar perfis:', error)
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user && !!localStorage.getItem('token'),
    userRole: state => state.user?.role,
    hasPermission: (state) => (permission) => {
      if (!state.user) return false
      
      const role = state.user.role
      const permissions = {
        admin: ['all'],
        developer: ['downloads', 'evaluations', 'errors', 'newFeatures'],
        hr: ['evaluations', 'users', 'profiles']
      }
      
      return permissions[role]?.includes(permission) || false
    }
  }
}) 