import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Carregando, EstadoVazio } from '../../components/comuns/Estados'
import { CAMINHOS } from '../../routes/caminhos'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { listarHistorico, listarProvas } from '../../api/vestibulares'
import { nomeDaMateria } from '../../api/materias'
import { formatarDataHora } from '../../utils/formato'

/**
 * O processo do IFSP tem tres modalidades e elas nao servem ao mesmo candidato:
 * so o Integrado da entrada no ensino medio. Filtrar por aqui evita que o aluno
 * do 9o ano treine numa prova que nao e a dele.
 */
const FILTROS_MODALIDADE = [
  { id: 'integrado', rotulo: 'Para entrar no ensino médio', dica: 'Cursos técnicos integrados' },
  { id: 'concomitante', rotulo: 'Já curso ou terminei o médio', dica: 'Concomitante e subsequente' },
  { id: 'todas', rotulo: 'Todas as provas', dica: null },
]

function serveAoIntegrado(prova) {
  return !prova.modalidade || prova.modalidade.includes('Integrado')
}

export function Vestibulares() {
  useTituloDaPagina('Vestibulares')

  const { usuario } = useAuth()
  const [filtro, setFiltro] = useState('integrado')
  const { dados: todasAsProvas, carregando } = useAsync(() => listarProvas(), [])
  const { dados: historico } = useAsync(() => listarHistorico(usuario?.id), [usuario?.id])

  const provas = (todasAsProvas || []).filter((prova) => {
    if (filtro === 'todas') return true
    if (filtro === 'integrado') return serveAoIntegrado(prova)
    return !prova.oficial || prova.modalidade?.includes('Concomitante')
  })

  return (
    <main className="dashboard-main" id="conteudo-principal">
      <section className="dashboard-hero">
        <p className="hero-kicker">simulados</p>
        <h1>Provas de vestibular</h1>
        <p>
          Treine com provas oficiais do IFSP. O processo seletivo é o mesmo em todo o estado - quem
          presta em Piracicaba faz estas provas.
        </p>
      </section>

      <section className="dashboard-card">
        <h2>Qual é o seu caso?</h2>
        <p className="dashboard-card-sub">
          As provas mudam conforme a modalidade do curso. Escolha a sua para ver só o que vale para
          você.
        </p>
        <div className="filtro-chips" style={{ marginBottom: 0 }}>
          {FILTROS_MODALIDADE.map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              className={`filtro-chip ${filtro === opcao.id ? 'ativo' : ''}`}
              onClick={() => setFiltro(opcao.id)}
              aria-pressed={filtro === opcao.id}
              title={opcao.dica || undefined}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      </section>

      {carregando ? (
        <Carregando texto="Carregando provas..." />
      ) : provas?.length ? (
        <section className="provas-grid">
          {provas.map((prova) => {
            const tentativas = (historico || []).filter((t) => t.provaId === prova.id)
            const melhor = tentativas.length
              ? Math.max(...tentativas.map((t) => t.aproveitamento))
              : null

            return (
              <article className="prova-card" key={prova.id}>
                <header>
                  <span className="prova-badge">
                    {prova.instituicao} - {prova.ano}.{prova.semestre}
                  </span>
                  {prova.oficial && <span className="prova-selo">prova oficial</span>}
                  {prova.modalidade && (
                    <p className="prova-modalidade">
                      {prova.modalidade.includes('Integrado')
                        ? 'Serve para entrar no ensino médio'
                        : 'Para quem já cursa ou terminou o ensino médio'}
                    </p>
                  )}
                  <h2>{prova.titulo}</h2>
                </header>

                <p className="prova-desc">{prova.descricao}</p>

                <ul className="prova-materias">
                  {prova.materias.map((materiaId) => (
                    <li className="prova-materia" key={materiaId}>
                      {nomeDaMateria(materiaId)}
                      {prova.porMateria?.[materiaId] ? ` ${prova.porMateria[materiaId]}` : ''}
                    </li>
                  ))}
                </ul>

                <footer>
                  <span className="prova-qtd">
                    {prova.totalQuestoes} questões
                    {melhor !== null && ` - melhor: ${melhor}%`}
                  </span>
                  <Link className="btn-iniciar" to={CAMINHOS.quiz(prova.id)}>
                    {tentativas.length ? 'Refazer prova' : 'Iniciar prova'}
                  </Link>
                </footer>
              </article>
            )
          })}
        </section>
      ) : (
        <EstadoVazio
          icone="📝"
          titulo="Nenhuma prova cadastrada ainda"
          descricao="Volte em breve para novos simulados."
        />
      )}

      {historico?.length > 0 && (
        <section className="dashboard-card">
          <h2>Seu histórico</h2>
          <p className="dashboard-card-sub">Todas as tentativas, da mais recente para a mais antiga.</p>

          <div className="tabela-envolucro">
            <table className="tabela-historico">
              <thead>
                <tr>
                  <th scope="col">Prova</th>
                  <th scope="col">Data</th>
                  <th scope="col">Acertos</th>
                  <th scope="col">Aproveitamento</th>
                  <th scope="col">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {historico.map((tentativa) => (
                  <tr key={tentativa.id}>
                    <td>{tentativa.provaTitulo}</td>
                    <td className="celula-numero">{formatarDataHora(tentativa.finalizadaEm)}</td>
                    <td className="celula-numero">
                      {tentativa.acertos}/{tentativa.total}
                    </td>
                    <td className="celula-numero">
                      <strong>{tentativa.aproveitamento}%</strong>
                    </td>
                    <td>
                      <Link to={CAMINHOS.resultado(tentativa.id)}>Ver correção</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}
