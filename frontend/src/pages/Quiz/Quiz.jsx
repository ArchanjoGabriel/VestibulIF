import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Carregando, EstadoVazio } from '../../components/comuns/Estados'
import { ConteudoAlternativa } from '../../components/comuns/Alternativa'
import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'
import { finalizarTentativa, iniciarTentativa } from '../../api/vestibulares'
import { nomeDaMateria } from '../../api/materias'
import { formatarCronometro } from '../../utils/formato'

/**
 * As letras vem da propria questao, nao de uma lista fixa.
 *
 * Os cadernos de Concomitante/Subsequente de 2026 tem cinco alternativas (A-E),
 * enquanto os de Integrado tem quatro. Fixar A-D esconderia a alternativa E e
 * poderia impedir o aluno de marcar a resposta certa.
 */
function letrasDe(questao) {
  return Object.keys(questao.alternativas).sort()
}


export function Quiz() {
  const { provaId } = useParams()
  const navegar = useNavigate()
  const { usuario } = useAuth()

  const [tentativa, setTentativa] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const [respostas, setRespostas] = useState({})
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [confirmandoEnvio, setConfirmandoEnvio] = useState(false)
  const [enviando, setEnviando] = useState(false)

  // O cronometro guarda o INSTANTE em que a prova acaba, e nao um contador que
  // se decrementa. Um contador exigiria que o intervalo dependesse do proprio
  // valor, e todo re-render (cada alternativa marcada) rearmaria o setInterval
  // antes de ele disparar - o relogio congelava para quem responde rapido.
  const [fimEm, setFimEm] = useState(null)
  const [segundosRestantes, setSegundosRestantes] = useState(null)

  useTituloDaPagina(tentativa ? tentativa.titulo : 'Simulado')

  // Sinaliza que a prova foi entregue: desliga o aviso de "sair sem enviar".
  const entregue = useRef(false)
  // Trava sincrona contra envio duplicado - `enviando` so vale no proximo render.
  const enviandoRef = useRef(false)

  useEffect(() => {
    let ativo = true
    setCarregando(true)

    iniciarTentativa(provaId)
      .then((dados) => {
        if (!ativo) return
        setTentativa(dados)
        setFimEm(Date.now() + dados.duracaoMin * 60 * 1000)
        setSegundosRestantes(dados.duracaoMin * 60)
      })
      .catch((e) => ativo && setErro(e))
      .finally(() => ativo && setCarregando(false))

    return () => {
      ativo = false
    }
  }, [provaId])

  const questoes = tentativa?.questoes || []
  const questaoAtual = questoes[indiceAtual]
  const respondidas = Object.keys(respostas).length
  const naoRespondidas = questoes.length - respondidas

  const enviar = useCallback(async () => {
    if (!tentativa || enviandoRef.current) return

    enviandoRef.current = true
    setEnviando(true)
    entregue.current = true

    try {
      const resultado = await finalizarTentativa({
        usuarioId: usuario?.id,
        provaId,
        respostas,
        iniciadaEm: tentativa.iniciadaEm,
        segundosGastos: Math.max(
          0,
          Math.round((Date.now() - new Date(tentativa.iniciadaEm).getTime()) / 1000),
        ),
      })
      navegar(CAMINHOS.resultado(resultado.id), { replace: true })
    } catch (e) {
      enviandoRef.current = false
      entregue.current = false
      setErro(e)
      setEnviando(false)
    }
  }, [tentativa, usuario?.id, provaId, respostas, navegar])

  // Recalcula o restante a partir do prazo, sem depender de `enviar`.
  useEffect(() => {
    if (!fimEm) return

    function atualizar() {
      setSegundosRestantes(Math.max(0, Math.ceil((fimEm - Date.now()) / 1000)))
    }

    atualizar()
    const id = setInterval(atualizar, 500)
    return () => clearInterval(id)
  }, [fimEm])

  // Ao zerar, entrega o que estiver marcado.
  useEffect(() => {
    if (segundosRestantes === 0 && tentativa && !enviandoRef.current) {
      enviar()
    }
  }, [segundosRestantes, tentativa, enviar])

  // Fechar a aba no meio da prova perderia todas as respostas.
  useEffect(() => {
    function aoSair(evento) {
      if (entregue.current || Object.keys(respostas).length === 0) return
      evento.preventDefault()
      evento.returnValue = ''
    }
    window.addEventListener('beforeunload', aoSair)
    return () => window.removeEventListener('beforeunload', aoSair)
  }, [respostas])

  const tempoAcabando = segundosRestantes !== null && segundosRestantes <= 300

  function responder(questaoId, letra) {
    setRespostas((atual) => ({ ...atual, [questaoId]: letra }))
  }

  function irPara(indice) {
    setIndiceAtual(Math.min(Math.max(indice, 0), questoes.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (carregando) {
    return (
      <main className="dashboard-main quiz-main" id="conteudo-principal">
        <Carregando texto="Preparando o simulado..." />
      </main>
    )
  }

  if (erro && !tentativa) {
    return (
      <main className="dashboard-main quiz-main" id="conteudo-principal">
        <EstadoVazio
          icone="⚠️"
          titulo="Não foi possível abrir a prova"
          descricao={erro.message}
          acao={
            <Link className="btn-iniciar" to={CAMINHOS.vestibulares}>
              Voltar aos vestibulares
            </Link>
          }
        />
      </main>
    )
  }

  return (
    <main className="dashboard-main quiz-main" id="conteudo-principal">
      <section className="quiz-header">
        <h1>{tentativa.titulo}</h1>

        <div className="quiz-meta">
          <span>
            Questão {indiceAtual + 1} de {questoes.length} - {respondidas} respondidas
          </span>
          <span className={`quiz-score ${tempoAcabando ? 'alerta' : ''}`}>
            Tempo restante: {formatarCronometro(segundosRestantes)}
          </span>
        </div>

        <div className="quiz-progress-track">
          <div
            className="quiz-progress-bar"
            style={{ width: `${questoes.length ? (respondidas / questoes.length) * 100 : 0}%` }}
            role="progressbar"
            aria-valuenow={respondidas}
            aria-valuemin={0}
            aria-valuemax={questoes.length}
            aria-label="Questões respondidas"
          />
        </div>

        <ol className="quiz-mapa">
          {questoes.map((questao, indice) => {
            const respondida = Boolean(respostas[questao.id])
            return (
              <li key={questao.id}>
                <button
                  type="button"
                  className={`quiz-mapa-botao ${respondida ? 'respondida' : ''} ${
                    indice === indiceAtual ? 'atual' : ''
                  }`}
                  onClick={() => irPara(indice)}
                  aria-current={indice === indiceAtual ? 'true' : undefined}
                  aria-label={`Questão ${questao.numero}${respondida ? ', respondida' : ', em branco'}`}
                >
                  {questao.numero}
                </button>
              </li>
            )
          })}
        </ol>
      </section>

      {tempoAcabando && (
        <p className="quiz-feedback erro">
          Menos de 5 minutos restantes. Ao zerar, a prova é entregue automaticamente.
        </p>
      )}

      {erro && <p className="quiz-feedback erro">{erro.message}</p>}

      <article className="quiz-card">
        <span className="quiz-numero">Questão {questaoAtual.numero}</span>
        <span className="quiz-materia">{nomeDaMateria(questaoAtual.materiaId)}</span>

        <p className="quiz-enunciado">{questaoAtual.enunciado}</p>

        {questaoAtual.imagem && (
          <img
            className="quiz-imagem"
            src={questaoAtual.imagem}
            alt={`Figura da questao ${questaoAtual.numero}`}
            loading="lazy"
          />
        )}

        <fieldset className="quiz-alternativas">
          <legend className="sr-only">Escolha uma alternativa</legend>

          {letrasDe(questaoAtual).map((letra) => {
            const marcada = respostas[questaoAtual.id] === letra
            const alternativa = questaoAtual.alternativas[letra]
            return (
              <button
                type="button"
                key={letra}
                className={`quiz-alt ${marcada ? 'marcada' : ''}`}
                onClick={() => responder(questaoAtual.id, letra)}
                aria-pressed={marcada}
              >
                <span className="quiz-alt-letra">{letra}</span>
                <ConteudoAlternativa letra={letra} alternativa={alternativa} />
              </button>
            )
          })}
        </fieldset>
      </article>

      <div className="quiz-nav">
        <button
          type="button"
          className="btn-quiz btn-secondary"
          onClick={() => irPara(indiceAtual - 1)}
          disabled={indiceAtual === 0}
        >
          Anterior
        </button>

        {indiceAtual === questoes.length - 1 ? (
          <button
            type="button"
            className="btn-quiz btn-finalizar"
            onClick={() => setConfirmandoEnvio(true)}
          >
            Finalizar prova
          </button>
        ) : (
          <button type="button" className="btn-quiz" onClick={() => irPara(indiceAtual + 1)}>
            Próxima
          </button>
        )}
      </div>

      {confirmandoEnvio && (
        <div className="dialogo-fundo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
          <div className="dialogo">
            <h2 id="dlg-titulo">Finalizar prova?</h2>
            <p>
              {naoRespondidas > 0
                ? `Você deixou ${naoRespondidas} ${
                    naoRespondidas === 1 ? 'questão em branco' : 'questões em branco'
                  }. Elas contam como erro.`
                : 'Você respondeu todas as questões. A correção aparece na próxima tela.'}
            </p>

            <div className="dialogo-acoes">
              <button
                type="button"
                className="btn-quiz btn-secondary"
                onClick={() => setConfirmandoEnvio(false)}
              >
                Continuar respondendo
              </button>
              <button type="button" className="btn-quiz" onClick={enviar} disabled={enviando}>
                {enviando ? 'Corrigindo...' : 'Finalizar e ver correção'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
