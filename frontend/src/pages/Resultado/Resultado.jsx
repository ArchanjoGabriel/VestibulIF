import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { BarraMateria, Carregando, EstadoVazio } from '../../components/comuns/Estados'
import { ConteudoAlternativa } from '../../components/comuns/Alternativa'
import { CAMINHOS } from '../../routes/caminhos'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { buscarTentativa } from '../../api/vestibulares'
import { nomeDaMateria } from '../../api/materias'
import { formatarCronometro, formatarDataHora } from '../../utils/formato'

const FILTROS = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'erradas', rotulo: 'Que errei' },
  { id: 'certas', rotulo: 'Que acertei' },
  { id: 'brancos', rotulo: 'Em branco' },
]

export function Resultado() {
  useTituloDaPagina('Correção')

  const { tentativaId } = useParams()
  const { usuario } = useAuth()
  const [filtro, setFiltro] = useState('todas')

  const {
    dados: tentativa,
    carregando,
    erro,
  } = useAsync(() => buscarTentativa(usuario?.id, tentativaId), [usuario?.id, tentativaId])

  if (carregando) {
    return (
      <main className="dashboard-main quiz-main" id="conteudo-principal">
        <Carregando texto="Carregando correção..." />
      </main>
    )
  }

  if (erro || !tentativa) {
    return (
      <main className="dashboard-main quiz-main" id="conteudo-principal">
        <EstadoVazio
          icone="🔍"
          titulo="Resultado não encontrado"
          descricao="Essa tentativa não existe ou foi feita em outro dispositivo."
          acao={
            <Link className="btn-iniciar" to={CAMINHOS.vestibulares}>
              Voltar aos vestibulares
            </Link>
          }
        />
      </main>
    )
  }

  const questoes = tentativa.correcao.filter((item) => {
    if (filtro === 'erradas') return item.marcada && !item.acertou
    if (filtro === 'certas') return item.acertou
    if (filtro === 'brancos') return !item.marcada
    return true
  })

  const emBranco = tentativa.total - tentativa.respondidas

  return (
    <main className="dashboard-main quiz-main" id="conteudo-principal">
      <section className="quiz-resultado">
        <p className="hero-kicker" style={{ color: '#2d7247' }}>
          {tentativa.provaTitulo}
        </p>
        <p className="quiz-resultado-nota">{tentativa.aproveitamento}%</p>
        <h2>
          {tentativa.acertos} de {tentativa.total} questões corretas
        </h2>
        <p style={{ color: 'var(--texto-suave)' }}>{mensagemDeDesempenho(tentativa.aproveitamento)}</p>
        <p style={{ color: '#6a8577', fontSize: '0.85rem', marginTop: 6 }}>
          Finalizado em {formatarDataHora(tentativa.finalizadaEm)}
          {tentativa.segundosGastos != null &&
            ` - tempo: ${formatarCronometro(tentativa.segundosGastos)}`}
        </p>

        <div className="quiz-resultado-acoes">
          <Link className="btn-iniciar" to={CAMINHOS.quiz(tentativa.provaId)}>
            Refazer prova
          </Link>
          <Link className="btn-iniciar btn-secondary" to={CAMINHOS.dashboard}>
            Ir para o painel
          </Link>
        </div>
      </section>

      <section className="dashboard-card">
        <h2>Resumo</h2>
        <div className="stat-grid">
          <div className="stat-item">
            <span>Acertos</span>
            <strong>{tentativa.acertos}</strong>
          </div>
          <div className="stat-item">
            <span>Erros</span>
            <strong>{tentativa.respondidas - tentativa.acertos}</strong>
          </div>
          <div className="stat-item">
            <span>Em branco</span>
            <strong>{emBranco}</strong>
          </div>
          <div className="stat-item">
            <span>Total</span>
            <strong>{tentativa.total}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-card">
        <h2>Desempenho por matéria</h2>
        <p className="dashboard-card-sub">Comece a revisão pelas matérias mais baixas.</p>

        <ul className="lista-barras">
          {[...tentativa.porMateria]
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
      </section>

      <section className="dashboard-card">
        <h2>Correção comentada</h2>

        <div className="correcao-filtros" style={{ marginBottom: 18 }}>
          {FILTROS.map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              className={`filtro-chip ${filtro === opcao.id ? 'ativo' : ''}`}
              onClick={() => setFiltro(opcao.id)}
              aria-pressed={filtro === opcao.id}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>

        {questoes.length === 0 ? (
          <p className="vazio-interno">Nenhuma questão nesse filtro.</p>
        ) : (
          <ol className="correcao-lista">
            {questoes.map((item) => (
              <li key={item.questaoId}>
                <article className={`quiz-card correcao-item ${item.acertou ? '' : 'errou'}`}>
                  <span className="quiz-numero">Questão {item.numero}</span>
                  <span className="quiz-materia">{nomeDaMateria(item.materiaId)}</span>

                  <p className="quiz-enunciado">{item.enunciado}</p>

                  {item.imagem && (
                    <img
                      className="quiz-imagem"
                      src={item.imagem}
                      alt={`Figura da questao ${item.numero}`}
                      loading="lazy"
                    />
                  )}

                  <div className="quiz-alternativas">
                    {Object.entries(item.alternativas).map(([letra, texto]) => {
                      const eCorreta = letra === item.correta
                      const eMarcada = letra === item.marcada
                      const classe = eCorreta ? 'correta' : eMarcada ? 'errada' : ''

                      return (
                        <div className={`quiz-alt ${classe}`} key={letra}>
                          <span className="quiz-alt-letra">{letra}</span>
                          <ConteudoAlternativa letra={letra} alternativa={texto} />

                          {/* Marcadores em texto: cor sozinha nao diz o que aconteceu. */}
                          {eCorreta && <span className="quiz-alt-marca">gabarito</span>}
                          {eMarcada && !eCorreta && (
                            <span className="quiz-alt-marca">sua resposta</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Provas oficiais do IFSP nao publicam justificativa; sem o
                      campo, o bloco simplesmente nao aparece. */}
                  {item.explicacao && (
                    <p className="correcao-explicacao">
                      <strong>Por quê:</strong> {item.explicacao}
                    </p>
                  )}
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}

function mensagemDeDesempenho(valor) {
  if (valor >= 85) return 'Desempenho excelente, mantenha o ritmo.'
  if (valor >= 70) return 'Bom resultado, ajuste os detalhes.'
  if (valor >= 50) return 'No caminho certo, foque nas matérias mais baixas.'
  return 'Hora de revisar a base antes do próximo simulado.'
}
