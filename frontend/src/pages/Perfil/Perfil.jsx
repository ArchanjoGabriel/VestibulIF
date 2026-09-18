import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Carregando } from '../../components/comuns/Estados'
import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { useAsync } from '../../hooks/useAsync'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { resumoDoUsuario } from '../../api/estatisticas'
import { limparTentativas } from '../../mocks/progresso'
import { iniciais } from '../../utils/formato'

export function Perfil() {
  useTituloDaPagina('Meu perfil')

  const { usuario, sair } = useAuth()
  const navegar = useNavigate()

  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false)
  const [mensagem, setMensagem] = useState(null)
  const [saindo, setSaindo] = useState(false)

  const {
    dados: resumo,
    carregando,
    recarregar,
  } = useAsync(() => resumoDoUsuario(usuario?.id), [usuario?.id])

  async function aoSair() {
    setSaindo(true)
    try {
      await sair()
      navegar(CAMINHOS.login, { replace: true })
    } finally {
      setSaindo(false)
    }
  }

  function apagarHistorico() {
    limparTentativas(usuario?.id)
    setConfirmandoLimpeza(false)
    setMensagem('Histórico de simulados apagado.')
    recarregar()
  }

  if (carregando) {
    return (
      <main className="dashboard-main" id="conteudo-principal">
        <Carregando texto="Carregando perfil..." />
      </main>
    )
  }

  return (
    <main className="dashboard-main" id="conteudo-principal">
      <section className="dashboard-hero">
        <p className="hero-kicker">minha conta</p>
        <h1>Meu perfil</h1>
        <p>Seus dados de cadastro e o resumo dos seus estudos no VestibulIF.</p>
      </section>

      {mensagem && <p className="auth-message auth-message-ok">{mensagem}</p>}

      <section className="dashboard-card">
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
        >
          <span
            className="header-user-avatar"
            style={{ width: 64, height: 64, fontSize: '1.3rem' }}
            aria-hidden="true"
          >
            {iniciais(usuario?.nome)}
          </span>

          <div style={{ flex: 1, minWidth: 180 }}>
            <h2 style={{ margin: 0 }}>{usuario?.nome}</h2>
            <p className="dashboard-card-sub" style={{ margin: '4px 0 0' }}>
              {usuario?.email} - conta #{usuario?.id}
            </p>
          </div>

          <button type="button" className="btn-iniciar btn-secondary" onClick={aoSair} disabled={saindo}>
            {saindo ? 'Saindo...' : 'Sair da conta'}
          </button>
        </div>
      </section>

      <section className="dashboard-card">
        <h2>Resumo dos estudos</h2>
        <div className="stat-grid">
          <div className="stat-item">
            <span>Simulados feitos</span>
            <strong>{resumo?.simulados ?? 0}</strong>
          </div>
          <div className="stat-item">
            <span>Questões respondidas</span>
            <strong>{resumo?.questoesRespondidas ?? 0}</strong>
          </div>
          <div className="stat-item">
            <span>Acertos</span>
            <strong>{resumo?.acertos ?? 0}</strong>
          </div>
          <div className="stat-item">
            <span>Taxa de acertos</span>
            <strong>{resumo?.aproveitamento ?? 0}%</strong>
          </div>
        </div>

        <p className="dashboard-card-sub" style={{ margin: '18px 0 0' }}>
          Quer treinar mais? <Link to={CAMINHOS.vestibulares}>Escolha uma prova</Link> ou{' '}
          <Link to={CAMINHOS.videoaulas}>reveja as videoaulas</Link>.
        </p>
      </section>

      <section className="dashboard-card">
        <h2>Apagar histórico de simulados</h2>
        <p className="dashboard-card-sub">
          Remove suas tentativas e zera as estatísticas. A conta continua ativa.
        </p>

        {confirmandoLimpeza ? (
          <>
            <p className="quiz-feedback erro">
              Isso apaga {resumo?.simulados ?? 0} tentativa(s) e nao pode ser desfeito.
            </p>
            <div className="quiz-nav" style={{ justifyContent: 'flex-start', marginTop: 14 }}>
              <button
                type="button"
                className="btn-quiz btn-secondary"
                onClick={() => setConfirmandoLimpeza(false)}
              >
                Cancelar
              </button>
              <button type="button" className="btn-quiz" onClick={apagarHistorico}>
                Apagar histórico
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="btn-quiz btn-secondary"
            onClick={() => setConfirmandoLimpeza(true)}
            disabled={!resumo?.simulados}
          >
            Apagar histórico
          </button>
        )}
      </section>
    </main>
  )
}
