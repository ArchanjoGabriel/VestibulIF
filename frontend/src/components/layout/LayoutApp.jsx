import { Outlet, useLocation } from 'react-router-dom'

import { Cabecalho } from './Cabecalho'
import { Rodape } from './Rodape'
import { CAMINHOS } from '../../routes/caminhos'

/**
 * Casca das paginas.
 *
 * Login e cadastro no site original nao tinham cabecalho nem rodape - a marca
 * aparecia dentro do proprio painel lateral. O layout respeita isso.
 */
export function LayoutApp() {
  const { pathname } = useLocation()
  const telaDeAuth = pathname === CAMINHOS.login || pathname === CAMINHOS.cadastro

  if (telaDeAuth) {
    return (
      <>
        <div className="page-bg" aria-hidden="true" />
        <Outlet />
      </>
    )
  }

  return (
    <>
      <div className="page-bg" aria-hidden="true" />

      <a href="#conteudo-principal" className="pular-navegacao">
        Pular para o conteúdo
      </a>

      <Cabecalho subtitulo={SUBTITULOS[pathname] || rotuloDaSecao(pathname)} />

      <Outlet />

      <Rodape />
    </>
  )
}

const SUBTITULOS = {
  [CAMINHOS.inicio]: 'IFSP Campus Piracicaba',
  [CAMINHOS.dashboard]: 'Área do aluno',
  [CAMINHOS.vestibulares]: 'Vestibulares',
  [CAMINHOS.videoaulas]: 'Videoaulas',
  [CAMINHOS.perfil]: 'Meu perfil',
}

function rotuloDaSecao(pathname) {
  if (pathname.startsWith('/vestibulares')) return 'Vestibulares'
  if (pathname.startsWith('/resultados')) return 'Correção'
  if (pathname.startsWith('/materias')) return 'Videoaulas'
  return 'IFSP Campus Piracicaba'
}
