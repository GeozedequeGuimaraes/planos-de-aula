# Planos de Aula

Sistema de gerenciamento de planos de aula com sugestão inteligente de conteúdos pedagógicos.

## Funcionalidades

- **CRUD completo** de planos de aula com paginação, filtros e ordenação
- **Smart Assist** — gera sugestões de conteúdos, recursos e tags usando IA
- Filtros por disciplina, tags e data prevista
- Busca por título
- Interface responsiva com sidebar fixa

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express + Prisma ORM |
| Banco de dados | PostgreSQL |
| Frontend | React + Vite + Tailwind CSS |
| IA | OpenAI GPT-4o |
| Infraestrutura | Docker + Docker Compose |
| CI | GitHub Actions |

## Como rodar

### Pré-requisitos

- Docker e Docker Compose instalados
- Chave de API da OpenAI

### 1. Clone e configure o ambiente

```bash
git clone https://github.com/GeozedequeGuimaraes/planos-de-aula.git
cd planos-de-aula
cp .env.example .env
```

Edite o arquivo `.env` e preencha a variável `OPENAI_API_KEY` com sua chave.

### 2. Suba a aplicação

```bash
docker compose up --build
```

Aguarde todos os serviços iniciarem. O banco de dados e as migrações são executados automaticamente.

### 3. Acesse

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend (API) | http://localhost:3001 |
| Health check | http://localhost:3001/health |

---

## Desenvolvimento local

### Backend

```bash
cd backend
cp .env.example .env   # configure DATABASE_URL e OPENAI_API_KEY
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Estrutura do projeto

```
planos-de-aula/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/        # conexão com banco
│       ├── controllers/   # handlers das rotas
│       ├── middlewares/   # validação, erros
│       ├── routes/        # definição de rotas
│       ├── services/      # lógica de negócio e IA
│       └── utils/         # logger
├── frontend/
│   └── src/
│       ├── components/    # Sidebar, Card, Paginação
│       ├── pages/         # ListingPage, FormPage
│       └── services/      # cliente HTTP
├── .github/
│   └── workflows/
│       └── ci.yml
└── docker-compose.yml
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| GET | `/api/planos` | Lista planos (com filtros e paginação) |
| POST | `/api/planos` | Cria um novo plano |
| GET | `/api/planos/:id` | Busca plano por ID |
| PUT | `/api/planos/:id` | Atualiza um plano |
| DELETE | `/api/planos/:id` | Remove um plano |
| POST | `/api/smart-assist` | Gera recomendações com IA |

### Parâmetros de listagem

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `search` | string | Busca por título |
| `discipline` | string | Filtra por disciplina |
| `tags` | string | Tags separadas por vírgula |
| `scheduledAt` | ISO date | Filtra a partir dessa data |
| `orderBy` | `title` \| `createdAt` \| `scheduledAt` | Campo de ordenação |
| `order` | `asc` \| `desc` | Direção da ordenação |
| `page` | number | Página atual (padrão: 1) |
| `limit` | number | Itens por página (padrão: 10) |

## Variáveis de ambiente

### Raiz (docker-compose)
```env
POSTGRES_USER=planos
POSTGRES_PASSWORD=planos
POSTGRES_DB=planos_de_aula
OPENAI_API_KEY=sk-...
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/planos_de_aula
PORT=3001
OPENAI_API_KEY=sk-...
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3001/api
```
