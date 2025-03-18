<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-content">
      <h2>Editar Usuário</h2>
      
      <div class="form-group">
        <input 
          v-model="userData.name" 
          type="text" 
          class="form-input" 
          placeholder="Nome do usuário"
        >
      </div>

      <div class="form-group">
        <input 
          v-model="userData.email" 
          type="email" 
          class="form-input" 
          placeholder="Email"
        >
      </div>

      <div class="form-group">
        <div class="profile-label">Perfil</div>
        <div class="profile-options">
          <label class="profile-radio">
            <input 
              type="radio" 
              v-model="userData.profile" 
              value="Admin"
              name="profile"
            >
            <span class="radio-custom"></span>
            <span class="radio-label">Admin</span>
          </label>

          <label class="profile-radio">
            <input 
              type="radio" 
              v-model="userData.profile" 
              value="Desenvolvedor"
              name="profile"
            >
            <span class="radio-custom"></span>
            <span class="radio-label">Desenvolvedor</span>
          </label>

          <label class="profile-radio">
            <input 
              type="radio" 
              v-model="userData.profile" 
              value="Recursos Humanos"
              name="profile"
            >
            <span class="radio-custom"></span>
            <span class="radio-label">Recursos Humanos</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <div class="profile-label">Status</div>
        <div class="status-options">
          <label class="status-toggle">
            <input 
              type="checkbox" 
              v-model="userData.active"
            >
            <span class="toggle-slider"></span>
            <span class="toggle-label">{{ userData.active ? 'Ativo' : 'Inativo' }}</span>
          </label>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-danger" @click="handleDelete">
          Excluir
        </button>
        <div class="right-actions">
          <button class="btn-secondary" @click="closeModal">
            Voltar
          </button>
          <button class="btn-primary" @click="handleSubmit">
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'EditUserModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'submit', 'delete'],
  setup(props, { emit }) {
    const userData = reactive({
      name: props.user.name,
      email: props.user.email,
      profile: props.user.profile,
      active: props.user.status === 'ATIVO'
    })

    const closeModal = () => {
      emit('update:modelValue', false)
    }

    const handleSubmit = () => {
      emit('submit', {
        ...userData,
        status: userData.active ? 'ATIVO' : 'INATIVO'
      })
      closeModal()
    }

    const handleDelete = () => {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        emit('delete', props.user.id)
        closeModal()
      }
    }

    return {
      userData,
      closeModal,
      handleSubmit,
      handleDelete
    }
  }
}
</script>

<style scoped>
/* Reuse existing modal styles */
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

/* ... other existing styles ... */

.status-options {
  margin-top: 8px;
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-label {
  font-size: 14px;
  color: #111827;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.right-actions {
  display: flex;
  gap: 16px;
}

.btn-danger {
  padding: 8px 16px;
  background-color: #DC2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #B91C1C;
}
</style> 