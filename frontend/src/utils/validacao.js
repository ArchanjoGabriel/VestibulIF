/**
 * Validacao de formulario no cliente.
 *
 * Nao substitui o backend - o Pydantic continua sendo a autoridade. Serve para
 * dar retorno imediato sem gastar uma ida ao servidor.
 */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const MIN_SENHA = 6

export function validarNome(nome) {
  const valor = (nome || '').trim()
  if (!valor) return 'Informe seu nome.'
  if (valor.length < 3) return 'O nome precisa ter ao menos 3 caracteres.'
  if (valor.length > 100) return 'O nome pode ter no maximo 100 caracteres.'
  return null
}

export function validarEmail(email) {
  const valor = (email || '').trim()
  if (!valor) return 'Informe seu e-mail.'
  if (!REGEX_EMAIL.test(valor)) return 'Digite um e-mail válido.'
  if (valor.length > 100) return 'O e-mail pode ter no maximo 100 caracteres.'
  return null
}

export function validarSenha(senha) {
  if (!senha) return 'Informe sua senha.'
  if (senha.length < MIN_SENHA) return `A senha precisa ter ao menos ${MIN_SENHA} caracteres.`
  return null
}

export function validarConfirmacao(senha, confirmacao) {
  if (!confirmacao) return 'Repita a senha.'
  if (senha !== confirmacao) return 'As senhas não conferem.'
  return null
}

/** Roda um mapa de validadores e devolve so os campos com erro. */
export function validarFormulario(valores, validadores) {
  const erros = {}
  for (const [campo, validar] of Object.entries(validadores)) {
    const erro = validar(valores[campo], valores)
    if (erro) erros[campo] = erro
  }
  return erros
}
