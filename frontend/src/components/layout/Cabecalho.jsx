import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { iniciais, primeiroNome } from '../../utils/formato'

const LINKS_PRIVADOS = [
  { para: CAMINHOS.dashboard, rotulo: 'Painel' },
  { para: CAMINHOS.vestibulares, rotulo: 'Vestibulares' },
  { para: CAMINHOS.videoaulas, rotulo: 'Videoaulas' },
]

const LINKS_PUBLICOS = [
  { href: '#instituto', rotulo: 'IFSP Piracicaba' },
  { href: '#mapa', rotulo: 'Mapa dos IFs' },
  { href: '#trilhas', rotulo: 'Trilhas' },
  { href: '#cursos', rotulo: 'Cursos' },
  { href: '#faq', rotulo: 'FAQ' },
  { href: '#sobre', rotulo: 'Sobre nós' },
]

/**
 * Cabecalho fixo em pilula verde, igual ao do site original.
 *
 * Deslogado ele mostra as ancoras da home; logado, a navegacao da area do aluno.
 */
export function Cabecalho({ subtitulo = 'IFSP Campus Piracicaba' }) {
  const { autenticado, usuario, sair } = useAuth()
  const navegar = useNavigate()
  const localizacao = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)
  const [saindo, setSaindo] = useState(false)

  // Trocar de rota com o menu aberto deixaria o painel cobrindo a pagina nova.
  useEffect(() => {
    setMenuAberto(false)
  }, [localizacao.pathname])

  async function aoSair() {
    setSaindo(true)
    try {
      await sair()
      navegar(CAMINHOS.login, { replace: true })
    } finally {
      setSaindo(false)
    }
  }

  return (
    <header className="site-header">
      <Link
        to={autenticado ? CAMINHOS.dashboard : CAMINHOS.inicio}
        className="brand"
        aria-label="VestibulIF Piracicaba"
      >
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-text">
          <strong>VESTIBULIF PIRACICABA</strong>
          <small>{subtitulo}</small>
        </span>
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuAberto}
        onClick={() => setMenuAberto((v) => !v)}
      >
        Menu
      </button>

      <nav className={`main-nav ${menuAberto ? 'open' : ''}`} id="main-nav">
        {autenticado ? (
          LINKS_PRIVADOS.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.rotulo}
            </NavLink>
          ))
        ) : (
          <>
            {LINKS_PUBLICOS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.rotulo}
              </a>
            ))}

            {/* No mobile os botoes da direita somem; sem estes dois o visitante
                ficaria sem caminho visivel para entrar ou se cadastrar. */}
            <Link to={CAMINHOS.login} className="nav-auth">
              Entrar
            </Link>
            <Link to={CAMINHOS.cadastro} className="nav-auth">
              Criar conta
            </Link>
          </>
        )}
      </nav>

      {autenticado ? (
        <div className="header-acoes">
          <Link to={CAMINHOS.perfil} className="header-user" title={usuario?.nome}>
            <span className="header-user-avatar" aria-hidden="true">
              {iniciais(usuario?.nome)}
            </span>
            <span className="header-user-nome">{primeiroNome(usuario?.nome)}</span>
          </Link>
          <button type="button" className="cta-top" onClick={aoSair} disabled={saindo}>
            {saindo ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      ) : (
        <div className="header-acoes cta-publica">
          <Link className="link-entrar" to={CAMINHOS.login}>
            Entrar
          </Link>
          <Link className="cta-top" to={CAMINHOS.cadastro}>
            Criar conta
          </Link>
        </div>
      )}
    </header>
  )
}
