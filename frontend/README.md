# VestibulIF Piracicaba - Frontend

SPA em React + Vite que consome a API FastAPI de [`../backend`](../backend).

O visual e o conteúdo seguem o site original do VestibulIF Piracicaba: mesma
paleta, mesmas fontes (Manrope + Sora), mesmo mapa da Rede Federal e as mesmas
duas matérias do processo seletivo do IFSP - **Português e Matemática**.

## Rodando

```bash
npm install
cp .env.example .env    # opcional: só muda o alvo do proxy
npm run dev             # http://localhost:5173
```

O backend precisa estar de pé em `http://127.0.0.1:8000`:

```bash
cd ../backend
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000
```

### Por que o proxy

O backend não registra `CORSMiddleware`, então uma chamada direta de
`localhost:5173` para `localhost:8000` morreria no preflight. O `vite.config.js`
encaminha `/api` para o backend: o browser enxerga tudo na mesma origem e nenhum
arquivo do backend precisou mudar.

Em produção isso não existe. As opções são servir o `dist/` atrás do mesmo
domínio da API (reverse proxy) ou adicionar CORS no backend e apontar
`VITE_API_BASE_URL` para a URL pública.

## Estrutura

```
public/
└── mapa/              # mapa do Brasil (SVG) servido em iframe, como no original
src/
├── api/               # única camada que fala com dados
│   ├── http.js             # fetch + Authorization + renovação de token
│   ├── erros.js            # normaliza os erros do FastAPI
│   ├── auth.js             # >>> REAL: bate no backend
│   └── materias.js | vestibulares.js | estatisticas.js   # MOCK
├── mocks/             # dados estáticos e histórico local (só os mocks usam)
├── components/
│   ├── comuns/             # Estados (carregando, vazio, barra), MapaIFs
│   └── layout/             # Cabecalho, Rodape, LayoutApp
├── contexts/          # AuthContext (contexto) + AuthProvider (componente)
├── hooks/             # useAuth, useAsync, useTituloDaPagina
├── pages/             # uma pasta por tela
├── routes/            # caminhos.js, AppRotas.jsx, RotaProtegida.jsx
├── styles/            # design system em CSS global, por área
└── utils/             # storage, formato, validacao
```

Os estilos são **CSS global com as mesmas classes do site original**
(`site-header`, `hero`, `dashboard-card`, `quiz-alt`, `prova-card`...), divididos
por área em vez de um arquivo único de 1000 linhas:

| Arquivo | Cobre |
| --- | --- |
| `tokens.css` | paleta, sombras e fontes - toda cor nasce aqui |
| `base.css` | reset, `page-bg`, tipografia, `.btn` |
| `layout.css` | cabeçalho, navegação, largura do conteúdo, rodapé |
| `home.css` | hero, mapa dos IFs, trilhas, cursos, eventos, FAQ |
| `auth.css` | login e cadastro (`auth-shell`) |
| `dashboard.css` | painel, estatísticas, barras de progresso |
| `videoaulas.css` | cartões de matéria, grade de aulas, modal do player |
| `vestibular.css` | provas, quiz, correção, histórico |

Regras que a estrutura assume:

- **Nenhuma tela chama `fetch`.** Tudo passa por `src/api/`.
- **Nenhum componente escreve cor na mão.** Sai de `tokens.css`.
- **Nenhuma rota é escrita como string solta.** Sai de `routes/caminhos.js`.

## O mapa da Rede Federal

O SVG dos 27 estados continua sendo um documento próprio em
`public/mapa/mapa-brasil.html` e entra por `<iframe>`, como no site original. Ele
avisa qual estado foi clicado via `postMessage`; o componente `MapaIFs` escuta e
monta o painel lateral com sigla, nome e link oficial do IF.

Manter o iframe evita converter 38 KB de paths SVG para JSX apenas para trocar a
forma de comunicação - o comportamento visto pelo usuário é idêntico.

## As provas

Doze provas **oficiais do IFSP**, extraídas dos cadernos em PDF publicados pelo
instituto, com cada resposta conferida contra o "Gabarito Final" correspondente.
O processo seletivo é estadual: quem presta em Piracicaba faz estas provas. O
acervo cobre as edições disponíveis desde a criação do campus (Portaria 104, de
29 de janeiro de 2010).

### Modalidade importa

O IFSP tem três modalidades e elas **não servem ao mesmo candidato**:

| Modalidade | Para quem |
| --- | --- |
| **Integrado** | quem terminou o 9º ano - faz o médio e o técnico juntos |
| Concomitante | quem já cursa o ensino médio em outra escola |
| Subsequente | quem já concluiu o ensino médio |

Só o Integrado dá entrada no ensino médio, e ele tem entrada **apenas no 1º
semestre** - por isso toda edição `.2` é Concomitante/Subsequente. A tela de
vestibulares abre filtrada em "Para entrar no ensino médio" para o aluno do 9º
ano não treinar numa prova que não é a dele.

| Prova | Questões | Figuras | Serve ao médio |
| --- | --- | --- | --- |
| PS 2026.2 - Tipo 1 | 30, **5 alternativas (A-E)** | 3 | não |
| PS 2025.2 | 22 | 4 | não |
| PS 2025.1 - Prova B | 30 | 9 | **sim** |
| PS 2025.1 - Prova A | 29 | 9 + 1 com alternativas em gráfico | **sim** |
| PS 2024.2 | 30 | 10 | não |
| PS 2024.1 - Prova B | 29 | 9 | **sim** |
| PS 2024.1 - Prova A | 26 | 7 | **sim** |
| PS 2023.2 | 29 | 7 | não |
| PS 2023.1 - Prova B | 24 | 4 | **sim** |
| PS 2023.1 - Prova A | 28 | 9 | **sim** |
| PS 2022.1 - Tarde | 26 | 11 | **sim** |
| PS 2022.1 - Manhã | 29 | 10 | **sim** |
| Simulado relâmpago | 5, escritas pela equipe (`oficial: false`) | - | - |

Várias provas têm menos de 30 questões. Os motivos, sempre explícitos:

- **anuladas pelo IFSP** - sem resposta correta não há como pontuar;
- **alternativas em gráfico** que não foi possível recortar com segurança.

A questão 9 de 2023.2 é o único caso de **figura ausente**: o recorte original
repetiu por engano a charge da questão 3, e o IFSP publica apenas o gabarito
dessa edição - o caderno não está disponível para refazer o recorte. Como o
enunciado cita a oração analisada, a questão continua respondível; exibir a
charge errada seria pior do que não exibir nenhuma.

A numeração original é preservada, então o mapa do quiz pode ter saltos - é assim
que a prova existe.

As provas oficiais **não têm campo `explicacao`**: o IFSP não publica
justificativa das respostas, e escrever uma aqui passaria opinião nossa como
gabarito oficial. A tela de correção omite o bloco quando o campo não existe.

### Formatos que o extrator precisou tratar

Os cadernos mudaram de formato ao longo dos anos, e cada diferença já causou um
erro silencioso:

| Caso | Onde aparece | O que quebrava |
| --- | --- | --- |
| Alternativas `( A )` vs `a)` | 2023-2025 vs 2022 e 2026 | questões não eram localizadas |
| **Cinco alternativas (A-E)** | 2026.2 | a alternativa E era engolida pela D |
| Gabarito com **os dois tipos no mesmo PDF** | 2026.2 | a página 2 sobrescrevia a 1 e o gabarito não correspondia a nenhum caderno |
| Numeração por disciplina no gabarito | 2026.2 | Português e Matemática se sobrepunham |
| Questão anulada | 2025.1 A, 2024.1 A, 2023.1 B | a leitura posicional desalinhava e deslocava as respostas seguintes |
| Caracteres de controle no texto | 2026.2 | um BEL (0x07) abria cada alternativa |
| Caderno repetido em duas edições | 2023.1 | Integrado B e Conc/Subs são a mesma prova; entraria duplicada |

### Como conferir

Responder qualquer prova com o gabarito publicado pelo IFSP tem de dar
exatamente 100%. Isso valida enunciado, ordem das alternativas e mapeamento das
respostas de uma vez.

O ponto que mais importa nesse teste: **o gabarito esperado tem de vir do PDF do
IFSP, nunca da extração das questões.** Um teste que usa a própria extração como
referência passa mesmo com o dado errado - foi assim que a prova de 2026.2 quase
entrou com todas as respostas trocadas.

## Carregamento das provas

As ~330 questões somam bem mais de 250 KB de texto. Deixá-las no bundle
principal faria a página de login baixar o enunciado de todas as provas.

Por isso cada prova é um módulo em `mocks/provas/` com `export default`, e o
`catalogo.js` guarda só o resumo (título, ano, contagem) mais um
`carregar: () => import('./...')`. A listagem usa o catálogo; o quiz dispara o
import() da prova escolhida. O bundle inicial fica em ~300 KB e cada prova vira
um chunk de 20-45 KB baixado sob demanda.

## O que é real e o que é mock

O backend hoje só expõe autenticação, então:

| Área | Estado | Endpoint |
| --- | --- | --- |
| Cadastro, login, logout, sessão, perfil | **Real** | `/api/auth/*` |
| Provas e questões | Conteúdo oficial, servido do mock | - |
| Matérias e videoaulas | Mock | - |
| Correção | Mock (calculada no cliente) | - |
| Estatísticas e histórico | Mock (localStorage, por navegador) | - |

Os mocks ficam atrás da mesma assinatura `async` que uma chamada HTTP teria.
Para ligar qualquer um no backend, troque o corpo da função em
`src/api/<recurso>.js` por `http.get(...)` - as telas não mudam.

`src/api/vestibulares.js` já segue o contrato de um backend real:
`iniciarTentativa` devolve as questões **sem** gabarito e só `finalizarTentativa`
revela a resposta correta e a explicação.

## Autenticação

O access token dura 15 minutos e o refresh token **rotaciona** - ao usar
`/auth/refresh`, o backend revoga o antigo e emite um novo par.

`src/api/http.js` cuida disso: ao tomar 401 numa rota protegida ele renova e
repete a chamada. As renovações concorrentes compartilham uma única promise,
porque duas chamadas simultâneas a `/auth/refresh` com o mesmo token fariam a
segunda receber `Refresh token revogado` e derrubar uma sessão válida.

Se a renovação falhar, o client limpa o storage e dispara o evento
`vestibulif:sessao-expirada`, que o `AuthProvider` escuta para deslogar a UI.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Dev server com HMR na 5173 |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o `dist/` (sem o proxy do dev server) |
| `npm run lint` | oxlint |
