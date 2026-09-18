# VestibulIF Piracicaba

Portal de orientação para o processo seletivo do IFSP Campus Piracicaba: mapa da
Rede Federal, videoaulas de Português e Matemática e simulados com correção
comentada.

```
VestibulIF/
├── backend/     FastAPI + PostgreSQL (autenticação JWT)
└── frontend/    React + Vite (SPA que consome a API)
```

## Subindo o projeto

São dois processos, um em cada terminal.

### Backend - http://127.0.0.1:8000

```bash
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r <deps do pyproject.toml>   # ou: poetry install
cp .env.example .env        # preencha com os dados do seu PostgreSQL
.venv/Scripts/python -m alembic upgrade head
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

Documentação interativa da API em http://127.0.0.1:8000/docs.

### Frontend - http://localhost:5173

```bash
cd frontend
npm install
npm run dev
```

O frontend chama `/api/...` relativo e o dev server do Vite encaminha para o
backend, então os dois sobem sem configuração extra. Veja
[frontend/README.md](frontend/README.md#por-que-o-proxy) para o motivo.

## API disponível

| Método | Rota | Resposta |
| --- | --- | --- |
| GET | `/api/health` | `{ status }` |
| POST | `/api/auth/register` | `201 { id, name, email }` |
| POST | `/api/auth/login` | `{ access_token, refresh_token, token_type }` |
| POST | `/api/auth/refresh` | novo par de tokens (rotaciona) |
| POST | `/api/auth/logout` | revoga o refresh token |
| GET | `/api/auth/me` | `{ id, name, email }` (Bearer) |

Matérias, videoaulas, provas e estatísticas ainda **não existem no backend** - o
frontend os serve de uma camada de mock isolada, pronta para ser trocada por
chamadas HTTP. O mapa do que é real e do que é mock está em
[frontend/README.md](frontend/README.md#o-que-é-real-e-o-que-é-mock).

## Telas

| Rota | Acesso | Conteúdo |
| --- | --- | --- |
| `/` | pública | hero, mapa da Rede Federal, trilhas, cursos, agenda, FAQ |
| `/login`, `/cadastro` | pública | **API real** |
| `/dashboard` | protegida | estatísticas, evolução, plano de estudos |
| `/videoaulas` | protegida | hub com Matemática e Português |
| `/materias/:id` | protegida | videoaulas da matéria, por tema |
| `/vestibulares` | protegida | provas disponíveis e histórico |
| `/vestibulares/:id/quiz` | protegida | simulado com cronômetro |
| `/resultados/:id` | protegida | correção comentada |
| `/perfil` | protegida | **API real** |
