/**
 * Conteudo de uma alternativa: texto ou imagem.
 *
 * Algumas questoes do IFSP - a 21 da Prova A, por exemplo - trazem as quatro
 * alternativas como graficos, sem texto nenhum. Nesses casos o dado chega como
 * `{ imagem: '...' }` no lugar da string, e o quiz e a correcao usam o mesmo
 * componente para renderizar os dois formatos.
 */
export function ConteudoAlternativa({ letra, alternativa }) {
  if (alternativa && typeof alternativa === 'object' && alternativa.imagem) {
    return (
      <img
        className="quiz-alt-imagem"
        src={alternativa.imagem}
        alt={`Alternativa ${letra}`}
        loading="lazy"
      />
    )
  }

  return <span>{alternativa}</span>
}
