/** Estados de tela repetidos em varias paginas: carregando, vazio e erro. */

export function Carregando({ texto = 'Carregando...' }) {
  return (
    <div className="tela-carregando" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  )
}

export function EstadoVazio({ icone = '📭', titulo, descricao, acao }) {
  return (
    <div className="estado-vazio">
      <span className="estado-vazio-icone" aria-hidden="true">
        {icone}
      </span>
      <h2>{titulo}</h2>
      {descricao && <p>{descricao}</p>}
      {acao}
    </div>
  )
}

/** Barra de progresso rotulada, usada no desempenho por materia. */
export function BarraMateria({ nome, detalhe, valor }) {
  return (
    <div className="materia-barra">
      <div className="materia-barra-topo">
        <span className="materia-barra-nome">
          {nome}
          {detalhe && ` (${detalhe})`}
        </span>
        <span className="materia-barra-valor">{valor}%</span>
      </div>
      <div className="progress-track">
        <span
          className="progress-fill"
          style={{ width: `${Math.min(Math.max(valor, 0), 100)}%` }}
          role="progressbar"
          aria-valuenow={valor}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={nome}
        />
      </div>
    </div>
  )
}
