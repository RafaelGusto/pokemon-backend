# Pokémon Backend API

API REST completa para gerenciar Treinadores, Times de Pokémon e sincronização de dados com a PokéAPI e ViaCEP.

## 🚀 Tecnologias Utilizadas

- **Framework**: NestJS v11.0.1
- **ORM**: TypeORM v0.3.28
- **Banco de Dados**: MySQL 8.0 (via Docker)
- **Validação**: class-validator, class-transformer
- **HTTP Client**: Axios via @nestjs/axios
- **Containerização**: Docker & Docker Compose

## 📋 Requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)
- Yarn ou npm

## 🔧 Configuração do Ambiente

### 1. Clone o repositório

```bash
cd pokemon-backend/backend
```

### 2. Instale as dependências

```bash
yarn install
# ou
npm install
```

### 3. Arquivo de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

**Variáveis de Ambiente Importantes:**

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=pokemon_user
DB_PASSWORD=pokemon_password
DB_NAME=pokemon_db
DB_SYNCHRONIZE=true

APP_PORT=3000
NODE_ENV=development

POKEAPI_BASE_URL=https://pokeapi.co/api/v2
VIACEP_BASE_URL=https://viacep.com.br/ws

POKEMON_SYNC_TTL_DAYS=7
```

## 🐳 Rodando com Docker Compose

### Iniciar todos os serviços

```bash
docker-compose up -d
```

Isso irá:

- Criar e iniciar o container MySQL
- Criar e iniciar o container da API NestJS
- Sincronizar automaticamente o banco de dados

### Parar os serviços

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f app
```

## 🚀 Rodando Localmente

### 1. Inicie o MySQL localmente

Se não quiser usar Docker para o MySQL, certifique-se de que uma instância MySQL está rodando na porta 3306.

### 2. Execute as migrações (automático via TypeORM synchronize)

O TypeORM criará as tabelas automaticamente ao iniciar a aplicação.

### 3. Inicie a API

```bash
# Modo desenvolvimento com hot-reload
yarn start:dev

# Modo produção
yarn build
yarn start:prod
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação da API

### Health Check

```bash
GET http://localhost:3000/health
```

### **Trainers (Treinadores)**

#### Criar Treinador

```bash
POST /trainers
Content-Type: application/json

{
  "email": "ash@pokemon.com",
  "name": "Ash Ketchum",
  "cep": "82560560"  # opcional
}
```

#### Listar Treinadores

```bash
GET /trainers
```

#### Buscar Treinador por ID

```bash
GET /trainers/{id}
```

#### Atualizar Treinador

```bash
PATCH /trainers/{id}
Content-Type: application/json

{
  "name": "Ash",
  "cep": "01310200"
}
```

#### Deletar Treinador (Soft Delete)

```bash
DELETE /trainers/{id}
```

⚠️ **Restrição de Negócio**: Não é possível deletar um Treinador que possua Times ativos. Deve-se deletar os Times primeiro.

#### Restaurar Treinador Deletado

```bash
POST /trainers/{id}/restore
```

#### Consultar Endereço do Treinador (via CEP)

```bash
GET /trainers/{id}/address
```

#### Atualizar CEP e Endereço do Treinador

```bash
PATCH /trainers/{id}/address/{cep}

Exemplo: PATCH /trainers/uuid123/address/01310100
```

---

### **Teams (Times)**

#### Criar Time

```bash
POST /teams
Content-Type: application/json

{
  "name": "Team Pikachu",
  "trainerId": "uuid-do-treinador"
}
```

#### Listar Times

```bash
GET /teams
GET /teams?trainerId=uuid-do-treinador  # Filtrar por treinador
```

#### Buscar Time por ID

```bash
GET /teams/{id}
```

#### Atualizar Time

```bash
PATCH /teams/{id}
Content-Type: application/json

{
  "name": "Team Pikachu Updated"
}
```

#### Deletar Time (Soft Delete)

```bash
DELETE /teams/{id}
```

#### Restaurar Time Deletado

```bash
POST /teams/{id}/restore
```

#### Listar Pokémons do Time

```bash
GET /teams/{id}/pokemon
```

#### Adicionar Pokémon ao Time

```bash
POST /teams/{id}/pokemon
Content-Type: application/json

{
  "pokemonId": "uuid-do-pokemon"
}
```

⚠️ **Regras de Negócio**:

- Máximo de **5 Pokémons** por Time
- Não é possível adicionar o **mesmo Pokémon** duas vezes no mesmo Time

#### Remover Pokémon do Time

```bash
DELETE /teams/{teamId}/pokemon/{pokemonId}
```

#### Listar Times de um Treinador

```bash
GET /teams/trainer/{trainerId}
```

---

### **Pokémon**

#### Listar Pokémons Salvos Localmente

```bash
GET /pokemon
GET /pokemon?limit=20&offset=0
```

#### Buscar Pokémon por ID Local

```bash
GET /pokemon/{id}
```

#### Buscar Pokémon por ID Externo (PokéAPI)

```bash
GET /pokemon/external/{externalId}

Exemplo: GET /pokemon/external/1  # Bulbassaur
```

#### Criar/Sincronizar Pokémon da PokéAPI

```bash
POST /pokemon/fetch/{externalId}
POST /pokemon/fetch/1?forceSync=true  # Força resincronização

Exemplo: POST /pokemon/fetch/25  # Pikachu
```

#### Criar Pokémon Manualmente

```bash
POST /pokemon
Content-Type: application/json

{
  "externalId": 25,
  "name": "Pikachu",
  "types": ["electric"],
  "sprite": "https://..."
}
```

#### Ver Status de Sincronização

```bash
GET /pokemon/sync-status
```

Retorna:

```json
{
  "totalPokemon": 10,
  "needsSync": 2,
  "lastSyncDate": "2024-01-16T10:30:00Z"
}
```

#### Sincronizar Pokémons Expirados

```bash
POST /pokemon/sync-expired

# Sincroniza automaticamente todos os Pokémons com TTL expirado
```

---

### **CEP (Integração ViaCEP)**

#### Consultar Endereço por CEP

```bash
GET /cep/01310100

Resposta:
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
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
POKEMON_SYNC_TTL_DAYS=7  # Dias até expiração
```

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
```

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
