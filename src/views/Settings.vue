<template>
  <div class="settings-container">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="@/assets/Logo_Convict.png" alt="Logo" class="logo" />
        <div class="painel-title">PAINEL DE DADOS</div>
      </div>
      
      <nav class="nav-menu">
        <div class="nav-top">
          <router-link to="/dashboard" class="nav-item">
            <img src="@/assets/layout-fluido 1.png" alt="Dashboard" class="nav-icon" />
            Dashboard
          </router-link>
        </div>
        
        <div class="nav-bottom">
          <router-link to="/configuracoes" class="nav-item active">
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
      <h1>Configurações</h1>

      <!-- Perfis Section -->
      <section class="profiles-section">
        <div class="section-header">
          <h2>Perfis</h2>
          <button class="add-button" @click="showNewProfileModal = true">
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <table class="settings-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantidade De Usuários</th>
              <th>Permissões</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="profile in profiles" :key="profile.id">
              <td>{{ profile.name }}</td>
              <td>{{ getUserCountByProfile(profile.id) }}</td>
              <td>
                <template v-if="profile.name === 'Admin'">
                  <span class="permission-tag all">Tudo</span>
                </template>
                <template v-else>
                  <span v-if="hasPermission(profile, 'downloads')" class="permission-tag">Downloads</span>
                  <span v-if="hasPermission(profile, 'evaluations')" class="permission-tag">Avaliações</span>
                  <span v-if="hasPermission(profile, 'errors')" class="permission-tag">Erros</span>
                  <span v-if="hasPermission(profile, 'feedbacks')" class="permission-tag">Feedbacks</span>
                  <span v-if="hasPermission(profile, 'newFeatures')" class="permission-tag">Novas Funcionalidades</span>
                </template>
              </td>
              <td>
                <button class="action-button" @click="editProfile(profile)">
                  <i class="fas fa-pen-to-square"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Usuários Section -->
      <section class="users-section">
        <div class="section-header">
          <h2>Usuários</h2>
          <button class="add-button" @click="showNewUserModal = true">
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <table class="settings-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.profile?.name || 'N/A' }}</td>
              <td><span class="status-tag active">ATIVO</span></td>
              <td>
                <button class="action-button" @click="editUser(user)">
                  <i class="fas fa-pen-to-square"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- Modal Novo Perfil -->
    <div v-if="showNewProfileModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Novo Perfil</h2>
        
        <div class="form-group">
          <div class="profile-label">Selecione o tipo de perfil</div>
          <div class="profile-options">
            <label class="profile-radio">
              <input 
                type="radio" 
                v-model="newProfile.type" 
                value="Admin"
                name="profile-type"
              >
              <span class="radio-custom"></span>
              <span class="radio-label">Admin (Visualiza tudo)</span>
            </label>

            <label class="profile-radio">
              <input 
                type="radio" 
                v-model="newProfile.type" 
                value="Desenvolvedor"
                name="profile-type"
              >
              <span class="radio-custom"></span>
              <span class="radio-label">Desenvolvedor</span>
            </label>

            <label class="profile-radio">
              <input 
                type="radio" 
                v-model="newProfile.type" 
                value="Recursos Humanos"
                name="profile-type"
              >
              <span class="radio-custom"></span>
              <span class="radio-label">Recursos Humanos</span>
            </label>
          </div>
        </div>

        <div class="permissions-section">
          <div class="permission-label">Permissões do perfil selecionado:</div>
          <div class="permissions-preview">
            <template v-if="newProfile.type === 'Admin'">
              <span class="permission-tag all">Tudo</span>
            </template>
            <template v-else-if="newProfile.type === 'Desenvolvedor'">
              <span class="permission-tag">Downloads</span>
              <span class="permission-tag">Avaliações</span>
              <span class="permission-tag">Erros</span>
              <span class="permission-tag">Novas Funcionalidades</span>
            </template>
            <template v-else-if="newProfile.type === 'Recursos Humanos'">
              <span class="permission-tag">Avaliações</span>
            </template>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" @click="showNewProfileModal = false">
            Voltar
          </button>
          <button class="btn-primary" @click="addNewProfile">
            Adicionar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Novo Usuário -->
    <NewUserModal
      v-model="showNewUserModal"
      :profiles="profiles"
      @submit="handleNewUser"
    />

    <EditUserModal
      v-if="selectedUser"
      v-model="showEditUserModal"
      :user="selectedUser"
      @submit="handleEditUser"
      @delete="handleDeleteUser"
    />

    <!-- Loading state -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <span>Carregando...</span>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import NewUserModal from '@/components/NewUserModal.vue'
import EditUserModal from '../components/EditUserModal.vue'
import { userService, profileService } from '@/services/api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'SettingsView',
  components: {
    NewUserModal,
    EditUserModal
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const showNewProfileModal = ref(false)
    const showNewUserModal = ref(false)
    const showEditUserModal = ref(false)
    const selectedUser = ref(null)
    const loading = ref(false)
    const error = ref(null)
    
    const users = ref([])
    const profiles = ref([])

    const newProfile = reactive({
      type: 'Admin'
    })

    // Carregar dados iniciais
    const fetchData = async () => {
      loading.value = true
      error.value = null
      try {
        const [usersResponse, profilesResponse] = await Promise.all([
          userService.getAll(),
          profileService.getAll()
        ])
        users.value = usersResponse.data.data || []
        profiles.value = profilesResponse.data.data || []
      } catch (err) {
        error.value = 'Erro ao carregar dados. Por favor, tente novamente.'
        console.error('Error fetching data:', err)
      } finally {
        loading.value = false
      }
    }

    // Criar novo usuário
    const handleNewUser = async (userData) => {
      loading.value = true
      error.value = null
      try {
        // Validação dos campos
        if (!userData.name || !userData.name.trim()) {
          throw new Error('O nome é obrigatório')
        }
        if (!userData.email || !userData.email.trim()) {
          throw new Error('O email é obrigatório')
        }
        if (!userData.profile_id) {
          throw new Error('O perfil é obrigatório')
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userData.email.trim())) {
          throw new Error('Email inválido')
        }

        const userRequestData = {
          name: userData.name.trim(),
          email: userData.email.trim().toLowerCase(),
          profile_id: userData.profile_id,
          password: '12345678' // Senha padrão
        }

        console.log('Enviando dados:', userRequestData)
        const response = await userService.create(userRequestData)
        console.log('Resposta do servidor:', response.data)

        if (response.data && response.data.data) {
          // Atualizar a lista de usuários
          const newUser = response.data.data
          users.value = [...users.value, newUser]
          showNewUserModal.value = false
          error.value = null
          
          // Recarregar a lista completa para garantir sincronização
          await fetchData()
        } else {
          throw new Error('Erro ao criar usuário. Por favor, tente novamente.')
        }
      } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Erro ao criar usuário. Por favor, tente novamente.'
        console.error('Error creating user:', err)
      } finally {
        loading.value = false
      }
    }

    // Atualizar usuário
    const handleEditUser = async (userData) => {
      loading.value = true
      error.value = null
      try {
        const response = await userService.update(selectedUser.value.id, userData)
        const index = users.value.findIndex(user => user.id === selectedUser.value.id)
        if (index !== -1) {
          users.value[index] = response.data
        }
        selectedUser.value = null
        showEditUserModal.value = false
      } catch (err) {
        error.value = 'Erro ao atualizar usuário. Por favor, tente novamente.'
        console.error('Error updating user:', err)
      } finally {
        loading.value = false
      }
    }

    // Excluir usuário
    const handleDeleteUser = async (userId) => {
      loading.value = true
      error.value = null
      try {
        await userService.delete(userId)
        const index = users.value.findIndex(user => user.id === userId)
        if (index !== -1) {
          users.value.splice(index, 1)
        }
      } catch (err) {
        error.value = 'Erro ao excluir usuário. Por favor, tente novamente.'
        console.error('Error deleting user:', err)
      } finally {
        loading.value = false
      }
    }

    // Criar novo perfil
    const addNewProfile = async () => {
      loading.value = true
      error.value = null
      try {
        // Definir as permissões baseadas no tipo de perfil
        let permissions = []
        
        if (newProfile.type === 'Admin') {
          // Admin tem todas as permissões
          permissions = [1, 2, 3, 4, 5] // IDs de todas as permissões
        } else if (newProfile.type === 'Desenvolvedor') {
          // Desenvolvedor tem acesso a Downloads, Avaliações, Erros e Novas Funcionalidades
          permissions = [1, 2, 3, 5] // IDs das permissões específicas
        } else if (newProfile.type === 'Recursos Humanos') {
          // RH tem acesso apenas a Avaliações
          permissions = [2] // ID da permissão de Avaliações
        }

        const profileData = {
          name: newProfile.type,
          permissions: permissions
        }

        console.log('Enviando dados do perfil:', profileData)
        const response = await profileService.create(profileData)
        console.log('Resposta do servidor:', response.data)

        if (response.data && response.data.data) {
          profiles.value = [...profiles.value, response.data.data]
          showNewProfileModal.value = false
          
          // Reset form
          newProfile.type = 'Admin'

          // Recarregar a lista completa para garantir sincronização
          await fetchData()
        } else {
          throw new Error('Resposta inválida do servidor')
        }
      } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Erro ao criar perfil. Por favor, tente novamente.'
        console.error('Error creating profile:', err)
      } finally {
        loading.value = false
      }
    }

    const editUser = (user) => {
      selectedUser.value = user
      showEditUserModal.value = true
    }

    // Função para contar usuários por perfil
    const getUserCountByProfile = (profileId) => {
      return users.value.filter(user => user.profile_id === profileId).length
    }

    // Função para verificar se um perfil tem uma permissão específica
    const hasPermission = (profile, permission) => {
      if (profile.name === 'Admin') return true
      
      const permissionMap = {
        'downloads': 1,
        'evaluations': 2,
        'errors': 3,
        'feedbacks': 4,
        'newFeatures': 5
      }

      const permissionId = permissionMap[permission]
      return profile.permissions?.some(p => p.id === permissionId)
    }

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

    // Carregar dados ao montar o componente
    onMounted(fetchData)

    return {
      showNewProfileModal,
      showNewUserModal,
      showEditUserModal,
      selectedUser,
      newProfile,
      users,
      profiles,
      loading,
      error,
      addNewProfile,
      handleNewUser,
      handleEditUser,
      handleDeleteUser,
      editUser,
      getUserCountByProfile,
      hasPermission,
      handleLogout
    }
  }
}
</script>

<style scoped>
.settings-container {
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
  color: #010101;
}

.main-content {
  flex: 1;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-left: 284px; /* 244px (largura da sidebar) + 40px de espaço */
}

.main-content h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.add-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #6366F1;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #4F46E5;
}

.settings-table {
  width: 100%;
  background: white;
  border-radius: 12px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}

.settings-table th,
.settings-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

.settings-table th {
  background-color: #F9FAFB;
  font-weight: 500;
  color: #6B7280;
}

.permission-tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: #EEF2FF;
  color: #6366F1;
  border-radius: 16px;
  font-size: 12px;
  margin-right: 8px;
}

.permission-tag.all {
  background-color: #6366F1;
  color: white;
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.active {
  background-color: #DCFCE7;
  color: #16A34A;
}

.action-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: transparent;
  color: #6B7280;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #F3F4F6;
  color: #6366F1;
}

.profiles-section,
.users-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #6366F1;
}

.permissions-section {
  margin-bottom: 24px;
}

.permission-label {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 16px;
}

.permission-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.permission-toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.permission-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E5E7EB;
  transition: .4s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #6366F1;
}

input:checked + .toggle-slider:before {
  transform: translateX(16px);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.btn-secondary {
  padding: 8px 16px;
  border: 1px solid #E5E7EB;
  background-color: white;
  color: #6B7280;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #F3F4F6;
}

.btn-primary {
  padding: 8px 16px;
  background-color: #6366F1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #4F46E5;
}

.btn-icon {
  background: none;
  border: none;
  color: #4B5563;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: #1F2937;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #DEF7EC;
  color: #03543F;
}

.status-badge.inactive {
  background-color: #FDE8E8;
  color: #9B1C1C;
}

.permissions-preview {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.platform-icon {
  width: 16px;
  height: 16px;
}
</style> 