/**
 * Unico ponto que fala com o localStorage.
 *
 * O par de tokens e gravado junto porque o backend rotaciona o refresh a cada
 * /api/auth/refresh: gravar so o access deixaria o refresh antigo (ja revogado)
 * no disco e o proximo refresh falharia com 401.
 */

const CHAVE_TOKENS = 'vestibulif:tokens'

function lerJson(chave) {
  try {
    const bruto = window.localStorage.getItem(chave)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    // Storage indisponivel (modo privado) ou JSON corrompido: trata como deslogado.
    return null
  }
}

function gravarJson(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // Sem persistencia a sessao vale so para a aba atual - nao e motivo de erro.
  }
}

export function lerTokens() {
  const tokens = lerJson(CHAVE_TOKENS)
  if (!tokens?.accessToken || !tokens?.refreshToken) return null
  return tokens
}

export function gravarTokens({ accessToken, refreshToken, tokenType = 'Bearer' }) {
  gravarJson(CHAVE_TOKENS, { accessToken, refreshToken, tokenType })
}

export function limparTokens() {
  try {
    window.localStorage.removeItem(CHAVE_TOKENS)
  } catch {
    // idem
  }
}
