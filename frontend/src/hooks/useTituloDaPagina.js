import { useEffect } from 'react'

const SUFIXO = 'VestibulIF'

/** Mantem o <title> coerente com a rota - ajuda navegacao por abas e historico. */
export function useTituloDaPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | ${SUFIXO}` : SUFIXO
  }, [titulo])
}
