/**
 * Normaliza as respostas de erro do FastAPI numa unica forma para a UI.
 *
 * O backend responde de duas maneiras diferentes:
 *   - HTTPException  -> { "detail": "Email ou senha incorretos" }
 *   - erro do Pydantic -> { "detail": [ { loc, msg, type }, ... ] }
 * Renderizar o segundo formato direto na tela mostraria "[object Object]".
 */

export class ApiError extends Error {
  constructor(mensagem, { status, detalhes = null, causa = null } = {}) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
    this.detalhes = detalhes
    this.causa = causa
  }

  /** Falha de rede/proxy: nao houve resposta HTTP. */
  get semResposta() {
    return this.status === 0
  }
}

const MENSAGENS_POR_STATUS = {
  400: 'Requisição inválida.',
  401: 'Sessão expirada. Entre novamente.',
  403: 'Você não tem permissão para acessar isto.',
  404: 'Não encontramos o que você procura.',
  409: 'Esse registro já existe.',
  422: 'Confira os dados preenchidos.',
  500: 'Erro no servidor. Tente de novo em instantes.',
}

export function mensagemDeErro(corpo, status) {
  const detail = corpo?.detail

  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  // Erro de validacao do Pydantic: junta as mensagens de cada campo.
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => {
        const campo = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null
        return campo && campo !== 'body' ? `${campo}: ${item.msg}` : item.msg
      })
      .filter(Boolean)
      .join(' | ')
  }

  return MENSAGENS_POR_STATUS[status] || `Erro inesperado (HTTP ${status}).`
}
