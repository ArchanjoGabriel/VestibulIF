import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { CAMINHOS } from './caminhos'
import { Carregando } from '../components/comuns/Estados'

/**
 * Rota que exige sessao.
 *
 * Enquanto `carregando` for true nao se decide nada: nesse instante o app ainda
 * esta perguntando ao /auth/me se o token salvo vale, e redirecionar aqui
 * expulsaria para o login todo usuario que apertasse F5.
 *
 * Ao barrar, guarda a rota tentada em `state.de` para devolver o usuario ao
 * destino original depois do login.
 */
export function RotaProtegida() {
  const { autenticado, carregando } = useAuth()
  const localizacao = useLocation()

  if (carregando) {
    return (
      <main className="dashboard-main">
        <Carregando texto="Verificando sua sessão..." />
      </main>
    )
  }

  if (!autenticado) {
    return <Navigate to={CAMINHOS.login} state={{ de: localizacao }} replace />
  }

  return <Outlet />
}

/** Inverso: quem ja esta logado nao deve ver login/cadastro. */
export function RotaPublica() {
  const { autenticado, carregando } = useAuth()

  if (carregando) {
    return (
      <main className="dashboard-main">
        <Carregando />
      </main>
    )
  }

  if (autenticado) {
    return <Navigate to={CAMINHOS.dashboard} replace />
  }

  return <Outlet />
}
