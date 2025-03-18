<template>
  <div id="app">
    <el-container v-if="isAuthenticated && user">
      <el-aside width="200px">
        <el-menu
          :router="true"
          :default-active="$route.path"
          class="el-menu-vertical">
          <el-menu-item index="/dashboard">
            <el-icon><DataLine /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('downloads')" index="/statistics">
            <el-icon><TrendCharts /></el-icon>
            <span>Estatísticas</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('users')" index="/users">
            <el-icon><User /></el-icon>
            <span>Usuários</span>
          </el-menu-item>
          
          <el-menu-item v-if="hasPermission('profiles')" index="/profiles">
            <el-icon><Setting /></el-icon>
            <span>Perfis</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header>
          <div class="header-content">
            <h2>Sistema de Estatísticas</h2>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">Sair</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { DataLine, TrendCharts, User, Setting } from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    DataLine,
    TrendCharts,
    User,
    Setting
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const user = computed(() => store.state.user)
    const hasPermission = computed(() => store.getters.hasPermission)

    const handleCommand = async (command) => {
      if (command === 'logout') {
        try {
          await store.dispatch('logout')
          // Força a limpeza do localStorage
          localStorage.clear()
          // Redireciona para login usando replace para evitar histórico
          router.replace('/login')
        } catch (error) {
          console.error('Erro ao fazer logout:', error)
          // Força a limpeza do localStorage mesmo em caso de erro
          localStorage.clear()
          router.replace('/login')
        }
      }
    }

    return {
      isAuthenticated,
      user,
      hasPermission,
      handleCommand
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
}

.el-menu {
  border-right: none;
  background-color: #304156;
}

.el-menu-vertical {
  height: 100%;
}

.el-menu-item {
  color: #bfcbd9;
  height: 50px;
  line-height: 50px;
}

.el-menu-item:hover {
  background-color: #263445;
}

.el-menu-item.is-active {
  background-color: #263445;
  color: #409EFF;
}

.el-menu-item .el-icon {
  width: 24px;
  height: 24px;
  font-size: 18px;
  margin-right: 8px;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
