/**
 * Client HTTP do app.
 *
 * Responsabilidades:
 *   1. Montar a URL a partir de VITE_API_BASE_URL e serializar JSON.
 *   2. Anexar o header Authorization nas rotas protegidas.
 *   3. Renovar o access token quando o backend devolve 401 e repetir a chamada.
 *   4. Avisar o app quando a sessao morreu de vez.
 *
 * O access token do backend vive 15 minutos (ACCESS_TOKEN_EXPIRE_MINUTES em
 * app/core/security.py), entao o passo 3 nao e um caso raro: e o caminho normal
 * de quem deixa a aba aberta.
 */

import { ApiError, mensagemDeErro } from './erros'
import { gravarTokens, lerTokens, limparTokens } from '../utils/storage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/** Evento disparado quando o refresh falha e o usuario precisa logar de novo. */
export const EVENTO_SESSAO_EXPIRADA = 'vestibulif:sessao-expirada'

function avisarSessaoExpirada() {
  window.dispatchEvent(new CustomEvent(EVENTO_SESSAO_EXPIRADA))
}

async function lerCorpo(resposta) {
  if (resposta.status === 204) return null
  const tipo = resposta.headers.get('content-type') || ''
  if (!tipo.includes('application/json')) {
    const texto = await resposta.text()
    return texto || null
  }
  try {
    return await resposta.json()
  } catch {
    return null
  }
}

/**
 * Uma unica renovacao em voo por vez.
 *
 * O backend revoga o refresh token usado e emite um novo (rotacao, ver
 * AuthService.refresh_token). Se duas requisicoes tomassem 401 juntas e cada uma
 * chamasse /refresh com o mesmo token, a segunda receberia "Refresh token
 * revogado" e derrubaria uma sessao que estava perfeitamente viva. Por isso as
 * concorrentes esperam a mesma promise.
 */
let renovacaoEmVoo = null

async function renovarTokens() {
  const tokens = lerTokens()
  if (!tokens) throw new ApiError('Sem sessão ativa.', { status: 401 })

  const resposta = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: tokens.refreshToken }),
  })

  const corpo = await lerCorpo(resposta)

  if (!resposta.ok) {
    throw new ApiError(mensagemDeErro(corpo, resposta.status), {
      status: resposta.status,
      detalhes: corpo,
    })
  }

  const novos = {
    accessToken: corpo.access_token,
    refreshToken: corpo.refresh_token,
    tokenType: corpo.token_type || 'Bearer',
  }
  gravarTokens(novos)
  return novos
}

function renovarUmaVez() {
  if (!renovacaoEmVoo) {
    renovacaoEmVoo = renovarTokens().finally(() => {
      renovacaoEmVoo = null
    })
  }
  return renovacaoEmVoo
}

async function enviar(caminho, { method, body, auth, signal }) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (auth) {
    const tokens = lerTokens()
    if (tokens) {
      headers.Authorization = `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}`
    }
  }

  try {
    return await fetch(`${BASE_URL}${caminho}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro
    // fetch so rejeita quando nao houve resposta: backend fora do ar, proxy
    // do Vite sem alvo ou rede caida.
    throw new ApiError(
      'Não foi possível falar com o servidor. Verifique se o backend está rodando.',
      { status: 0, causa: erro },
    )
  }
}

export async function request(caminho, { method = 'GET', body, auth = false, signal } = {}) {
  let resposta = await enviar(caminho, { method, body, auth, signal })

  // 401 numa rota protegida significa access token vencido: renova e repete.
  if (resposta.status === 401 && auth && lerTokens()) {
    try {
      await renovarUmaVez()
    } catch (erro) {
      limparTokens()
      avisarSessaoExpirada()
      throw new ApiError('Sua sessão expirou. Entre novamente.', {
        status: 401,
        causa: erro,
      })
    }
    resposta = await enviar(caminho, { method, body, auth, signal })
  }

  const corpo = await lerCorpo(resposta)

  if (!resposta.ok) {
    // 401 que sobreviveu ao retry: o problema nao era o access token.
    if (resposta.status === 401 && auth) {
      limparTokens()
      avisarSessaoExpirada()
    }
    throw new ApiError(mensagemDeErro(corpo, resposta.status), {
      status: resposta.status,
      detalhes: corpo,
    })
  }

  return corpo
}

export const http = {
  get: (caminho, opcoes) => request(caminho, { ...opcoes, method: 'GET' }),
  post: (caminho, body, opcoes) => request(caminho, { ...opcoes, method: 'POST', body }),
  put: (caminho, body, opcoes) => request(caminho, { ...opcoes, method: 'PUT', body }),
  delete: (caminho, opcoes) => request(caminho, { ...opcoes, method: 'DELETE' }),
}
