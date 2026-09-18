import { createContext } from 'react'

/**
 * O contexto mora sozinho neste arquivo, separado do provider.
 *
 * O Fast Refresh do Vite so preserva estado quando um modulo exporta apenas
 * componentes; misturar o contexto com o <AuthProvider> faria toda edicao no
 * provider recarregar a pagina inteira e derrubar a sessao em desenvolvimento.
 */
export const AuthContext = createContext(null)
