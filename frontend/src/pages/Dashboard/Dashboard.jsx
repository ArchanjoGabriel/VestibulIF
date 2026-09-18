import { Link } from 'react-router-dom'

import { Carregando, BarraMateria } from '../../components/comuns/Estados'
import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { useAsync } from '../../hooks/useAsync'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { resumoDoUsuario } from '../../api/estatisticas'
import { listarProvas } from '../../api/vestibulares'
import { formatarDataHora, primeiroNome } from '../../utils/formato'

const PLANO_SEMANAL = [
  { dia: 'Segunda', atividade: 'Simulado de Linguagens e Humanas' },
  { dia: 'Quarta', atividade: 'Revisão de Matemática e exercícios' },
  { dia: 'Sexta', atividade: 'Videoaula + questões comentadas' },
  { dia: 'Sabado', atividade: 'Redação com tema atual' },
]

export function Dashboard() {
  useTituloDaPagina('Área do aluno')

  const { usuario } = useAuth()

  const { dados: resumo, carregando: carregandoResumo } = useAsync(
    () => resumoDoUsuario(usuario?.id),
    [usuario?.id],
  )
  const { dados: provas, carregando: carregandoProvas } = useAsync(() => listarProvas(), [])

  if (carregandoResumo || carregandoProvas) {
    return (
      <main className="dashboard-main" id="conteudo-principal">
        <Carregando texto="Montando seu painel..." />
      </main>
    )
  }

  const semHistorico = !resumo || resumo.simulados === 0

  return (
    <main className="dashboard-main" id="conteudo-principal">
      <section className="dashboard-hero">
        <p className="hero-kicker">painel do estudante</p>
        <h1>Ola, {primeiroNome(usuario?.nome) || 'estudante'}!</h1>
        <p>
          {semHistorico
            ? 'Você ainda não fez nenhum simulado. Comece por uma prova e acompanhe sua evolução aqui.'
            : 'Continue suas videoaulas e monitore sua evolução com dados de desempenho em um único lugar.'}
        </p>
        <div className="dashboard-hero-acoes">
          <Link to={CAMINHOS.vestibulares} className="btn btn-primary">
            {semHistorico ? 'Fazer primeiro simulado' : 'Novo simulado'}
          </Link>
          <Link to={CAMINHOS.videoaulas} className="btn btn-ghost">
            Ver videoaulas
          </Link>
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid-igual">
        <article className="dashboard-card" id="estatísticas">
          <h2>Estatísticas do aluno</h2>
          <div className="stat-grid">
            <div className="stat-item">
              <span>Taxa de acertos</span>
              <strong>{resumo.aproveitamento}%</strong>
            </div>
            <div className="stat-item">
              <span>Questões respondidas</span>
              <strong>{resumo.questoesRespondidas}</strong>
            </div>
            <div className="stat-item">
              <span>Simulados feitos</span>
              <strong>{resumo.simulados}</strong>
            </div>
            <div className="stat-item">
              <span>Dias seguidos</span>
              <strong>{resumo.sequenciaDias}</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <h2>Evolução</h2>
          <p className="dashboard-card-sub">
            Aproveitamento de cada simulado, do mais antigo ao mais recente.
          </p>

          {semHistorico ? (
            <p className="vazio-interno">Seu gráfico aparece depois do primeiro simulado.</p>
          ) : (
            <Evolucao pontos={resumo.evolucao} />
          )}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid-igual">
        <article className="dashboard-card">
          <h2>Desempenho por matéria</h2>
          <p className="dashboard-card-sub">Onde vale investir mais tempo de estudo.</p>

          {semHistorico || resumo.porMateria.length === 0 ? (
            <p className="vazio-interno">Termine um simulado para ver a divisão por matéria.</p>
          ) : (
            <ul className="lista-barras">
              {[...resumo.porMateria]
                .sort((a, b) => a.aproveitamento - b.aproveitamento)
                .map((materia) => (
                  <li key={materia.materiaId}>
                    <BarraMateria
                      nome={materia.nome}
                      detalhe={`${materia.acertos}/${materia.total}`}
                      valor={materia.aproveitamento}
                    />
                  </li>
                ))}
            </ul>
          )}
        </article>

        <article className="dashboard-card" id="plano">
          <h2>Plano de estudos da semana</h2>
          <ul className="schedule-list">
            {PLANO_SEMANAL.map((item) => (
              <li key={item.dia}>
                <strong>{item.dia}</strong> - {item.atividade}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="dashboard-card">
        <h2>Simulados disponíveis</h2>
        <p className="dashboard-card-sub">
          Escolha uma prova para treinar. A correção sai na hora, com explicação de cada questão.
        </p>

        <div className="provas-grid">
          {provas.slice(0, 3).map((prova) => (
            <article className="prova-card" key={prova.id}>
              <header>
                <span className="prova-badge">
                  {prova.instituicao} - {prova.ano}.{prova.semestre}
                </span>
                <h2>{prova.titulo}</h2>
              </header>
              <p className="prova-desc">{prova.descricao}</p>
              <footer>
                <span className="prova-qtd">{prova.totalQuestoes} questões</span>
                <Link className="btn-iniciar" to={CAMINHOS.quiz(prova.id)}>
                  Iniciar prova
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {!semHistorico && (
        <section className="dashboard-card">
          <h2>Último resultado</h2>
          <ul className="resource-list">
            <li>
              <div className="resource-list-topo">
                <strong>{resumo.ultimaTentativa.provaTitulo}</strong>
                <span className="resource-list-valor">
                  {resumo.ultimaTentativa.aproveitamento}%
                </span>
              </div>
              <div className="progress-track">
                <span
                  className="progress-fill"
                  style={{ width: `${resumo.ultimaTentativa.aproveitamento}%` }}
                />
              </div>
              <p className="dashboard-card-sub" style={{ margin: '10px 0 0' }}>
                {formatarDataHora(resumo.ultimaTentativa.finalizadaEm)} -{' '}
                {resumo.ultimaTentativa.acertos} de {resumo.ultimaTentativa.total} acertos -{' '}
                <Link to={CAMINHOS.resultado(resumo.ultimaTentativa.id)}>ver correção</Link>
              </p>
            </li>
          </ul>
        </section>
      )}
    </main>
  )
}

/**
 * Uma barra por simulado.
 *
 * Barras e nao linha porque cada simulado e um evento discreto - e barras
 * acompanham o redimensionamento do cartao sem deformar, o que um marcador
 * circular esticado por viewBox nao faria.
 */
function Evolucao({ pontos }) {
  if (!pontos?.length) return null

  const variacao = pontos[pontos.length - 1].aproveitamento - pontos[0].aproveitamento

  return (
    <figure style={{ margin: 0 }}>
      <div
        className="evolucao"
        role="img"
        aria-label={`Aproveitamento em ${pontos.length} simulados, do mais antigo ao mais recente: ${pontos
          .map((p) => `${p.aproveitamento}%`)
          .join(', ')}.`}
      >
        {pontos.map((ponto, indice) => (
          <div className="evolucao-coluna" key={ponto.tentativaId}>
            <span className="evolucao-valor">{ponto.aproveitamento}%</span>

            {/* A trilha absorve a altura que sobra: uma barra em 100% nao
                empurra o rotulo para fora do cartao. */}
            <div className="evolucao-trilha">
              <div
                className="evolucao-barra"
                style={{ height: `${Math.max(ponto.aproveitamento, 2)}%` }}
                title={`${ponto.provaTitulo}: ${ponto.aproveitamento}%`}
              />
            </div>

            <span className="evolucao-indice">{indice + 1}</span>
          </div>
        ))}
      </div>

      <figcaption className="evolucao-legenda">
        {pontos.length === 1
          ? 'Faça mais um simulado para comparar sua evolução.'
          : `Do primeiro ao ultimo simulado: ${variacao >= 0 ? '+' : ''}${variacao} pontos percentuais.`}
      </figcaption>
    </figure>
  )
}
