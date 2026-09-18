import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import {
  MIN_SENHA,
  validarConfirmacao,
  validarEmail,
  validarFormulario,
  validarNome,
  validarSenha,
} from '../../utils/validacao'

export function Cadastro() {
  useTituloDaPagina('Cadastro')

  const { cadastrar } = useAuth()
  const navegar = useNavigate()

  const [valores, setValores] = useState({ nome: '', email: '', senha: '', confirmacao: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState(null)
  const [enviando, setEnviando] = useState(false)

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
      nome: validarNome,
      email: validarEmail,
      senha: validarSenha,
      confirmacao: (valor, todos) => validarConfirmacao(todos.senha, valor),
    })

    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados)
      return
    }

    setEnviando(true)
    try {
      await cadastrar({
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        senha: valores.senha,
      })
      navegar(CAMINHOS.dashboard, { replace: true })
    } catch (erro) {
      // 409 significa e-mail ja cadastrado: aponta para o campo certo.
      if (erro.status === 409) {
        setErros((atual) => ({ ...atual, email: 'Esse e-mail já está cadastrado.' }))
      } else {
        setErroGeral(erro.message)
      }
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

          <h1>Crie sua conta no VestibulIF</h1>
          <p>
            O cadastro é gratuito e dá acesso a simulados corrigidos, videoaulas por matéria e ao
            acompanhamento do seu desempenho.
          </p>

          <ul className="auth-metrics">
            <li>Provas do processo seletivo com correção comentada</li>
            <li>Videoaulas organizadas pelos tópicos que mais caem</li>
            <li>Estatísticas para saber o que estudar em seguida</li>
          </ul>
        </aside>

        <div className="auth-main">
          <h2>Criar conta</h2>
          <p>Preencha seus dados para entrar na área do aluno.</p>

          {erroGeral && (
            <p className="auth-message auth-message-error" role="alert">
              {erroGeral}
            </p>
          )}

          <form className="auth-form" onSubmit={aoEnviar} noValidate>
            <label>
              Nome completo
              <input
                type="text"
                name="nome"
                autoComplete="name"
                placeholder="Como você quer ser chamado"
                value={valores.nome}
                onChange={aoDigitar('nome')}
                aria-invalid={erros.nome ? 'true' : undefined}
                disabled={enviando}
                autoFocus
              />
              {erros.nome && <span className="campo-erro">{erros.nome}</span>}
            </label>

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
              />
              {erros.email && <span className="campo-erro">{erros.email}</span>}
            </label>

            <label>
              Senha
              <input
                type="password"
                name="senha"
                autoComplete="new-password"
                placeholder="Crie uma senha"
                value={valores.senha}
                onChange={aoDigitar('senha')}
                aria-invalid={erros.senha ? 'true' : undefined}
                disabled={enviando}
              />
              {erros.senha ? (
                <span className="campo-erro">{erros.senha}</span>
              ) : (
                <span className="campo-dica">Mínimo de {MIN_SENHA} caracteres.</span>
              )}
            </label>

            <label>
              Confirmar senha
              <input
                type="password"
                name="confirmacao"
                autoComplete="new-password"
                placeholder="Repita a senha"
                value={valores.confirmacao}
                onChange={aoDigitar('confirmacao')}
                aria-invalid={erros.confirmacao ? 'true' : undefined}
                disabled={enviando}
              />
              {erros.confirmacao && <span className="campo-erro">{erros.confirmacao}</span>}
            </label>

            <button type="submit" disabled={enviando}>
              {enviando ? 'Criando conta...' : 'Criar conta e entrar'}
            </button>
          </form>

          <div className="auth-links">
            <Link to={CAMINHOS.login}>Já tem conta? Entrar</Link>
          </div>

          <Link to={CAMINHOS.inicio} className="return-link">
            Voltar para página inicial
          </Link>
        </div>
      </section>
    </main>
  )
}
