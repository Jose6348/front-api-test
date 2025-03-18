# Sistema de Estatísticas

Sistema frontend desenvolvido em Vue.js para visualização de estatísticas de uso de uma aplicação, com controle de acesso baseado em perfis de usuário.

## Funcionalidades

### Perfis de Usuário

#### Admin
- Visualiza todas as estatísticas
- Acesso total ao sistema

#### Desenvolvedor
- Downloads
- Avaliações
- Erros
- Novas Funcionalidades

#### Recursos Humanos
- Avaliações
- Gerenciamento de Perfis
- Gerenciamento de Usuários

## Requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Executando o Projeto

Para desenvolvimento:
```bash
npm run serve
```

Para produção:
```bash
npm run build
```

## Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizáveis
├── router/         # Configuração de rotas
├── store/          # Gerenciamento de estado (Vuex)
├── views/          # Páginas/Views da aplicação
├── App.vue         # Componente raiz
└── main.js         # Ponto de entrada da aplicação
```

## Tecnologias Utilizadas

- Vue.js 3
- Vue Router
- Vuex
- Element Plus
- Axios

## Notas

- Todos os usuários são criados com a senha padrão: 12345678
- O sistema utiliza autenticação baseada em tokens
- As permissões são controladas por perfil de usuário
