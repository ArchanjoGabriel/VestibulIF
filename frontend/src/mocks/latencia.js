/**
 * Latencia artificial dos mocks.
 *
 * Sem ela as telas resolveriam de forma sincrona e os estados de carregamento
 * nunca apareceriam em desenvolvimento - eles so quebrariam quando o backend
 * real entrasse. Manter o atraso mantem a UI honesta.
 */

const ATRASO_PADRAO_MS = 320

export function comAtraso(valor, ms = ATRASO_PADRAO_MS) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms)
  })
}

/** Copia profunda: impede que a tela mute o "banco" em memoria por engano. */
export function clonar(valor) {
  return structuredClone(valor)
}
