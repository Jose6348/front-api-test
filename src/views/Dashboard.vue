<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="@/assets/Logo_Convict.png" alt="Logo" class="logo" />
        <div class="painel-title">PAINEL DE DADOS</div>
      </div>
      
      <nav class="nav-menu">
        <div class="nav-top">
          <router-link to="/dashboard" class="nav-item active">
            <img src="@/assets/layout-fluido 1.png" alt="Dashboard" class="nav-icon" />
            Dashboard
          </router-link>
        </div>
        
        <div class="nav-bottom">
          <router-link to="/configuracoes" class="nav-item">
            <img src="@/assets/settings (1) 1.png" alt="Configurações" class="nav-icon" />
            Configurações
          </router-link>
          <a @click="handleLogout" class="nav-item logout" style="cursor: pointer;">
            <img src="@/assets/sign-out-alt 1.png" alt="Sair" class="nav-icon" />
            Sair
          </a>
        </div>
      </nav>
    </aside>

    <main class="main-content">
      <section class="statistics-section">
        <h1>Estatísticas</h1>
        
        <div class="stats-cards">
          <div v-if="hasPermission('downloads')" class="stat-card">
            <div class="stat-header">
              <h3>Downloads</h3>
              <img src="@/assets/cloud-download-alt (1) 1.png" alt="Downloads" class="nav-icon" />
            </div>
            <div class="stat-number">330</div>
            <div class="stat-details">
              <span class="android">
                <img src="@/assets/android 1.png" alt="Android" class="platform-icon" /> 240
              </span>
              <span class="ios">
                <img src="@/assets/apple 1.png" alt="Apple" class="platform-icon" /> 90
              </span>
            </div>
          </div>

          <div v-if="hasPermission('evaluations')" class="stat-card">
            <div class="stat-header">
              <h3>Avaliações</h3>
              <img src="@/assets/star-comment-alt 1.png" alt="Avaliações" class="nav-icon" />
            </div>
            <div class="stat-number">4.2<span class="total">/5</span></div>
            <div class="stat-details">
              <span class="android">
                <img src="@/assets/android 1.png" alt="Android" class="platform-icon" /> 5.0
              </span>
              <span class="ios">
                <img src="@/assets/apple 1.png" alt="Apple" class="platform-icon" /> 4.0
              </span>
            </div>
          </div>

          <div v-if="hasPermission('errors')" class="stat-card">
            <div class="stat-header">
              <h3>Erros</h3>
              <img src="@/assets/times-hexagon (1) 1.png" alt="Erros" class="nav-icon" />
            </div>
            <div class="stat-number">4</div>
            <div class="stat-details">
              <span class="android">
                <img src="@/assets/android 1.png" alt="Android" class="platform-icon" /> 2
              </span>
              <span class="ios">
                <img src="@/assets/apple 1.png" alt="Apple" class="platform-icon" /> 1
              </span>
              <span class="percentage">-5%</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="hasPermission('errors')" class="feedback-section">
        <h2>Feedbacks</h2>
        <table class="feedback-table">
          <thead>
            <tr>
              <th>Avaliação</th>
              <th>Data</th>
              <th>Aval.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aplicativo muito bom, porém poderiam atualizar mensalmente com os dados da qualidade do leite. Quando vira o mês o aplicativo apaga os dados da produção dos meses anteriores, não sendo possível consultar os meses anteriores. Antes não tinha esse problema.</td>
              <td>01/04/24</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Aplicativo muito bom, porém poderiam atualizar mensalmente com os dados da qualidade do leite.</td>
              <td>30/03/24</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="hasPermission('newFeatures')" class="features-section">
        <h2>Novas Funcionalidades</h2>
        <div class="features-list">
          <div class="feature-item">
            <h4>Funcionalidade</h4>
            <p>Veículo Em Rota</p>
          </div>
          <div class="feature-item">
            <h4>Funcionalidade</h4>
            <p>Avaliação De Coleta</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'DashboardView',
  setup() {
    const currentUser = ref(null)
    const router = useRouter()
    const store = useStore()

    const handleLogout = async () => {
      try {
        // Limpar dados do store
        await store.dispatch('logout')
        // Limpar localStorage
        localStorage.clear()
        // Redirecionar para login
        router.replace('/login')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        // Mesmo com erro, limpar dados e redirecionar
        localStorage.clear()
        router.replace('/login')
      }
    }

    const fetchCurrentUser = async () => {
      try {
        console.log('Iniciando fetchCurrentUser')
        // Primeiro tenta pegar do localStorage
        const userFromStorage = localStorage.getItem('user')
        if (userFromStorage) {
          console.log('Usuário encontrado no localStorage:', userFromStorage)
          try {
            currentUser.value = JSON.parse(userFromStorage)
            console.log('Usuário carregado:', currentUser.value)
            return
          } catch (e) {
            console.error('Erro ao fazer parse do usuário do localStorage:', e)
            localStorage.removeItem('user')
          }
        }

        console.log('Buscando usuário da API...')
        const response = await userService.showMe()
        console.log('Resposta da API:', response)
        
        if (response?.data?.data) {
          currentUser.value = response.data.data
          console.log('Salvando usuário no localStorage:', currentUser.value)
          localStorage.setItem('user', JSON.stringify(currentUser.value))
        } else {
          console.error('Resposta da API não contém dados do usuário:', response)
          // Se não tem dados do usuário, remove o token para forçar novo login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        if (error.response) {
          console.error('Status:', error.response.status)
          console.error('Dados:', error.response.data)
        }
        // Se der erro 401 ou 405, remove o token e redireciona para login
        if (error.response?.status === 401 || error.response?.status === 405) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }

    const hasPermission = (permission) => {
      if (!currentUser.value || !currentUser.value.profile) {
        console.log(`Sem permissão ${permission}: usuário não carregado`)
        return false
      }
      
      const profileName = currentUser.value.profile.name
      console.log(`Verificando permissão ${permission} para perfil ${profileName}`)
      
      // Mapeia as permissões por perfil
      const permissionsByProfile = {
        'Admin': ['downloads', 'evaluations', 'errors', 'newFeatures'],
        'Desenvolvedor': ['downloads', 'evaluations', 'errors', 'newFeatures'],
        'Recursos Humanos': ['evaluations']
      }
      
      // Verifica se o perfil existe no mapeamento
      if (!permissionsByProfile[profileName]) {
        console.log(`Perfil ${profileName} não encontrado no mapeamento`)
        return false
      }
      
      // Verifica se o perfil tem a permissão solicitada
      const hasAccess = permissionsByProfile[profileName].includes(permission)
      console.log(`Perfil ${profileName} ${hasAccess ? 'tem' : 'não tem'} permissão ${permission}`)
      return hasAccess
    }

    onMounted(async () => {
      console.log('Dashboard montado, buscando usuário...')
      await fetchCurrentUser()
      
      // Após carregar o usuário, vamos verificar o estado
      const userFromStorage = localStorage.getItem('user')
      console.log('Estado final:')
      console.log('- localStorage:', userFromStorage)
      console.log('- currentUser:', currentUser.value)
    })

    return {
      currentUser,
      hasPermission,
      handleLogout
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  width: 244px;
  background: white;
  padding: 24px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}

.logo {
  width: 80px;
  height: auto;
}

.painel-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px); /* Ajusta a altura considerando o logo */
}

.nav-top {
  flex: 1;
}

.nav-bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-bottom: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item.active {
  background-color: #EEF2FF;
  color: #6366F1;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.logout {
  margin-top: auto;
  color: #000000;
}

.main-content {
  flex: 1;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-left: 284px; /* 244px (largura da sidebar) + 40px de espaço */
}

.statistics-section h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #111827;
}

.stats-cards {
  display: flex;
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  min-width: 280px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-header h3 {
  color: #666;
  font-weight: 500;
}

.stat-number {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 16px;
}

.stat-number .total {
  font-size: 24px;
  color: #666;
}

.stat-details {
  display: flex;
  gap: 24px;
  align-items: center;
  width: 100%;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.platform-icon {
  width: 16px;
  height: 16px;
}

.android, .ios {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.error-icon {
  width: 24px;
  height: 24px;
}

.percentage {
  color: #22C55E;
  margin-left: auto;
}

.feedback-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.feedback-table {
  width: 100%;
  border-collapse: collapse;
}

.feedback-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #666;
}

.feedback-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.features-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item h4 {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.feature-item p {
  font-weight: 500;
}
</style> 