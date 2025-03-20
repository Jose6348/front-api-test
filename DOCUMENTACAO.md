# Documentação do Projeto Test Stats

## Visão Geral

O Test Stats é uma aplicação web moderna desenvolvida para gerenciamento e análise de dados, utilizando uma arquitetura distribuída com frontend e backend separados. O projeto implementa as melhores práticas de desenvolvimento e segurança, incluindo autenticação OAuth2 e uma API RESTful.

## Arquitetura

### Backend (test-stats-api)

O backend é construído utilizando o framework Laravel 10, oferecendo uma API RESTful robusta e segura.

#### Tecnologias Principais
- **Laravel 10**: Framework PHP moderno e robusto
- **MySQL**: Sistema de gerenciamento de banco de dados
- **Docker**: Containerização da aplicação e seus serviços
- **Laravel Passport**: Sistema de autenticação OAuth2
- **Composer**: Gerenciador de dependências PHP

#### Estrutura de Diretórios
```
test-stats-api/
├── app/                    # Código principal da aplicação
│   ├── Http/              # Controllers, Middleware, Requests
│   ├── Models/            # Modelos do Eloquent
│   └── Services/          # Serviços da aplicação
├── config/                # Arquivos de configuração
├── database/              # Migrations e Seeders
├── docker/                # Configurações Docker
├── routes/                # Definição de rotas da API
└── storage/               # Arquivos de log e cache
```

#### Ambiente Docker
O projeto utiliza Docker para garantir consistência entre ambientes de desenvolvimento e produção:
- Container PHP/Laravel
- Container MySQL
- Container Nginx

### Frontend (front-api-test)

O frontend é desenvolvido com Vue.js 3, oferecendo uma interface moderna e responsiva.

#### Tecnologias Principais
- **Vue.js 3**: Framework JavaScript progressivo
- **Axios**: Cliente HTTP para comunicação com a API
- **Vue Router**: Gerenciamento de rotas
- **Node.js e npm**: Ambiente de execução e gerenciador de pacotes

#### Estrutura de Diretórios
```
front-api-test/
├── public/                # Arquivos públicos
├── src/                   # Código fonte principal
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes Vue
│   ├── router/          # Configuração de rotas
│   ├── services/        # Serviços e integrações
│   └── views/           # Componentes de página
└── node_modules/         # Dependências
```

## Segurança

### Autenticação
- Implementação OAuth2 via Laravel Passport
- Tokens de acesso JWT
- Diferentes níveis de usuário (Administrador, Gerente, Usuário)

### CORS
- Configuração segura de CORS via proxy no frontend
- Proteção contra requisições não autorizadas

## Níveis de Acesso

O sistema possui três níveis de acesso:

1. **Administrador**
   - Acesso completo ao sistema
   - Gerenciamento de usuários
   - Configurações avançadas

2. **Gerente**
   - Acesso a relatórios e dashboards
   - Gerenciamento de equipe
   - Visualização de estatísticas

3. **Usuário**
   - Acesso básico ao sistema
   - Visualização de dados pessoais
   - Operações padrão

## Ambiente de Desenvolvimento

### Requisitos
- Docker e Docker Compose
- Node.js (v14 ou superior)
- npm (v6 ou superior)
- Git

### Portas Utilizadas
- Backend: http://localhost:8080
- Frontend: http://localhost:8084
- MySQL: 3306 (interno)

## Boas Práticas

### Desenvolvimento
- Uso de TypeScript para maior segurança de tipos
- Padrões de projeto Laravel (Repository, Service Layer)
- Componentização no Vue.js
- Testes automatizados

### Versionamento
- Controle de versão via Git
- Branches protegidas
- Commits semânticos

### Código
- PSR-12 para PHP
- ESLint para JavaScript/Vue
- Documentação de código
- Code review

## Manutenção

### Logs
- Logs de sistema via Laravel
- Logs de acesso
- Logs de erros

### Backup
- Backup automático do banco de dados
- Versionamento de código
- Armazenamento seguro de dados

## Escalabilidade

O projeto foi desenvolvido pensando em escalabilidade:

### Backend
- Arquitetura em camadas
- Cache configurável
- Otimização de consultas
- Containerização

### Frontend
- Lazy loading de componentes
- Otimização de assets
- Cache de API
- PWA ready

## Roadmap

Próximas features planejadas:

1. Implementação de testes E2E
2. Integração com CI/CD
3. Monitoramento em tempo real
4. Módulo de relatórios avançados
5. Internacionalização (i18n)

## Suporte

Para suporte e contribuições:

1. Abra uma issue no repositório
2. Siga o guia de contribuição
3. Faça um fork e submeta um PR
4. Mantenha a documentação atualizada

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. 