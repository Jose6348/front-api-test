<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-content">
      <h2>Editar Perfil</h2>
      
      <div class="form-group">
        <input 
          v-model="profileData.name" 
          type="text" 
          class="form-input" 
          placeholder="Nome do perfil"
        >
      </div>

      <div class="permissions-section">
        <div class="permission-label">Dashboard</div>
        
        <div class="permission-options">
          <div class="permission-item">
            <label class="permission-toggle">
              <input 
                type="checkbox" 
                v-model="profileData.permissions.downloads"
              >
              <span class="toggle-slider"></span>
            </label>
            <span>Downloads</span>
          </div>

          <div class="permission-item">
            <label class="permission-toggle">
              <input 
                type="checkbox" 
                v-model="profileData.permissions.evaluations"
              >
              <span class="toggle-slider"></span>
            </label>
            <span>Avaliações</span>
          </div>

          <div class="permission-item">
            <label class="permission-toggle">
              <input 
                type="checkbox" 
                v-model="profileData.permissions.errors"
              >
              <span class="toggle-slider"></span>
            </label>
            <span>Erros</span>
          </div>

          <div class="permission-item">
            <label class="permission-toggle">
              <input 
                type="checkbox" 
                v-model="profileData.permissions.feedbacks"
              >
              <span class="toggle-slider"></span>
            </label>
            <span>Feedbacks</span>
          </div>

          <div class="permission-item">
            <label class="permission-toggle">
              <input 
                type="checkbox" 
                v-model="profileData.permissions.newFeatures"
              >
              <span class="toggle-slider"></span>
            </label>
            <span>Novas Funcionalidades</span>
          </div>
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
  name: 'EditProfileModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    profile: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'submit', 'delete'],
  setup(props, { emit }) {
    const profileData = reactive({
      name: props.profile.name,
      permissions: {
        downloads: props.profile.permissions.downloads,
        evaluations: props.profile.permissions.evaluations,
        errors: props.profile.permissions.errors,
        feedbacks: props.profile.permissions.feedbacks,
        newFeatures: props.profile.permissions.newFeatures
      }
    })

    const closeModal = () => {
      emit('update:modelValue', false)
    }

    const handleSubmit = () => {
      emit('submit', { ...profileData })
      closeModal()
    }

    const handleDelete = () => {
      if (confirm('Tem certeza que deseja excluir este perfil?')) {
        emit('delete', props.profile.id)
        closeModal()
      }
    }

    return {
      profileData,
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