<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-content">
      <h2>Novo Usuário</h2>
      
      <div class="form-group">
        <input 
          v-model="userData.name" 
          type="text" 
          class="form-input" 
          placeholder="Nome do usuário"
          @blur="validateName"
        >
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <input 
          v-model="userData.email" 
          type="email" 
          class="form-input" 
          placeholder="Email"
          @blur="validateEmail"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <div class="profile-label">Perfil</div>
        <div class="profile-options">
          <label v-for="profile in profiles" :key="profile.id" class="profile-radio">
            <input 
              type="radio" 
              v-model="userData.profile_id" 
              :value="profile.id"
              name="profile"
              @change="validateProfile"
            >
            <span class="radio-custom"></span>
            <span class="radio-label">{{ profile.name }}</span>
          </label>
        </div>
        <span v-if="errors.profile_id" class="error-message">{{ errors.profile_id }}</span>
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="closeModal">
          Voltar
        </button>
        <button class="btn-primary" @click="handleSubmit">
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'NewUserModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    profiles: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'submit'],
  setup(props, { emit }) {
    const userData = reactive({
      name: '',
      email: '',
      profile_id: 0
    })

    const errors = reactive({
      name: '',
      email: '',
      profile_id: ''
    })

    const validateName = () => {
      errors.name = !userData.name.trim() ? 'O nome é obrigatório' : ''
    }

    const validateEmail = () => {
      if (!userData.email.trim()) {
        errors.email = 'O email é obrigatório'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())) {
        errors.email = 'Email inválido'
      } else {
        errors.email = ''
      }
    }

    const validateProfile = () => {
      errors.profile_id = !userData.profile_id || userData.profile_id === 0 ? 'O perfil é obrigatório' : ''
    }

    const validateForm = () => {
      validateName()
      validateEmail()
      validateProfile()
      return !errors.name && !errors.email && !errors.profile_id
    }

    const closeModal = () => {
      emit('update:modelValue', false)
      // Reset form data
      userData.name = ''
      userData.email = ''
      userData.profile_id = 0
      // Reset errors
      errors.name = ''
      errors.email = ''
      errors.profile_id = ''
    }

    const handleSubmit = () => {
      if (validateForm()) {
        emit('submit', {
          name: userData.name.trim(),
          email: userData.email.trim().toLowerCase(),
          profile_id: Number(userData.profile_id)
        })
      }
    }

    return {
      userData,
      errors,
      closeModal,
      handleSubmit,
      validateName,
      validateEmail,
      validateProfile
    }
  }
}
</script>

<style scoped>
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

.profile-label {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 16px;
}

.profile-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-radio {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.profile-radio input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #E5E7EB;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  transition: all 0.3s ease;
}

.radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #6366F1;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

.profile-radio input[type="radio"]:checked + .radio-custom {
  border-color: #6366F1;
}

.profile-radio input[type="radio"]:checked + .radio-custom::after {
  transform: translate(-50%, -50%) scale(1);
}

.radio-label {
  font-size: 14px;
  color: #111827;
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

.error-message {
  color: #DC2626;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style> 