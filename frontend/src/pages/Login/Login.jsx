import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { validarEmail, validarFormulario, validarSenha } from '../../utils/validacao'

export function Login() {
  useTituloDaPagina('Login')

  const { entrar } = useAuth()
  const navegar = useNavigate()
  const localizacao = useLocation()

  const [valores, setValores] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Aviso vindo do cadastro e destino guardado pela rota protegida.
  const aviso = localizacao.state?.aviso
  const destino = localizacao.state?.de?.pathname || CAMINHOS.dashboard

  function aoDigitar(campo) {
    return (evento) => {
      setValores((atual) => ({ ...atual, [campo]: evento.target.value }))
      setErros((atual) => (atual[campo] ? { ...atual, [campo]: null } : atual))
    }
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErroGeral(null)

    const encontrados = validarFormulario(valores, {
      email: validarEmail,
      senha: validarSenha,
    })

    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados)
      return
    }

    setEnviando(true)
    try {
      await entrar({ email: valores.email.trim(), senha: valores.senha })
      navegar(destino, { replace: true })
    } catch (erro) {
      setErroGeral(erro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth-page" id="conteudo-principal">
      <section className="auth-shell">
        <aside className="auth-aside">
          <Link to={CAMINHOS.inicio} className="brand" aria-label="Voltar para a home">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-text">
              <strong>VESTIBULIF PIRACICABA</strong>
              <small>IFSP Campus Piracicaba</small>
            </span>
          </Link>

          <h1>Bem-vindo ao VestibulIF Piracicaba</h1>
          <p>
            Entre para acessar vestibulares, videoaulas, acompanhamento de desempenho e trilhas de
            estudo da área do aluno.
          </p>

          <ul className="auth-metrics">
            <li>Vestibulares organizados por região e campus</li>
            <li>Plano de estudo com videoaulas recomendadas</li>
            <li>Painel com estatísticas e progresso</li>
          </ul>
        </aside>

        <div className="auth-main">
          <h2>Entrar no VestibulIF</h2>
          <p>Use seus dados para continuar para o dashboard do aluno.</p>

          {aviso && <p className="auth-message auth-message-ok">{aviso}</p>}
          {erroGeral && (
            <p className="auth-message auth-message-error" role="alert">
              {erroGeral}
            </p>
          )}

          <form className="auth-form" onSubmit={aoEnviar} noValidate>
            <label>
              E-mail
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="você@email.com"
                value={valores.email}
                onChange={aoDigitar('email')}
                aria-invalid={erros.email ? 'true' : undefined}
                disabled={enviando}
                autoFocus
              />
              {erros.email && <span className="campo-erro">{erros.email}</span>}
            </label>

            <label>
              Senha
              <input
                type="password"
                name="senha"
                autoComplete="current-password"
                placeholder="Sua senha"
                value={valores.senha}
                onChange={aoDigitar('senha')}
                aria-invalid={erros.senha ? 'true' : undefined}
                disabled={enviando}
              />
              {erros.senha && <span className="campo-erro">{erros.senha}</span>}
            </label>

            <button type="submit" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar na área do aluno'}
            </button>
          </form>

          <div className="auth-links">
            <Link to={CAMINHOS.cadastro}>Não tem conta? Cadastre-se</Link>
          </div>

          <Link to={CAMINHOS.inicio} className="return-link">
            Voltar para página inicial
          </Link>
        </div>
      </section>
    </main>
  )
}
