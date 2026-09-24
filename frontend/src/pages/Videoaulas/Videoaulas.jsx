import { Link } from 'react-router-dom'

import { Carregando } from '../../components/comuns/Estados'
import { CAMINHOS } from '../../routes/caminhos'
import { useAsync } from '../../hooks/useAsync'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { contarAulas, listarMaterias } from '../../api/materias'

/** Hub de videoaulas: um cartao grande por materia, como no site original. */
export function Videoaulas() {
  useTituloDaPagina('Videoaulas')

  const { dados: materias, carregando } = useAsync(() => listarMaterias(), [])

  return (
    <main className="dashboard-main" id="conteudo-principal">
      <section className="dashboard-hero">
        <p className="hero-kicker">videoaulas por matéria</p>
        <h1>Estude com videoaulas selecionadas</h1>
        <p>
          Assista às aulas organizadas por matéria para se preparar para o processo seletivo do IFSP
          Piracicaba.
        </p>
      </section>

      {carregando ? (
        <Carregando texto="Carregando matérias..." />
      ) : (
        <div className="video-grid materia-grid">
          {materias.map((materia) => (
            <Link
              key={materia.id}
              to={CAMINHOS.materia(materia.id)}
              className="video-card materia-card"
            >
              <div className="materia-icon" aria-hidden="true">
                {materia.icone}
              </div>
              <p className="video-title">{materia.nomeCurto}</p>
              <small>
                {materia.secoes.length} temas - {contarAulas(materia)} aulas
              </small>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
