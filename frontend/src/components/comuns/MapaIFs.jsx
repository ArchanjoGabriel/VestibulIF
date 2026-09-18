import { useEffect, useState } from 'react'

/**
 * Mapa interativo dos Institutos Federais.
 *
 * O SVG do mapa continua sendo um documento proprio em /public/mapa/ e entra
 * por iframe, como no site original. Ele avisa qual estado foi clicado por
 * postMessage; este componente escuta e monta o painel lateral.
 *
 * Manter o iframe evita converter 38 KB de paths SVG para JSX so para trocar a
 * forma de comunicacao - o comportamento visto pelo usuario e o mesmo.
 */
export function MapaIFs() {
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    function aoReceber(evento) {
      const dados = evento.data
      if (!dados || dados.type !== 'if-map-select') return
      setSelecionado(dados)
    }

    window.addEventListener('message', aoReceber)
    return () => window.removeEventListener('message', aoReceber)
  }, [])

  return (
    <section className="map-section" id="mapa">
      <div className="section-head">
        <p>outros institutos federais</p>
        <h2>Mapa da Rede Federal no Brasil</h2>
      </div>

      <p className="map-desc">
        Este site é focado no VestibulIF Piracicaba (IFSP). Se você quiser acompanhar o processo
        seletivo de outros IFs, use o mapa e acesse o site oficial de cada instituto pelo seu estado.
      </p>

      <div className="map-wrapper">
        <div className="map-container">
          <iframe
            className="if-map-frame"
            src="/mapa/mapa-brasil.html"
            title="Mapa interativo do Brasil com Institutos Federais"
            loading="lazy"
            scrolling="no"
          />
        </div>

        <div className="map-info">
          {!selecionado && (
            <p className="map-info-hint">
              Clique no estado para ver o IF correspondente e abrir o site oficial pelo botão da
              lateral.
            </p>
          )}

          {selecionado?.semIf && (
            <>
              <p className="map-info-state">{selecionado.uf}</p>
              <strong className="map-info-name">Sem IF mapeado</strong>
              <p className="map-info-full">
                Este estado não possui link de IF configurado no momento.
              </p>
            </>
          )}

          {selecionado && !selecionado.semIf && (
            <>
              <p className="map-info-state">{selecionado.uf}</p>
              <strong className="map-info-name">{selecionado.sigla}</strong>
              <p className="map-info-full">{selecionado.nome}</p>
              <a
                className="map-info-link"
                href={selecionado.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar site oficial &rarr;
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
