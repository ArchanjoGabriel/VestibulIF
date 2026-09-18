/**
 * MOCK - derivado do historico local de tentativas.
 * Quando existir GET /api/estatisticas, este arquivo vira uma chamada so.
 */

import { comAtraso, clonar } from '../mocks/latencia'
import { listarTentativas } from '../mocks/progresso'

export function resumoDoUsuario(usuarioId) {
  const tentativas = listarTentativas(usuarioId)

  if (tentativas.length === 0) {
    return comAtraso(
      clonar({
        simulados: 0,
        questoesRespondidas: 0,
        acertos: 0,
        aproveitamento: 0,
        melhorAproveitamento: 0,
        sequenciaDias: 0,
        porMateria: [],
        evolucao: [],
        ultimaTentativa: null,
      }),
    )
  }

  const questoesRespondidas = tentativas.reduce((soma, t) => soma + t.total, 0)
  const acertos = tentativas.reduce((soma, t) => soma + t.acertos, 0)

  return comAtraso(
    clonar({
      simulados: tentativas.length,
      questoesRespondidas,
      acertos,
      aproveitamento: questoesRespondidas ? Math.round((acertos / questoesRespondidas) * 100) : 0,
      melhorAproveitamento: Math.max(...tentativas.map((t) => t.aproveitamento)),
      sequenciaDias: calcularSequencia(tentativas),
      porMateria: consolidarMaterias(tentativas),
      // Ordem cronologica para o grafico de evolucao (o historico vem invertido).
      evolucao: [...tentativas]
        .reverse()
        .map((t) => ({
          tentativaId: t.id,
          data: t.finalizadaEm,
          aproveitamento: t.aproveitamento,
          provaTitulo: t.provaTitulo,
        })),
      ultimaTentativa: tentativas[0],
    }),
  )
}

/** Materias com pior aproveitamento primeiro - vira a secao "onde focar". */
export function pontosFracos(usuarioId, limite = 3) {
  const consolidado = consolidarMaterias(listarTentativas(usuarioId))
  const ordenado = [...consolidado]
    .filter((m) => m.total >= 1)
    .sort((a, b) => a.aproveitamento - b.aproveitamento)
    .slice(0, limite)
  return comAtraso(clonar(ordenado))
}

function consolidarMaterias(tentativas) {
  const mapa = new Map()

  for (const tentativa of tentativas) {
    for (const materia of tentativa.porMateria || []) {
      const atual = mapa.get(materia.materiaId) || {
        materiaId: materia.materiaId,
        nome: materia.nome,
        acertos: 0,
        total: 0,
      }
      atual.acertos += materia.acertos
      atual.total += materia.total
      mapa.set(materia.materiaId, atual)
    }
  }

  return [...mapa.values()].map((item) => ({
    ...item,
    aproveitamento: item.total ? Math.round((item.acertos / item.total) * 100) : 0,
  }))
}

/** Dias consecutivos, contados a partir de hoje ou de ontem, com ao menos um simulado. */
function calcularSequencia(tentativas) {
  // Converte para o dia *local*: fatiar o ISO daria a data em UTC e, no fuso do
  // Brasil, um simulado feito as 21h cairia no dia seguinte.
  const dias = new Set(tentativas.map((t) => formatarDia(new Date(t.finalizadaEm))))
  if (dias.size === 0) return 0

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const cursor = new Date(hoje)
  // Quem estudou ontem mas ainda nao hoje nao deve perder a sequencia.
  if (!dias.has(formatarDia(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!dias.has(formatarDia(cursor))) return 0
  }

  let sequencia = 0
  while (dias.has(formatarDia(cursor))) {
    sequencia += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return sequencia
}

function formatarDia(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}
