/** Formatadores de exibicao - centralizados para nao espalhar toLocaleString pelas telas. */

const LOCALE = 'pt-BR'

export function formatarData(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString(LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatarDataHora(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Segundos -> "mm:ss" (ou "h:mm:ss" quando passa de uma hora). */
export function formatarCronometro(totalSegundos) {
  const seguros = Math.max(0, Math.floor(totalSegundos || 0))
  const horas = Math.floor(seguros / 3600)
  const minutos = Math.floor((seguros % 3600) / 60)
  const segundos = seguros % 60

  const mm = String(minutos).padStart(2, '0')
  const ss = String(segundos).padStart(2, '0')

  return horas > 0 ? `${horas}:${mm}:${ss}` : `${mm}:${ss}`
}


export function primeiroNome(nomeCompleto) {
  if (!nomeCompleto) return ''
  return nomeCompleto.trim().split(/\s+/)[0]
}

export function iniciais(nomeCompleto) {
  if (!nomeCompleto) return '?'
  const partes = nomeCompleto.trim().split(/\s+/)
  const primeira = partes[0]?.[0] || ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}
