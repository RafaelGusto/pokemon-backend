# Pokémon Backend API 🎮

API REST completa para gerenciar Treinadores, Times de Pokémon e sincronização de dados com a PokéAPI e ViaCEP, construída com **NestJS**, **TypeORM** e **MySQL**.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia  | Versão | Propósito                      |
| ----------- | ------ | ------------------------------ |
| **NestJS**  | 11.0.1 | Framework backend TypeScript   |
| **TypeORM** | 0.3.28 | ORM para MySQL                 |
| **MySQL**   | 8.0    | Banco de dados relacional      |
| **Swagger** | 11.2.5 | Documentação interativa de API |
| **Axios**   | 1.13.2 | Cliente HTTP para integrações  |
| **Docker**  | Latest | Containerização do MySQL       |

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Yarn** 4.0+ ou **npm** 10+
- **Docker** e **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** para clonar o repositório

Verificar instalação:

```bash
node --version    # v20.x.x
yarn --version    # 4.x.x
docker --version  # Docker version xx.x.x
```

---

## 📥 Clone do Repositório

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/pokemon-backend.git
cd pokemon-backend
```

### 2. Navegue até a pasta backend

```bash
cd backend
```

---

## 🔧 Configuração do Ambiente

### 1. Arquivo de Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 2. Configure as Variáveis

Edite o arquivo `.env` com as seguintes variáveis:

```env
# ========== BANCO DE DADOS ==========
DB_HOST=localhost
DB_PORT=3306
DB_USER=pokemon_user
DB_PASSWORD=pokemon_password
DB_NAME=pokemon_db
DB_SYNCHRONIZE=true

# ========== APLICAÇÃO ==========
APP_PORT=3000
NODE_ENV=development

# ========== INTEGRAÇÕES EXTERNAS ==========
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
VIACEP_BASE_URL=https://viacep.com.br/ws

# ========== CACHE TTL ==========
POKEMON_SYNC_TTL_DAYS=7
```

**Notas Importantes:**

- `DB_SYNCHRONIZE=true` cria automaticamente as tabelas no primeiro run
- `POKEMON_SYNC_TTL_DAYS=7` define 7 dias para revalidar dados da PokéAPI
- Credenciais padrão são para **desenvolvimento** - altere em produção!

---

## 🐳 Iniciar o Banco de Dados (Docker)

### 1. Inicie apenas o MySQL via Docker Compose

```bash
docker-compose up -d mysql
```

**O que acontece:**

- ✅ Container MySQL 8.0 é criado
- ✅ Volume `mysql_data` persiste os dados
- ✅ Banco de dados `pokemon_db` é criado automaticamente
- ✅ Health check monitora a saúde do container

### 2. Verifique se o MySQL está rodando

```bash
docker-compose ps

# Resultado esperado:
# NAME      STATUS      PORTS
# mysql     Up 30s      3306/tcp
```

### 3. Ver logs do MySQL

```bash
docker-compose logs -f mysql
```

### 4. Parar apenas o MySQL

```bash
docker-compose down mysql
```

---

## 📦 Instalar Dependências

Na pasta `backend/`, execute:

```bash
yarn install
# ou
npm install
```

Isso instala todas as dependências do `package.json`, incluindo:

- NestJS e plugins
- TypeORM
- Swagger
- Validadores

---

## 🚀 Iniciar a Aplicação

### Modo Desenvolvimento (com hot-reload)

```bash
yarn start:dev
```

**Resultado esperado:**

```
[NestFactory] Starting Nest application...
✅ API rodando em http://localhost:3000
📚 Documentação Swagger: http://localhost:3000/api/docs
```

### Modo Produção

```bash
# 1. Build da aplicação
yarn build

# 2. Iniciar production
yarn start:prod
```

---

## 📚 Acessar a Documentação Swagger

Após iniciar a aplicação, acesse a documentação interativa:

🔗 **URL:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

**No Swagger você pode:**

- ✅ Visualizar todos os endpoints disponíveis
- ✅ Ver esquemas de request/response
- ✅ Testar endpoints diretamente com "Try it out"
- ✅ Copiar comandos cURL

### Health Check

Para verificar se a API está operacional:

```bash
curl http://localhost:3000/health

# Resposta esperada:
# {"status":"ok","message":"API is running"}
```

---

## 📊 Estrutura da Base de Dados

### Tabelas Principais

```
┌─────────────────┐
│    trainers     │  Treinadores
├─────────────────┤
│ id (UUID)       │
│ email (UNIQUE)  │
│ name            │
│ cep             │
│ addressData     │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│     teams       │  Times (max 5 Pokémon por time)
├─────────────────┤
│ id (UUID)       │
│ name            │
│ trainerId (FK)  │
└────────┬────────┘
         │ N:N
         │
┌────────▼──────────────┐
│  team_pokemons        │  Associação Times-Pokémon
├───────────────────────┤
│ id (UUID)             │
│ teamId (FK)           │
│ pokemonId (FK)        │
│ order (posição)       │
│ UNIQUE(teamId, pk)    │
└────────┬──────────────┘
         │ N:1
         │
┌────────▼────────┐
│   pokemons      │  Pokémons (sincronizados da PokéAPI)
├─────────────────┤
│ id (UUID)       │
│ externalId      │
│ name            │
│ types (JSON)    │
│ sprite          │
│ pokeApiData     │
│ lastSyncedAt    │
└─────────────────┘
```

---

## 🔌 Endpoints Principais

### 🏥 Health Check

```
GET  /health           Verificar status da API
GET  /                 Mensagem de boas-vindas
```

### 👨‍💼 Trainers (Treinadores)

```
POST   /trainers                      Criar treinador
GET    /trainers                      Listar todos
GET    /trainers/{id}                 Buscar por ID
PATCH  /trainers/{id}                 Atualizar
DELETE /trainers/{id}                 Deletar (soft delete)
POST   /trainers/{id}/restore         Restaurar deletado
GET    /trainers/{id}/address         Consultar CEP/endereço
PATCH  /trainers/{id}/address/{cep}   Atualizar CEP
```

### ⏰ Teams (Times)

```
POST   /teams                              Criar time
GET    /teams                              Listar todos
GET    /teams/{id}                         Buscar por ID
PATCH  /teams/{id}                         Atualizar nome
DELETE /teams/{id}                         Deletar (soft delete)
POST   /teams/{id}/restore                 Restaurar deletado
GET    /teams/{id}/pokemon                 Listar Pokémons do time
POST   /teams/{id}/pokemon                 Adicionar Pokémon (max 5)
DELETE /teams/{teamId}/pokemon/{pokemonId} Remover Pokémon
GET    /teams/trainer/{trainerId}          Listar times de um treinador
```

### 🎮 Pokémon

```
GET    /pokemon                      Listar salvos localmente
GET    /pokemon/{id}                 Buscar por ID local
GET    /pokemon/external/{externalId} Buscar por ID PokéAPI
POST   /pokemon                      Criar novo
POST   /pokemon/fetch/{externalId}   Sincronizar da PokéAPI
GET    /pokemon/sync-status          Status de sincronização
POST   /pokemon/sync-expired         Resincronizar expirados
```

### 📍 CEP (ViaCEP)

```
GET    /cep/{cep}                    Consultar endereço por CEP
```

---

## 🔐 Credenciais Padrão (Desenvolvimento)

Para testes iniciais, use:

**Banco de Dados MySQL:**

```
Host: localhost
Porta: 3306
Usuário: pokemon_user
Senha: pokemon_password
Banco: pokemon_db
```

**Aplicação:**

```
Host: http://localhost
Porta: 3000
```

⚠️ **IMPORTANTE**: Altere essas credenciais antes de colocar em produção!

---

## 📋 Regras de Negócio Implementadas

### Trainers (Treinadores)

- ✅ Email único - validação em tempo de criação
- ✅ Soft Delete - treinadores podem ser restaurados
- ✅ Integração ViaCEP - busca endereço por CEP
- ⚠️ Restrição: não pode deletar treinador com times ativos

### Teams (Times)

- ✅ Máximo 5 Pokémons por time
- ✅ Sem duplicatas - não pode adicionar o mesmo Pokémon 2x
- ✅ Soft Delete - times podem ser restaurados
- ✅ Cascata: ao deletar treinador, todos seus times são deletados
- ✅ Reordenação automática ao remover Pokémon

### Pokémon

- ✅ TTL Cache - dados sincronizados da PokéAPI com validade de 7 dias
- ✅ Sincronização automática - busca dados quando expirado
- ✅ Endpoint para forçar resync - parâmetro `forceSync=true`
- ✅ Histórico - tabela `pokemon_sync_log` rastreia sincronizações

---

## 🧪 Exemplos de Uso

### 1. Criar um Treinador

```bash
curl -X POST http://localhost:3000/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ash@pokemon.com",
    "name": "Ash Ketchum",
    "cep": "01310100"
  }'
```

### 2. Criar um Time

```bash
curl -X POST http://localhost:3000/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Time Pikachu",
    "trainerId": "uuid-do-treinador"
  }'
```

### 3. Adicionar Pokémon ao Time

```bash
# Primeiro, sincronize Pikachu (ID 25) da PokéAPI
curl -X POST http://localhost:3000/pokemon/fetch/25

# Depois, adicione ao time
curl -X POST http://localhost:3000/teams/{teamId}/pokemon \
  -H "Content-Type: application/json" \
  -d '{
    "pokemonId": "uuid-do-pokemon"
  }'
```

### 4. Listar Pokémons com Paginação

```bash
curl "http://localhost:3000/pokemon?limit=10&offset=0"
```

### 5. Verificar Status de Sincronização

```bash
curl http://localhost:3000/pokemon/sync-status
```

---

## 🛠️ Troubleshooting

### ❌ Erro: "connect ECONNREFUSED 127.0.0.1:3306"

**Solução:** MySQL não está rodando

```bash
docker-compose up -d mysql
docker-compose ps  # Verifique se está "Up"
```

### ❌ Erro: "Error: listen EADDRINUSE :::3000"

**Solução:** Porta 3000 já está em uso

```bash
# Mude APP_PORT no .env para 3001
APP_PORT=3001
```

### ❌ Erro: "ER_ACCESS_DENIED_FOR_USER"

**Solução:** Credenciais do MySQL estão incorretas

```bash
# Remova os containers e volumes
docker-compose down -v
# Recrie com .env correto
docker-compose up -d mysql
```

### ❌ Erro: "Entity does not exist"

**Solução:** Tabelas não foram criadas

```bash
# Remova e recrie o banco
docker-compose down -v
docker-compose up -d mysql
yarn start:dev
```

---

## 📦 Variáveis de Ambiente Completas

```env
# ========== BANCO DE DADOS ==========
DB_HOST=localhost              # Host do MySQL
DB_PORT=3306                   # Porta do MySQL
DB_USER=pokemon_user           # Usuário
DB_PASSWORD=pokemon_password   # Senha
DB_NAME=pokemon_db             # Nome do banco
DB_SYNCHRONIZE=true            # Auto-criar tabelas

# ========== APLICAÇÃO ==========
APP_PORT=3000                  # Porta da API
NODE_ENV=development           # Ambiente (development|production)

# ========== INTEGRAÇÕES ==========
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
VIACEP_BASE_URL=https://viacep.com.br/ws

# ========== CACHE ==========
POKEMON_SYNC_TTL_DAYS=7        # TTL para revalidar Pokémons (dias)
```

---

## 📝 Scripts NPM/Yarn

## � Scripts NPM/Yarn

```bash
# Instalação
yarn install

# Desenvolvimento
yarn start:dev          # Hot-reload mode
yarn lint              # ESLint
yarn format            # Prettier

# Build & Produção
yarn build             # Compilar TypeScript
yarn start:prod        # Rodar versão compilada

# Testes
yarn test              # Unit tests
yarn test:e2e          # E2E tests
yarn test:cov          # Coverage report
```

---

## 🚀 Fluxo de Desenvolvimento Recomendado

### 1º Terminal: Iniciar MySQL via Docker

```bash
docker-compose up -d mysql
# Verificar: docker-compose ps
```

### 2º Terminal: Iniciar aplicação em desenvolvimento

```bash
cd backend
yarn install  # primeira vez
yarn start:dev
```

### 3º Terminal: Testar endpoints (opcional)

```bash
# No Swagger: http://localhost:3000/api/docs
# Ou via curl/Postman
curl http://localhost:3000/health
```

---

## 🐳 Docker Compose - Detalhes

### Arquivo docker-compose.yml

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    container_name: pokemon_mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: pokemon_db
      MYSQL_USER: pokemon_user
      MYSQL_PASSWORD: pokemon_password
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
    driver: local
```

### Comandos Úteis Docker

```bash
# Ver status dos containers
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs -f mysql

# Conectar ao MySQL via CLI
docker exec -it pokemon_mysql mysql -u pokemon_user -ppokemod_password pokemon_db

# Limpar tudo (volumes inclusos)
docker-compose down -v

# Listar volumes
docker volume ls

# Verificar tamanho dos dados
docker exec pokemon_mysql du -sh /var/lib/mysql
```

---

## 📊 Arquitetura do Projeto

```
pokemon-backend/
├── docker-compose.yml      # Configuração MySQL Docker
├── .env.example            # Template de variáveis
├── package.json            # Dependências
│
└── backend/
    ├── src/
    │   ├── main.ts                    # Bootstrap + Swagger setup
    │   ├── app.module.ts              # Root module
    │   ├── app.controller.ts          # Health endpoints
    │   │
    │   ├── config/
    │   │   ├── database.config.ts     # TypeORM config
    │   │   └── env.validation.ts      # Env vars validation
    │   │
    │   ├── integrations/
    │   │   ├── pokeapi/               # PokéAPI service
    │   │   └── viacep/                # ViaCEP service
    │   │
    │   └── modules/
    │       ├── trainer/               # Trainers (CRUD + CEP)
    │       ├── team/                  # Teams (CRUD + Pokemon management)
    │       ├── pokemon/               # Pokémons (TTL cache + PokéAPI sync)
    │       └── cep/                   # CEP wrapper endpoint
    │
    ├── test/
    │   └── app.e2e-spec.ts
    │
    └── dist/                          # Build output
```

---

## 🔄 Fluxo de Sincronização Pokémon (TTL)

```
POST /pokemon/fetch/25
        ↓
┌─────────────────────────┐
│ Verificar se existe     │
│ em pokemons table       │
└────┬─────────────┬──────┘
     │             │
  NÃO              SIM
     │             │
     │      ┌──────▼───────────────┐
     │      │ Verificar TTL:       │
     │      │ Expirado?            │
     │      └──┬──────────────┬─────┘
     │         │              │
     │      SIM│              │NÃO
     │      ┌──▼──────┐    ┌──▼──────────┐
     │      │ Buscar  │    │ Retornar    │
     │      │ PokéAPI │    │ cache local │
     │      └──┬──────┘    └─────────────┘
     │         │
     └────┬────┘
          │
    ┌─────▼─────────────────┐
    │ Salvar/Atualizar em   │
    │ pokemons table        │
    │ lastSyncedAt = NOW()  │
    └─────┬─────────────────┘
          │
    ┌─────▼────────────────┐
    │ Log em               │
    │ pokemon_sync_log     │
    └─────────────────────┘
```

---

## 📈 Performance & Otimizações

### TTL Strategy (7 dias padrão)

- ✅ Reduz carga na PokéAPI
- ✅ Mantém dados frescos
- ✅ Configurável via `POKEMON_SYNC_TTL_DAYS`

### Índices de Banco de Dados

- ✅ `trainers.email` - UNIQUE para lookup rápido
- ✅ `pokemons.externalId` - UNIQUE para busca PokéAPI
- ✅ `team_pokemons(teamId, pokemonId)` - UNIQUE para evitar duplicatas

### Lazy Relations

- ✅ Relações carregadas sob demanda
- ✅ Eager loading onde necessário (`pokemon.teams`)
- ✅ Previne N+1 queries

---

## 🔐 Segurança

### Validações Implementadas

- ✅ Email único e validado
- ✅ CEP com exatamente 8 dígitos
- ✅ Nomes com comprimento mínimo/máximo
- ✅ Soft delete protege dados históricos
- ✅ Cascata de deletes gerencia integridade

### Recomendações para Produção

- ⚠️ Altere credenciais do MySQL
- ⚠️ Use HTTPS/TLS
- ⚠️ Implemente autenticação/JWT
- ⚠️ Configure CORS apropriadamente
- ⚠️ Use rate limiting
- ⚠️ Monitore logs e erros
- ⚠️ Backup automático do banco

---

## 📞 Suporte & Contato

### Problemas Comuns

| Problema            | Solução                                  |
| ------------------- | ---------------------------------------- |
| MySQL não conecta   | `docker-compose up -d mysql`             |
| Porta 3000 em uso   | Mude `APP_PORT` no `.env`                |
| Tabelas não existem | Remova volumes: `docker-compose down -v` |
| Erro de validação   | Verifique `.env` com `.env.example`      |

### Recursos Úteis

- 📖 [NestJS Docs](https://docs.nestjs.com/)
- 📖 [TypeORM Docs](https://typeorm.io/)
- 📖 [Swagger/OpenAPI](https://swagger.io/)
- 🎮 [PokéAPI Docs](https://pokeapi.co/)
- 📍 [ViaCEP Docs](https://viacep.com.br/)

---

## ✅ Checklist de Funcionalidades

- [x] CRUD completo para Trainers
- [x] CRUD completo para Teams
- [x] Gerenciamento de Pokémons em Times (max 5)
- [x] Sincronização com PokéAPI
- [x] Cache com TTL (7 dias)
- [x] Integração ViaCEP para endereços
- [x] Soft Delete com restore
- [x] Documentação Swagger/OpenAPI
- [x] Validação de dados com class-validator
- [x] TypeORM com MySQL
- [x] Docker Compose para banco
- [x] Environment variables validation
- [x] Error handling global
- [x] Logging estruturado
- [x] Health checks

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja LICENSE para detalhes.

---

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para gerenciar sua coleção de Pokémon**
"numero": "1000",
"complemento": "Apto 1001",
"bairro": "Bela Vista",
"localidade": "São Paulo",
"uf": "SP",
"ibge": "3550308",
"gia": "",
"ddd": "11",
"siafi": "7107"
}

```

---

## 🔄 Estratégia de Sincronização de Pokémon (TTL)

### Como Funciona

A aplicação utiliza uma estratégia de **TTL (Time To Live)** para gerenciar dados da PokéAPI:

1. **Primeira Requisição**: Quando um Pokémon é solicitado pela primeira vez, a API busca os dados na PokéAPI e os salva localmente com um timestamp `lastSyncedAt`.

2. **Cache Local**: Nas requisições subsequentes, se o TTL não expirou (padrão: 7 dias), os dados são retornados do banco local.

3. **Revalidação**: Após 7 dias, o Pokémon é marcado como "expirado" e será resincronizado na próxima requisição.

4. **Força de Sincronização**: É possível forçar a sincronização via parâmetro `forceSync=true` ou via endpoint `/pokemon/sync-expired`.

### Configuração do TTL

Altere em `.env`:

```

POKEMON_SYNC_TTL_DAYS=7 # Dias até expiração

````

### Benefícios

✅ Reduz carga na PokéAPI
✅ Melhora performance das requisições
✅ Permite offline-first (dados local sempre disponíveis)
✅ Sincronização automática de dados expirados

---

## 🗄️ Modelo de Dados

### Tabelas Principais

#### `trainers`

- `id` (UUID, PK)
- `email` (varchar, unique)
- `name` (varchar)
- `cep` (varchar, opcional)
- `addressData` (json, endereço completo)
- `createdAt`, `updatedAt`, `deletedAt` (soft delete)

#### `teams`

- `id` (UUID, PK)
- `name` (varchar)
- `trainerId` (FK → trainers)
- `createdAt`, `updatedAt`, `deletedAt` (soft delete)

#### `pokémons`

- `id` (UUID, PK)
- `externalId` (int, unique) - ID da PokéAPI
- `name` (varchar)
- `types` (json) - Array de tipos
- `sprite` (text) - URL da imagem
- `pokeApiData` (json) - Dados completos da PokéAPI
- `lastSyncedAt` (datetime) - Última sincronização
- `createdAt`, `updatedAt`

#### `team_pokémons` (Associação)

- `id` (UUID, PK)
- `teamId` (FK → teams)
- `pokemonId` (FK → pokémons)
- `order` (int) - Posição no time
- `createdAt`, `updatedAt`
- **Unique Constraint**: (teamId, pokemonId)

---

## 🛡️ Regras de Negócio Implementadas

### Treinadores (Trainers)

1. ✅ **Email Único**: Não é possível criar dois Treinadores com o mesmo email.
2. ✅ **Soft Delete**: Ao deletar, o treinador não é removido do banco, apenas marcado como deletado.
3. ✅ **Proteção de Exclusão**: Não é possível deletar um Treinador que possua Times ativos.
4. ✅ **Integração com CEP**: Ao criar ou atualizar um Treinador com CEP, os dados de endereço são enriquecidos via ViaCEP.

### Times (Teams)

1. ✅ **Máximo 5 Pokémons**: Não é possível adicionar mais de 5 Pokémons a um Time.
2. ✅ **Sem Duplicatas**: Não é possível adicionar o mesmo Pokémon duas vezes no mesmo Time.
3. ✅ **Cascata de Exclusão**: Ao deletar um Treinador, todos seus Times são deletados.
4. ✅ **Ordenação**: Pokémons são ordenados automaticamente por posição no Time.
5. ✅ **Soft Delete**: Times podem ser restaurados após exclusão.

### Pokémons

1. ✅ **Sincronização Automática**: Se um Pokémon não existe localmente, é buscado na PokéAPI.
2. ✅ **Cache com TTL**: Dados são reutilizados até expiração do TTL.
3. ✅ **Força de Sincronização**: É possível forçar a revalidação via parâmetro ou endpoint.
4. ✅ **Revalidação em Massa**: Endpoint para sincronizar todos os Pokémons expirados.

---

## 📊 Exemplo de Fluxo Completo

### 1. Criar um Treinador

```bash
POST /trainers
{
  "email": "ash@pokemon.com",
  "name": "Ash Ketchum",
  "cep": "01310100"
}
````

**Resposta:**

```json
{
  "id": "d4f8c8f4-1234-5678-9abc-def012345678",
  "email": "ash@pokemon.com",
  "name": "Ash Ketchum",
  "cep": "01310100",
  "addressData": {
    "cep": "01310-100",
    "logradouro": "Avenida Paulista",
    "bairro": "Bela Vista",
    "localidade": "São Paulo",
    "uf": "SP"
  },
  "createdAt": "2024-01-16T10:00:00Z",
  "updatedAt": "2024-01-16T10:00:00Z"
}
```

### 2. Criar um Time

```bash
POST /teams
{
  "name": "Team Pikachu",
  "trainerId": "d4f8c8f4-1234-5678-9abc-def012345678"
}
```

### 3. Adicionar Pokémons ao Time

**Opção A: Criar Pokémon primeiro**

```bash
POST /pokemon/fetch/25  # Pikachu
```

**Opção B: Adicionar ao Time**

```bash
POST /teams/{teamId}/pokemon
{
  "pokemonId": "uuid-do-pikachu"
}
```

### 4. Listar Time com Pokémons

```bash
GET /teams/{teamId}
```

---

## 📝 Scripts Disponíveis

```bash
yarn build          # Compila o projeto
yarn start          # Inicia em modo produção
yarn start:dev      # Inicia em modo desenvolvimento
yarn start:debug    # Inicia com debug ativado
yarn lint           # Valida código com ESLint
yarn format         # Formata código com Prettier
```

---

## 🐛 Tratamento de Erros

A API retorna erros estruturados:

```json
{
  "statusCode": 400,
  "message": "Team já possui 5 Pokémons. Máximo atingido.",
  "error": "Bad Request"
}
```

**Status Codes Comuns:**

- `200`: Sucesso
- `201`: Criado com sucesso
- `204`: Deletado com sucesso
- `400`: Erro de validação
- `404`: Recurso não encontrado
- `409`: Conflito (ex: Email já existe)
- `500`: Erro interno do servidor

---

## 🔐 Variáveis de Ambiente

| Variável                | Padrão                    | Descrição                         |
| ----------------------- | ------------------------- | --------------------------------- |
| `DB_HOST`               | localhost                 | Host do MySQL                     |
| `DB_PORT`               | 3306                      | Porta do MySQL                    |
| `DB_USER`               | pokemon_user              | Usuário do MySQL                  |
| `DB_PASSWORD`           | pokemon_password          | Senha do MySQL                    |
| `DB_NAME`               | pokemon_db                | Nome do banco                     |
| `DB_SYNCHRONIZE`        | true                      | Auto-sincronizar schema           |
| `APP_PORT`              | 3000                      | Porta da API                      |
| `NODE_ENV`              | development               | Ambiente (development/production) |
| `POKEAPI_BASE_URL`      | https://pokeapi.co/api/v2 | URL base PokéAPI                  |
| `VIACEP_BASE_URL`       | https://viacep.com.br/ws  | URL base ViaCEP                   |
| `POKEMON_SYNC_TTL_DAYS` | 7                         | Dias para expiração de cache      |

---

## 📦 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.config.ts        # Configuração do banco
│   │   └── env.validation.ts         # Validação de env vars
│   ├── integrations/
│   │   ├── pokeapi/                  # Integração com PokéAPI
│   │   └── viacep/                   # Integração com ViaCEP
│   ├── modules/
│   │   ├── trainer/                  # Módulo de Treinadores
│   │   ├── team/                     # Módulo de Times
│   │   ├── pokemon/                  # Módulo de Pokémons
│   │   └── cep/                      # Módulo de CEP
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── .env
└── package.json
```

---

## 🚨 Troubleshooting

### Erro de Conexão com o Banco

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solução**: Certifique-se de que o MySQL está rodando:

```bash
docker-compose up -d mysql
```

### Erro de Validação de Env Vars

```
Error: DB_PORT must be a number
```

**Solução**: Certifique-se de que as variáveis em `.env` estão corretas.

### Pokémon não encontrado na PokéAPI

A PokéAPI pode estar indisponível. Verifique a conexão e tente novamente.

---

## 📞 Suporte

Para mais informações sobre a PokéAPI: https://pokeapi.co/  
Para mais informações sobre ViaCEP: https://viacep.com.br/

---

## 📄 Licença

UNLICENSED

---

**Desenvolvido com ❤️ usando NestJS, TypeORM e MySQL**

# unit tests

$ yarn run test

# e2e tests

$ yarn run test:e2e

# test coverage

$ yarn run test:cov

````

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
````

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
