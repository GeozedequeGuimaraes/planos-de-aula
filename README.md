# Planos de Aula

Aplicação web para organizar planos de aula, consultar conteúdos por filtros e gerar sugestões pedagógicas a partir do tema da aula.

O projeto foi desenvolvido como uma solução completa para o desafio de manutenção de software: API REST, interface SPA, banco PostgreSQL, integração com OpenAI, Docker e pipeline de lint no GitHub Actions.

## Interface

![Tela de listagem dos planos de aula](docs/screenshots/listagem.png)

![Tela de cadastro com rascunho assistido](docs/screenshots/formulario.png)

## O que a aplicação faz

- Cadastro, edição, remoção e listagem de planos de aula.
- Paginação, busca por título e filtros por disciplina, tags e data prevista.
- Ordenação por título, data de cadastro ou data prevista.
- Formulário validado com campos pedagógicos essenciais: objetivo, ementa, conteúdos, recursos e tags.
- Rascunho assistido com OpenAI para sugerir conteúdos, recursos de apoio e três tags.
- Health check em `/health`.
- Logs estruturados para operações principais e chamadas ao serviço de IA.
- Execução com Docker Compose em um único comando.

## Decisões de projeto

A interface foi pensada como uma ferramenta de trabalho para docentes e conteudistas. Em vez de uma tela promocional, a primeira experiência já entrega consulta, filtros e criação de planos.

O assistente não substitui a autoria do professor: ele aparece como apoio ao rascunho. A resposta da IA preenche campos editáveis, mantendo a revisão humana como parte natural do fluxo.

No backend, a API foi separada por camadas simples: rotas, controllers, services, validação e tratamento de erros. A chave da OpenAI é lida por variável de ambiente e nunca deve ser versionada.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Query |
| Backend | Node.js, Express, Joi |
| Banco | PostgreSQL, Prisma ORM |
| IA | OpenAI API |
| Infra | Docker, Docker Compose, Nginx |
| CI | GitHub Actions com lint de frontend e backend |

## Como rodar com Docker

Pré-requisitos:

- Docker Desktop ou Docker Engine com Compose.
- Uma chave da OpenAI para usar o rascunho assistido.

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Preencha a chave no `.env`:

```env
POSTGRES_USER=planos
POSTGRES_PASSWORD=planos
POSTGRES_DB=planos_de_aula
OPENAI_API_KEY=sk-...
```

Suba a aplicação:

```bash
docker compose up --build
```

Acesse:

| Serviço | URL |
| --- | --- |
| Frontend | `http://localhost` |
| Backend | `http://localhost:3001` |
| Health check | `http://localhost:3001/health` |

O backend sincroniza o schema do Prisma ao iniciar o container.

## Desenvolvimento local

Backend:

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Se o frontend estiver fora do Docker, configure:

```env
VITE_API_URL=http://localhost:3001/api
```

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica o estado da API |
| `GET` | `/api/planos` | Lista planos com filtros e paginação |
| `POST` | `/api/planos` | Cria um plano |
| `GET` | `/api/planos/:id` | Busca um plano por ID |
| `PUT` | `/api/planos/:id` | Atualiza um plano |
| `DELETE` | `/api/planos/:id` | Remove um plano |
| `POST` | `/api/smart-assist` | Gera sugestões pedagógicas |

Parâmetros da listagem:

| Parâmetro | Descrição |
| --- | --- |
| `search` | Busca por título |
| `discipline` | Filtra por disciplina |
| `tags` | Filtra por tags separadas por vírgula |
| `scheduledAt` | Filtra a partir de uma data prevista |
| `orderBy` | `title`, `createdAt` ou `scheduledAt` |
| `order` | `asc` ou `desc` |
| `page` | Página atual |
| `limit` | Quantidade por página |

## Deploy

O projeto está pronto para deploy via Docker. Em um servidor ou serviço com suporte a containers, configure:

- `DATABASE_URL` apontando para um PostgreSQL.
- `OPENAI_API_KEY` com uma chave válida da OpenAI.
- `PORT=3001` no backend.
- `VITE_API_URL` no build do frontend, apontando para a URL pública da API.

Para buildar o frontend com uma API pública:

```bash
docker build \
  --build-arg VITE_API_URL=https://sua-api.com/api \
  -t planos-de-aula-frontend \
  ./frontend
```

Para o backend em produção, o comando usado no Compose é:

```bash
npx prisma db push && node src/app.js
```

## Observações sobre a OpenAI

O rascunho assistido depende de cota disponível na conta da OpenAI. Se a chave estiver sem créditos ou sem billing ativo, a aplicação informa o problema na própria tela.

Nunca publique `.env`, chaves de API ou tokens no repositório.

## Estrutura

```text
planos-de-aula/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── docs/
│   └── screenshots/
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Autor

Geozedeque Guimarães  
Estudante de Ciência da Computação, CIn-UFPE

[GitHub](https://github.com/GeozedequeGuimaraes) · [LinkedIn](https://linkedin.com/in/geozedeque-guimaraes)
