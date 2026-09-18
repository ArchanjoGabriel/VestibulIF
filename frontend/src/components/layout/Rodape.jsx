export function Rodape() {
  const ano = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <p>VestibulIF Piracicaba {ano} | IFSP Campus Piracicaba</p>
      <a href="#conteudo-principal">Acessibilidade</a>
    </footer>
  )
}
