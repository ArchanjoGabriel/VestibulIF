/**
 * Rotas de autenticacao - as unicas que hoje batem no backend de verdade.
 * Espelha app/routers/auth_router.py (prefixo /api/auth).
 */

import { http } from './http'
import { gravarTokens, lerTokens, limparTokens } from '../utils/storage'

/** POST /api/auth/register -> 201 { id, name, email } */
export async function registrar({ nome, email, senha }) {
  const usuario = await http.post('/auth/register', {
    name: nome,
    email,
    password: senha,
  })
  return normalizarUsuario(usuario)
}

/** POST /api/auth/login -> { access_token, refresh_token, token_type } */
export async function entrar({ email, senha }) {
  const tokens = await http.post('/auth/login', { email, password: senha })
  gravarTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type || 'Bearer',
  })
  return buscarUsuarioAtual()
}

/** GET /api/auth/me -> { id, name, email } */
export async function buscarUsuarioAtual() {
  const usuario = await http.get('/auth/me', { auth: true })
  return normalizarUsuario(usuario)
}

/**
 * POST /api/auth/logout revoga o refresh token no banco.
 * A limpeza local acontece mesmo se a chamada falhar - um token ja revogado ou
 * expirado devolve 401, e travar o usuario logado por causa disso seria pior.
 */
export async function sair() {
  const tokens = lerTokens()
  try {
    if (tokens) {
      await http.post('/auth/logout', { refresh_token: tokens.refreshToken })
    }
  } finally {
    limparTokens()
  }
}

/** GET /api/health -> { status } */
export function verificarSaude() {
  return http.get('/health')
}

export function temSessaoSalva() {
  return Boolean(lerTokens())
}

function normalizarUsuario(usuario) {
  if (!usuario) return null
  return {
    id: usuario.id,
    nome: usuario.name,
    email: usuario.email,
  }
}
