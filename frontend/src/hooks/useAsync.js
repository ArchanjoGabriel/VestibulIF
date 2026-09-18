import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Carrega dados assincronos guardando os tres estados que toda tela precisa:
 * dados, carregando e erro.
 *
 * Descarta respostas obsoletas: se o usuario troca de filtro rapido, a resposta
 * da chamada antiga pode chegar depois da nova e sobrescrever a tela com dados
 * errados. O contador de execucao abaixo impede isso.
 */
export function useAsync(funcaoAsync, dependencias = [], { imediato = true } = {}) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(imediato)
  const [erro, setErro] = useState(null)

  const execucaoAtual = useRef(0)
  const montado = useRef(true)

  useEffect(() => {
    montado.current = true
    return () => {
      montado.current = false
    }
  }, [])

  const executar = useCallback(async () => {
    const execucao = ++execucaoAtual.current
    setCarregando(true)
    setErro(null)

    try {
      const resultado = await funcaoAsync()
      if (montado.current && execucao === execucaoAtual.current) {
        setDados(resultado)
      }
      return resultado
    } catch (e) {
      if (montado.current && execucao === execucaoAtual.current) {
        setErro(e)
      }
      return undefined
    } finally {
      if (montado.current && execucao === execucaoAtual.current) {
        setCarregando(false)
      }
    }
    // funcaoAsync e recriada a cada render pelas telas; as dependencias
    // declaradas por quem chama e que definem quando recarregar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias)

  useEffect(() => {
    if (imediato) executar()
  }, [executar, imediato])

  return { dados, carregando, erro, recarregar: executar }
}
