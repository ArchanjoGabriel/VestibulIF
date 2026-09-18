/**
 * MOCK - o backend ainda nao expoe provas nem tentativas.
 *
 * A correcao mora aqui de proposito: `iniciarTentativa` devolve as questoes
 * *sem* o gabarito, e so `finalizarTentativa` revela resposta e explicacao.
 * E o mesmo contrato que um backend real teria, entao trocar o mock por HTTP
 * nao muda nada nas telas de quiz e resultado.
 *
 * As questoes vivem em modulos separados (mocks/provas/) e sao carregadas por
 * import() dinamico ao abrir a prova - o catalogo sozinho ja atende a listagem.
 */

import { comAtraso, clonar } from '../mocks/latencia'
import { CATALOGO_PROVAS } from '../mocks/provas/catalogo'
import { SIMULADO_RELAMPAGO } from '../mocks/simuladoRelampago'
import { listarTentativas, salvarTentativa } from '../mocks/progresso'
import { nomeDaMateria } from './materias'

/** Simulado proprio + provas oficiais, da edicao mais recente para a mais antiga. */
const CATALOGO = [
  ...CATALOGO_PROVAS,
  {
    ...resumoDoSimulado(),
    carregar: async () => ({ default: SIMULADO_RELAMPAGO.questoes }),
  },
]

function resumoDoSimulado() {
  const { questoes, ...resto } = SIMULADO_RELAMPAGO
  const porMateria = {}
  for (const q of questoes) porMateria[q.materiaId] = (porMateria[q.materiaId] || 0) + 1
  return {
    ...resto,
    totalQuestoes: questoes.length,
    materias: Object.keys(porMateria).sort(),
    porMateria,
  }
}

function acharNoCatalogo(provaId) {
  return CATALOGO.find((p) => p.id === provaId)
}

/** Questoes de uma prova, baixadas sob demanda e mantidas em memoria. */
const cache = new Map()

async function carregarQuestoes(prova) {
  if (!cache.has(prova.id)) {
    const modulo = await prova.carregar()
    cache.set(prova.id, modulo.default)
  }
  return cache.get(prova.id)
}

function semGabarito(questao) {
  // Descarta gabarito e explicacao por omissao - o prefixo _ marca que as
  // variaveis existem so para nao entrarem no objeto devolvido.
  const { correta: _correta, explicacao: _explicacao, ...publica } = questao
  return publica
}

/** Resumo de todas as provas, sem baixar nenhuma questao. */
export function listarProvas() {
  const resumos = CATALOGO.map(({ carregar: _carregar, ...prova }) => prova)
  return comAtraso(clonar(resumos))
}

export function buscarProva(provaId) {
  const prova = acharNoCatalogo(provaId)
  if (!prova) {
    return Promise.reject(new Error(`Prova "${provaId}" não encontrada.`))
  }
  const { carregar: _carregar, ...resto } = prova
  return comAtraso(clonar(resto))
}

/** Abre a prova para responder: questoes sem gabarito. */
export async function iniciarTentativa(provaId) {
  const prova = acharNoCatalogo(provaId)
  if (!prova) {
    throw new Error(`Prova "${provaId}" não encontrada.`)
  }

  const questoes = await carregarQuestoes(prova)
  return comAtraso(
    clonar({
      provaId: prova.id,
      titulo: prova.titulo,
      duracaoMin: prova.duracaoMin,
      iniciadaEm: new Date().toISOString(),
      questoes: questoes.map(semGabarito),
    }),
  )
}

/**
 * Corrige a tentativa e guarda no historico do usuario.
 * `respostas` e um objeto { [questaoId]: 'A' | 'B' | 'C' | 'D' }.
 */
export async function finalizarTentativa({
  usuarioId,
  provaId,
  respostas = {},
  iniciadaEm,
  segundosGastos,
}) {
  const prova = acharNoCatalogo(provaId)
  if (!prova) {
    throw new Error(`Prova "${provaId}" não encontrada.`)
  }

  const questoes = await carregarQuestoes(prova)

  const correcao = questoes.map((questao) => {
    const marcada = respostas[questao.id] || null
    return {
      questaoId: questao.id,
      numero: questao.numero,
      materiaId: questao.materiaId,
      enunciado: questao.enunciado,
      imagem: questao.imagem || null,
      alternativas: questao.alternativas,
      marcada,
      correta: questao.correta,
      acertou: marcada === questao.correta,
      // Provas oficiais nao vem com justificativa; a tela omite o bloco.
      explicacao: questao.explicacao || null,
    }
  })

  const acertos = correcao.filter((item) => item.acertou).length
  const respondidas = correcao.filter((item) => item.marcada).length

  const tentativa = {
    id: `t-${provaId}-${Date.now()}`,
    provaId,
    provaTitulo: prova.titulo,
    usuarioId,
    iniciadaEm: iniciadaEm || new Date().toISOString(),
    finalizadaEm: new Date().toISOString(),
    segundosGastos: segundosGastos ?? null,
    acertos,
    respondidas,
    total: correcao.length,
    aproveitamento: correcao.length ? Math.round((acertos / correcao.length) * 100) : 0,
    porMateria: agruparPorMateria(correcao),
    correcao,
  }

  salvarTentativa(usuarioId, tentativa)
  return comAtraso(clonar(tentativa))
}

export function listarHistorico(usuarioId) {
  return comAtraso(clonar(listarTentativas(usuarioId)))
}

export function buscarTentativa(usuarioId, tentativaId) {
  const tentativa = listarTentativas(usuarioId).find((t) => t.id === tentativaId)
  if (!tentativa) {
    return Promise.reject(new Error('Tentativa não encontrada.'))
  }
  return comAtraso(clonar(tentativa))
}

function agruparPorMateria(correcao) {
  const mapa = new Map()

  for (const item of correcao) {
    const atual = mapa.get(item.materiaId) || {
      materiaId: item.materiaId,
      nome: nomeDaMateria(item.materiaId),
      acertos: 0,
      total: 0,
    }
    atual.total += 1
    if (item.acertou) atual.acertos += 1
    mapa.set(item.materiaId, atual)
  }

  return [...mapa.values()].map((item) => ({
    ...item,
    aproveitamento: item.total ? Math.round((item.acertos / item.total) * 100) : 0,
  }))
}
