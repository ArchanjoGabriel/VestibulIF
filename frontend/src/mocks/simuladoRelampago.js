/**
 * Simulado curto escrito pela equipe, nos temas do Edital 86/2025.
 *
 * Marcado com `oficial: false`: as telas mostram o selo "prova oficial" só nas
 * provas aplicadas pelo IFSP, para o aluno não confundir material próprio com
 * caderno oficial.
 */

export const SIMULADO_RELAMPAGO = {
  id: 'simulado-relampago',
  titulo: 'Simulado relâmpago',
  instituicao: 'VestibulIF',
  ano: 2025,
  semestre: 2,
  duracaoMin: 10,
  oficial: false,
  descricao:
    'Cinco questões rápidas escritas pela equipe para aquecer antes de encarar uma prova oficial.',
  questoes: [
    {
      id: 'q-rel-01',
      numero: 1,
      materiaId: 'matematica',
      enunciado: 'Quanto é 25% de 240?',
      alternativas: { A: '48', B: '60', C: '70', D: '96' },
      correta: 'B',
      explicacao: '25% é um quarto: 240 / 4 = 60.',
    },
    {
      id: 'q-rel-02',
      numero: 2,
      materiaId: 'matematica',
      enunciado: 'O ângulo complementar de 35 graus mede:',
      alternativas: { A: '45 graus', B: '55 graus', C: '65 graus', D: '145 graus' },
      correta: 'B',
      explicacao:
        'Ângulos complementares somam 90 graus: 90 - 35 = 55. Quem soma 180 é o suplementar (145).',
    },
    {
      id: 'q-rel-03',
      numero: 3,
      materiaId: 'matematica',
      enunciado:
        'Em uma circunferência, um ângulo central mede 80 graus. O ângulo inscrito que enxerga o mesmo arco mede:',
      alternativas: { A: '20 graus', B: '40 graus', C: '80 graus', D: '160 graus' },
      correta: 'B',
      explicacao:
        'O ângulo inscrito vale metade do central que enxerga o mesmo arco: 80 / 2 = 40 graus.',
    },
    {
      id: 'q-rel-04',
      numero: 4,
      materiaId: 'matematica',
      enunciado: 'Assinale a alternativa que apresenta um número irracional:',
      alternativas: { A: '0,5', B: '3/4', C: '√2', D: '-7' },
      correta: 'C',
      explicacao:
        'Irracional é o número que não pode ser escrito como fração de inteiros e tem decimal infinita não periódica - caso de √2. As demais opções são racionais.',
    },
    {
      id: 'q-rel-05',
      numero: 5,
      materiaId: 'portugues',
      enunciado: 'Em "O vento sussurrava entre as folhas", a figura de linguagem empregada é:',
      alternativas: { A: 'hipérbole', B: 'prosopopeia', C: 'metonímia', D: 'antítese' },
      correta: 'B',
      explicacao:
        'Prosopopeia (ou personificação) atribui ação humana a um ser inanimado: o vento "sussurra".',
    },
  ],
}
