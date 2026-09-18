import { useCallback, useEffect, useMemo, useState } from 'react'

import * as authApi from '../api/auth'
import { EVENTO_SESSAO_EXPIRADA } from '../api/http'
import { AuthContext } from './AuthContext'

/**
 * Estado de sessao do app.
 *
 * `carregando` comeca em true porque, ao abrir a pagina, ainda nao sabemos se o
 * token salvo continua valido - so um GET /auth/me responde isso. Renderizar as
 * rotas antes dessa resposta faria a rota protegida chutar o usuario para o
 * login a cada F5.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    async function restaurarSessao() {
      if (!authApi.temSessaoSalva()) {
        if (ativo) setCarregando(false)
        return
      }

      try {
        const atual = await authApi.buscarUsuarioAtual()
        if (ativo) setUsuario(atual)
      } catch {
        // Token invalido/expirado sem refresh possivel: o http.js ja limpou o
        // storage, aqui so garantimos que a UI fique deslogada.
        if (ativo) setUsuario(null)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    restaurarSessao()
    return () => {
      ativo = false
    }
  }, [])

  // O client HTTP avisa quando a renovacao falhou no meio de uma navegacao.
  useEffect(() => {
    function aoExpirar() {
      setUsuario(null)
    }
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar)
    return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar)
  }, [])

  const entrar = useCallback(async ({ email, senha }) => {
    const logado = await authApi.entrar({ email, senha })
    setUsuario(logado)
    return logado
  }, [])

  const cadastrar = useCallback(async ({ nome, email, senha }) => {
    await authApi.registrar({ nome, email, senha })
    // O backend nao devolve token no register, entao emendamos o login para o
    // usuario nao ter que digitar as credenciais de novo.
    const logado = await authApi.entrar({ email, senha })
    setUsuario(logado)
    return logado
  }, [])

  const sair = useCallback(async () => {
    try {
      await authApi.sair()
    } finally {
      setUsuario(null)
    }
  }, [])

  const valor = useMemo(
    () => ({
      usuario,
      autenticado: Boolean(usuario),
      carregando,
      entrar,
      cadastrar,
      sair,
    }),
    [usuario, carregando, entrar, cadastrar, sair],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
