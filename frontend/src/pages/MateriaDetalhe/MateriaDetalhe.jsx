import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Carregando, EstadoVazio } from '../../components/comuns/Estados'
import { CAMINHOS } from '../../routes/caminhos'
import { useAsync } from '../../hooks/useAsync'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { buscarMateria } from '../../api/materias'

/** Videoaulas de uma materia, agrupadas por tema, com player em modal. */
export function MateriaDetalhe() {
  const { materiaId } = useParams()
  const [aulaAberta, setAulaAberta] = useState(null)

  const { dados: materia, carregando, erro } = useAsync(() => buscarMateria(materiaId), [materiaId])

  useTituloDaPagina(materia?.nomeCurto)

  const fechar = useCallback(() => setAulaAberta(null), [])

  // Trocar de materia com o modal aberto deixaria o player sobre a pagina nova.
  useEffect(() => {
    setAulaAberta(null)
  }, [materiaId])

  useEffect(() => {
    if (!aulaAberta) return

    function aoTeclar(evento) {
      if (evento.key === 'Escape') fechar()
    }

    document.addEventListener('keydown', aoTeclar)
    // Trava o scroll do fundo enquanto o video esta aberto.
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowAnterior
    }
  }, [aulaAberta, fechar])

  if (carregando) {
    return (
      <main className="dashboard-main" id="conteudo-principal">
        <Carregando texto="Carregando videoaulas..." />
      </main>
    )
  }

  if (erro || !materia) {
    return (
      <main className="dashboard-main" id="conteudo-principal">
        <EstadoVazio
          icone="🔍"
          titulo="Matéria não encontrada"
          descricao="O endereço pode estar errado."
          acao={
            <Link className="btn-iniciar" to={CAMINHOS.videoaulas}>
              Voltar para videoaulas
            </Link>
          }
        />
      </main>
    )
  }

  return (
    <main className="dashboard-main" id="conteudo-principal">
      <section className="dashboard-hero">
        <p className="hero-kicker">{materia.kicker}</p>
        <h1>{materia.nome}</h1>
        <p>{materia.resumo}</p>
      </section>

      {materia.secoes.map((secao) => (
        <section className="videoaulas-section" key={secao.id}>
          <h2>{secao.titulo}</h2>

          <div className="video-grid">
            {secao.aulas.map((aula) => (
              <button
                type="button"
                className="video-card"
                key={aula.id}
                onClick={() => setAulaAberta(aula)}
                aria-label={`Assistir: ${aula.titulo}`}
              >
                <div
                  className="video-thumb has-video"
                  style={{
                    backgroundImage: `url(https://img.youtube.com/vi/${aula.videoId}/hqdefault.jpg)`,
                  }}
                />
                <p className="video-title">{aula.titulo}</p>
              </button>
            ))}
          </div>
        </section>
      ))}

      {aulaAberta && (
        <div
          className="video-modal active"
          role="dialog"
          aria-modal="true"
          aria-label={aulaAberta.titulo}
        >
          <button
            type="button"
            className="video-modal-backdrop"
            onClick={fechar}
            aria-label="Fechar vídeo"
          />

          <div className="video-modal-content">
            <button type="button" className="video-modal-close" onClick={fechar} aria-label="Fechar">
              &times;
            </button>

            <div className="video-modal-player">
              <iframe
                src={`https://www.youtube.com/embed/${aulaAberta.videoId}?autoplay=1`}
                title={aulaAberta.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
