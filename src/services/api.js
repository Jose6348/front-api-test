import axios from 'axios'

const CLIENT_ID = '9e7ac348-c911-469f-942b-d21d89729e62'
const CLIENT_SECRET = '0KuIhFfs4xHR2iiDkjnxj4c58GYGo0KjeHeCW1wJ'

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  },
  withCredentials: false
})

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// Serviço de autenticação
export const authService = {
  async login(username, password) {
    try {
      const formData = new URLSearchParams()
      formData.append('grant_type', 'password')
      formData.append('client_id', CLIENT_ID)
      formData.append('client_secret', CLIENT_SECRET)
      formData.append('username', username)
      formData.append('password', password)
      formData.append('scope', '')

      // Fazer login e obter token
      const response = await axios.post('/oauth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      })
      
      const { access_token } = response.data
      console.log('Token obtido:', access_token)
      
      // Limpa dados antigos
      localStorage.clear()
      
      // Salva o novo token
      localStorage.setItem('token', access_token)
      
      // Configura o token para todas as próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      try {
        // Tenta buscar dados do usuário usando o token
        const userResponse = await api.get('/api/v1/users')
        console.log('Resposta da listagem de usuários:', userResponse.data)
        
        if (userResponse.data && userResponse.data.data) {
          // Procura o usuário atual na lista pelo ID do token
          const tokenData = JSON.parse(atob(access_token.split('.')[1]))
          const userId = tokenData.sub
          console.log('ID do usuário do token:', userId)
          
          const currentUser = userResponse.data.data.find(user => user.id === parseInt(userId))
          if (currentUser) {
            console.log('Dados do usuário encontrado:', currentUser)
            localStorage.setItem('user', JSON.stringify(currentUser))
          } else {
            console.error('Usuário não encontrado na lista')
          }
        }
      } catch (userError) {
        console.error('Erro ao buscar dados do usuário:', userError)
      }
      
      return response.data
    } catch (error) {
      console.error('Erro completo:', error)
      if (error.response) {
        console.error('Dados do erro:', error.response.data)
        console.error('Status do erro:', error.response.status)
      }
      throw error
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    return Promise.resolve()
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}

// Serviços de usuários
export const userService = {
  getAll: () => api.get('/api/v1/users'),
  create: (userData) => api.post('/api/v1/users', userData),
  update: (id, userData) => api.put(`/api/v1/users/${id}`, userData),
  delete: (id) => api.delete(`/api/v1/users/${id}`),
  showMe: () => api.get('/api/v1/users')
}

// Serviços de perfis
export const profileService = {
  getAll: () => api.get('/api/v1/profiles'),
  create: (profileData) => api.post('/api/v1/profiles', profileData),
  update: (id, profileData) => api.put(`/api/v1/profiles/${id}`, profileData),
  delete: (id) => api.delete(`/api/v1/profiles/${id}`)
}

// Serviços de estatísticas
export const statsService = {
  getDownloads: () => api.get('/api/v1/downloads'),
  getEvaluations: () => api.get('/api/v1/evaluations'),
  getErrors: () => api.get('/api/v1/errors'),
  getFeatures: () => api.get('/api/v1/features')
}

export default api 