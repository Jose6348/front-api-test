<template>
  <div class="user-management">
    <div class="header">
      <h1>Gerenciamento de Usuários</h1>
      <el-button type="primary" @click="showCreateDialog">
        Novo Usuário
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="users"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Nome"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="Email"
        width="180">
      </el-table-column>
      <el-table-column
        prop="profile.name"
        label="Perfil">
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
      :title="dialogType === 'create' ? 'Novo Usuário' : 'Editar Usuário'"
      width="500px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="Perfil" prop="profileId">
          <el-select v-model="form.profileId" placeholder="Selecione um perfil">
            <el-option
              v-for="profile in profiles"
              :key="profile.id"
              :label="profile.name"
              :value="profile.id">
            </el-option>
          </el-select>
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
  name: 'UserManagement',
  setup() {
    const store = useStore()
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogType = ref('create')
    const formRef = ref(null)
    
    const users = ref([])
    const profiles = ref([])
    
    const form = reactive({
      name: '',
      email: '',
      profileId: ''
    })
    
    const rules = {
      name: [
        { required: true, message: 'Por favor, digite o nome', trigger: 'blur' }
      ],
      email: [
        { required: true, message: 'Por favor, digite o email', trigger: 'blur' },
        { type: 'email', message: 'Por favor, digite um email válido', trigger: 'blur' }
      ],
      profileId: [
        { required: true, message: 'Por favor, selecione um perfil', trigger: 'change' }
      ]
    }
    
    const fetchUsers = async () => {
      loading.value = true
      try {
        const data = await store.dispatch('fetchUsers')
        users.value = data
      } catch (error) {
        ElMessage.error('Erro ao carregar usuários')
      } finally {
        loading.value = false
      }
    }
    
    const fetchProfiles = async () => {
      try {
        const data = await store.dispatch('fetchProfiles')
        profiles.value = data
      } catch (error) {
        ElMessage.error('Erro ao carregar perfis')
      }
    }
    
    const showCreateDialog = () => {
      dialogType.value = 'create'
      form.name = ''
      form.email = ''
      form.profileId = ''
      dialogVisible.value = true
    }
    
    const handleEdit = (row) => {
      dialogType.value = 'edit'
      form.name = row.name
      form.email = row.email
      form.profileId = row.profile.id
      dialogVisible.value = true
    }
    
    const handleDelete = async () => {
      try {
        await ElMessageBox.confirm(
          'Tem certeza que deseja excluir este usuário?',
          'Aviso',
          {
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            type: 'warning'
          }
        )
        
        // TODO: Implement delete API call
        ElMessage.success('Usuário excluído com sucesso!')
        fetchUsers()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Erro ao excluir usuário')
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
            ? 'Usuário criado com sucesso!'
            : 'Usuário atualizado com sucesso!'
        )
        
        dialogVisible.value = false
        fetchUsers()
      } catch (error) {
        ElMessage.error('Erro ao salvar usuário')
      }
    }
    
    onMounted(() => {
      fetchUsers()
      fetchProfiles()
    })
    
    return {
      loading,
      dialogVisible,
      dialogType,
      formRef,
      form,
      rules,
      users,
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
.user-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 