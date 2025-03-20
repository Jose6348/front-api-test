# Instruções de Instalação e Configuração

Este projeto consiste em duas partes:
1. API Backend (test-stats-api) - Laravel + MySQL
2. Frontend (front-api-test) - Vue.js

## Pré-requisitos

- Docker e Docker Compose
- Node.js e npm
- Git

## Configuração do Backend (test-stats-api)

1. Entre na pasta do backend:
```bash
cd test-stats-api
```

2. Copie o arquivo .env.example para .env:
```bash
cp .env.example .env
```

3. Construa e inicie os containers Docker:
```bash
docker-compose up -d
```

4. Execute as migrações e seeders do banco de dados:
```bash
docker exec test-stats-app php artisan migrate:fresh --seed
```

5. Gere as chaves do Passport:
```bash
docker exec test-stats-app php artisan passport:install --force
```

6. Crie um cliente OAuth2 (anote o CLIENT_ID e CLIENT_SECRET gerados):
```bash
docker exec test-stats-app php artisan passport:client --password --no-interaction --name="Test Stats API Password Grant Client"
```

7. Ajuste as permissões do storage:
```bash
docker exec test-stats-app chown -R www-data:www-data /var/www/html/storage
```

O backend estará rodando em http://localhost:8080

## Configuração do Frontend (front-api-test)

1. Entre na pasta do frontend:
```bash
cd ../front-api-test
```

2. Instale as dependências:
```bash
npm install
```

3. Atualize o arquivo src/services/api.js com as credenciais do OAuth2 geradas no passo 6 do backend:
```javascript
const CLIENT_ID = 'seu_client_id_aqui'
const CLIENT_SECRET = 'seu_client_secret_aqui'
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run serve
```

O frontend estará rodando em http://localhost:8084

## Testando o Login

Você pode fazer login com qualquer uma das seguintes credenciais:

1. Administrador:
   - Email: junior@convicti.com.br
   - Senha: 12345678

2. Gerente:
   - Email: joao.lucas@convicti.com.br
   - Senha: 12345678

3. Usuário:
   - Email: cintia.lopes@convicti.com.br
   - Senha: 12345678

## Estrutura do Projeto

### Backend (test-stats-api)
- Laravel 10
- MySQL via Docker
- Laravel Passport para autenticação OAuth2
- Migrations e Seeders para estrutura inicial do banco

### Frontend (front-api-test)
- Vue.js 3
- Axios para requisições HTTP
- Vue Router para navegação
- Proxy configurado para evitar problemas de CORS

## Solução de Problemas

1. Se encontrar erros de CORS:
   - Verifique se o proxy está configurado corretamente no vue.config.js
   - Confirme se está usando as URLs corretas no arquivo api.js

2. Se encontrar erros de autenticação:
   - Verifique se as credenciais do OAuth2 (CLIENT_ID e CLIENT_SECRET) estão corretas
   - Confirme se o Passport foi instalado e configurado corretamente

3. Se o banco de dados não estiver acessível:
   - Verifique se os containers Docker estão rodando: `docker ps`
   - Tente recriar o banco: `docker exec test-stats-app php artisan migrate:fresh --seed`

4. Se as chaves do Passport não funcionarem:
   - Remova as chaves antigas: `docker exec test-stats-app rm -f /var/www/html/storage/oauth-*.key`
   - Gere novas chaves: `docker exec test-stats-app php artisan passport:install --force` 