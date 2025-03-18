<template>
  <div class="profile-management">
    <div class="header">
      <h1>Gerenciamento de Perfis</h1>
      <el-button type="primary" @click="showCreateDialog">
        Novo Perfil
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="profiles"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Nome"
        width="180">
      </el-table-column>
      <el-table-column
        label="Permissões">
        <template #default="scope">
          <el-tag
            v-for="permission in scope.row.permissions"
            :key="permission"
            class="permission-tag"
            size="small">
            {{ permission }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Ações"
        width="200">
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.row)">
            Editar
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)">
            Excluir
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? 'Novo Perfil' : 'Editar Perfil'"
      width="500px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Permissões" prop="permissions">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox label="downloads">Downloads</el-checkbox>
            <el-checkbox label="evaluations">Avaliações</el-checkbox>
            <el-checkbox label="errors">Erros</el-checkbox>
            <el-checkbox label="newFeatures">Novas Funcionalidades</el-checkbox>
            <el-checkbox label="users">Usuários</el-checkbox>
            <el-checkbox label="profiles">Perfis</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancelar</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ dialogType === 'create' ? 'Criar' : 'Salvar' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ProfileManagement',
  setup() {
    const store = useStore()
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogType = ref('create')
    const formRef = ref(null)
    
    const profiles = ref([])
    
    const form = reactive({
      name: '',
      permissions: []
    })
    
    const rules = {
      name: [
        { required: true, message: 'Por favor, digite o nome', trigger: 'blur' }
      ],
      permissions: [
        { type: 'array', required: true, message: 'Por favor, selecione pelo menos uma permissão', trigger: 'change' }
      ]
    }
    
    const fetchProfiles = async () => {
      loading.value = true
      try {
        const data = await store.dispatch('fetchProfiles')
        profiles.value = data
      } catch (error) {
        ElMessage.error('Erro ao carregar perfis')
      } finally {
        loading.value = false
      }
    }
    
    const showCreateDialog = () => {
      dialogType.value = 'create'
      form.name = ''
      form.permissions = []
      dialogVisible.value = true
    }
    
    const handleEdit = (row) => {
      dialogType.value = 'edit'
      form.name = row.name
      form.permissions = [...row.permissions]
      dialogVisible.value = true
    }
    
    const handleDelete = async () => {
      try {
        await ElMessageBox.confirm(
          'Tem certeza que deseja excluir este perfil?',
          'Aviso',
          {
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            type: 'warning'
          }
        )
        
        // TODO: Implement delete API call
        ElMessage.success('Perfil excluído com sucesso!')
        fetchProfiles()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Erro ao excluir perfil')
        }
      }
    }
    
    const handleSubmit = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        
        // TODO: Implement create/update API call
        ElMessage.success(
          dialogType.value === 'create'
            ? 'Perfil criado com sucesso!'
            : 'Perfil atualizado com sucesso!'
        )
        
        dialogVisible.value = false
        fetchProfiles()
      } catch (error) {
        ElMessage.error('Erro ao salvar perfil')
      }
    }
    
    onMounted(() => {
      fetchProfiles()
    })
    
    return {
      loading,
      dialogVisible,
      dialogType,
      formRef,
      form,
      rules,
      profiles,
      showCreateDialog,
      handleEdit,
      handleDelete,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.profile-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.permission-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style> 