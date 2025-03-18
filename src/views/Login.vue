<template>
  <div class="login-container">
    <div class="sign-in">Sign In</div>
    
    <div class="login-box">
      <div class="logo-wrapper">
        <img src="@/assets/Logo_Convict.png" alt="Convicti Logo" class="logo" />
        <img src="@/assets/Palavra_CONVICTI.png" alt="Convicti" class="logo-text" />
      </div>

      <div class="content-wrapper">
        <h1 class="welcome-text">Bem-vindo de Volta</h1>
        <p class="subtitle">Insira sua credenciais para acessar a plataforma</p>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <input
              v-model="email"
              type="email"
              placeholder="Seu e-mail"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <input
              v-model="password"
              type="password"
              placeholder="Sua senha"
              class="form-input"
              required
            />
          </div>

          <button 
            type="submit" 
            class="login-button"
            :class="{ 'loading': loading }"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authService } from '@/services/api'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref(null)

    const email = ref('')
    const password = ref('')

    const handleSubmit = async () => {
      try {
        loading.value = true
        await authService.login(email.value, password.value)
        ElMessage.success('Login realizado com sucesso!')
        router.push('/dashboard')
      } catch (error) {
        console.error('Login error:', error)
        ElMessage.error('Email ou senha inválidos')
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      loading,
      error,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 24px;
  position: relative;
}

.sign-in {
  position: absolute;
  top: 24px;
  left: 24px;
  color: #8F8F8F;
  font-size: 0.875rem;
  width: 94px;
  height: 27px;
  display: flex;
  align-items: center;
}

.login-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 290px;
  margin: 0 auto;
  padding-bottom: 80px; /* Compensar a altura do sign-in */
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 48px;
}

.logo {
  width: 80.62px;
  height: 52px;
  object-fit: contain;
}

.logo-text {
  width: 94px;
  height: 27px;
  object-fit: contain;
}

.content-wrapper {
  width: 100%;
}

.welcome-text {
  font-size: 33px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  width: 222px;
  margin-bottom: 8px;
}

.subtitle {
  color: #8F8F8F;
  font-size: 16px;
  margin: 0;
  width: 258px;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.form-group {
  width: 100%;
}

.form-input {
  width: 290px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #6366F1;
}

.form-input::placeholder {
  color: #8F8F8F;
}

.login-button {
  width: 290px;
  height: 40px;
  background-color: #6366F1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #4F46E5;
}

.login-button.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .login-box {
    padding: 24px;
  }
}
</style> 