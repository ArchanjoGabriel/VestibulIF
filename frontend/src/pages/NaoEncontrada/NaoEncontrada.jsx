import { Link } from 'react-router-dom'

import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'

export function NaoEncontrada() {
  useTituloDaPagina('Página não encontrada')

  const { autenticado } = useAuth()

  return (
    <main className="dashboard-main" id="conteudo-principal">
      <section className="dashboard-hero">
        <p className="hero-kicker">erro 404</p>
        <h1>Essa página não existe</h1>
        <p>O endereço pode ter mudado ou o link está incorreto. Vamos te levar de volta.</p>

        <div className="dashboard-hero-acoes">
          <Link
            to={autenticado ? CAMINHOS.dashboard : CAMINHOS.inicio}
            className="btn btn-primary"
          >
            {autenticado ? 'Ir para a área do aluno' : 'Voltar ao início'}
          </Link>
          {autenticado && (
            <Link to={CAMINHOS.vestibulares} className="btn btn-ghost">
              Ver vestibulares
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
