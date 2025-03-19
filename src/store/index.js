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
      state.user = null
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
        const { token, user } = response.data
        
        localStorage.setItem('token', token)
        commit('setUser', user)
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    async logout({ commit }) {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Erro ao fazer logout no servidor:', error)
      } finally {
        commit('clearAllData')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
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

    async fetchUsers({ commit }) {
      try {
        const response = await userService.getAll()
        commit('setUsers', response.data)
        return response.data
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        throw error
      }
    },

    async fetchProfiles({ commit }) {
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
    
    hasPermission: (state) => (permission) => {
      if (!state.user?.profile) return false
      
      // Se for Admin, tem todas as permissões
      if (state.user.profile.name === 'Admin') return true
      
      // Mapeamento de IDs de permissões
      const permissionMap = {
        'downloads': 1,
        'evaluations': 2,
        'errors': 3,
        'newFeatures': 4,
        'users': 5,
        'profiles': 6
      }
      
      const permissionId = permissionMap[permission]
      return state.user.profile.permissions?.some(p => p.id === permissionId) || false
    }
  }
}) 