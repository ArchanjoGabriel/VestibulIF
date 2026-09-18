/**
 * Persistencia das tentativas de simulado enquanto o backend nao tem essas rotas.
 *
 * Fica separado dos dados estaticos porque isto e o unico mock que *escreve*:
 * quando /api/vestibulares/tentativas existir, so este arquivo sai de cena.
 * As tentativas sao guardadas por usuario para que duas contas na mesma maquina
 * nao misturem historico.
 */

const CHAVE = 'vestibulif:tentativas'

function lerTudo() {
  try {
    const bruto = window.localStorage.getItem(CHAVE)
    const dados = bruto ? JSON.parse(bruto) : {}
    return dados && typeof dados === 'object' ? dados : {}
  } catch {
    return {}
  }
}

function gravarTudo(dados) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(dados))
  } catch {
    // Sem espaco ou storage bloqueado: o simulado ainda funciona, so nao guarda historico.
  }
}

function chaveUsuario(usuarioId) {
  return String(usuarioId ?? 'anonimo')
}

export function listarTentativas(usuarioId) {
  const tudo = lerTudo()
  const tentativas = tudo[chaveUsuario(usuarioId)]
  return Array.isArray(tentativas) ? tentativas : []
}

export function salvarTentativa(usuarioId, tentativa) {
  const tudo = lerTudo()
  const chave = chaveUsuario(usuarioId)
  const anteriores = Array.isArray(tudo[chave]) ? tudo[chave] : []
  // Mais recente primeiro e teto de 50 para o storage nao crescer sem limite.
  tudo[chave] = [tentativa, ...anteriores].slice(0, 50)
  gravarTudo(tudo)
  return tentativa
}

export function limparTentativas(usuarioId) {
  const tudo = lerTudo()
  delete tudo[chaveUsuario(usuarioId)]
  gravarTudo(tudo)
}
