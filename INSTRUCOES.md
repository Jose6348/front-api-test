# Instruções de Execução do Frontend

Este documento contém instruções detalhadas para executar o frontend do sistema de estatísticas.

## Pré-requisitos

Antes de começar, certifique-se de que:
1. O backend está rodando em http://localhost:8080
2. Node.js está instalado (versão 14 ou superior)
3. npm está instalado (geralmente vem com Node.js)

## Credenciais de Acesso

### Admin (Acesso Total)
- Email: junior@convicti.com.br
- Senha: 12345678

### Desenvolvedor
- Email: joao.lucas@convicti.com.br
- Senha: 12345678

### Recursos Humanos
- Email: cintia.lopes@convicti.com.br
- Senha: 12345678

## Funcionalidades por Perfil

### Admin
- Acesso total ao sistema
- Visualização de todas as estatísticas
- Gerenciamento de usuários
- Gerenciamento de perfis
- Visualização de downloads
- Visualização de avaliações
- Registro de erros
- Controle de features

### Desenvolvedor
- Visualização de downloads
- Visualização de avaliações
- Registro de erros
- Novas funcionalidades

### Recursos Humanos
- Visualização de avaliações
- Gerenciamento de perfis
- Gerenciamento de usuários

## Passo a Passo para Execução

### 1. Preparação do Ambiente

Primeiro, certifique-se de que está no diretório correto:
```bash
cd front-api-test
```

### 2. Instalação das Dependências

Se for a primeira vez executando o projeto:
```bash
npm install
```

### 3. Configuração do Ambiente

Verifique se o arquivo `.env` existe e contém as configurações corretas:
```
VUE_APP_API_URL=http://localhost:8080
```

### 4. Iniciando o Servidor de Desenvolvimento

Execute o comando:
```bash
npm run serve
```

Após a execução, você verá uma mensagem similar a:
```
App running at:
- Local:   http://localhost:8084/
- Network: http://192.168.1.3:8084/
```

### 5. Acessando a Aplicação

1. Abra seu navegador
2. Acesse http://localhost:8084
3. Use as credenciais do perfil desejado

## Solução de Problemas Comuns

### Se o backend não estiver respondendo:
1. Verifique se o backend está rodando:
```bash
docker ps
```
2. Se necessário, reinicie o backend:
```bash
docker compose down
docker compose up -d
```

### Se encontrar erros de CORS:
1. Verifique se o proxy está configurado corretamente em `vue.config.js`
2. Certifique-se de que o backend está rodando em http://localhost:8080

### Se tiver problemas com o npm:
1. Limpe o cache:
```bash
npm cache clean --force
```
2. Remova node_modules e reinstale:
```bash
rm -rf node_modules
npm install
```

## Verificações Importantes

Antes de executar, verifique se:
1. O backend está rodando e acessível
2. As portas 8080 (backend) e 8084 (frontend) estão disponíveis
3. O arquivo `.env` está configurado corretamente
4. Todas as dependências foram instaladas

## Dicas de Desenvolvimento

- O servidor de desenvolvimento tem hot-reload, então as alterações no código serão refletidas automaticamente
- Use o console do navegador (F12) para verificar erros
- O proxy está configurado para redirecionar `/api` e `/oauth` para o backend

## Para Parar o Servidor

Para parar o servidor de desenvolvimento:
1. Pressione `Ctrl + C` no terminal
2. Confirme com `Y` se solicitado

## Build de Produção

Se precisar criar uma build de produção:
```bash
npm run build
```

A build será criada na pasta `dist/` 