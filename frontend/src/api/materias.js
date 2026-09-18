/**
 * MOCK - o backend ainda nao expoe materias nem videoaulas.
 * Para ligar no real, troque o corpo das funcoes por chamadas ao `http`
 * (ex.: `return http.get('/materias')`). A assinatura ja e async, entao
 * nenhuma tela precisa mudar.
 */

import { comAtraso, clonar } from '../mocks/latencia'
import { MATERIAS } from '../mocks/materias'

export function listarMaterias() {
  return comAtraso(clonar(MATERIAS))
}

export function buscarMateria(id) {
  const materia = MATERIAS.find((m) => m.id === id)
  if (!materia) {
    return Promise.reject(new Error(`Matéria "${id}" não encontrada.`))
  }
  return comAtraso(clonar(materia))
}

/** Total de aulas de uma materia, somando todas as secoes. */
export function contarAulas(materia) {
  return materia.secoes.reduce((soma, secao) => soma + secao.aulas.length, 0)
}

/** Consulta sincrona para rotulos - evita await so para exibir um nome. */
export function nomeDaMateria(id) {
  const materia = MATERIAS.find((m) => m.id === id)
  return materia?.nomeCurto || materia?.nome || 'Geral'
}
