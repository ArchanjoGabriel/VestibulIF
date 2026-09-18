/**
 * As duas matérias do processo seletivo do IFSP: Português e Matemática.
 *
 * Cada matéria guarda suas seções de videoaulas, com os temas e os vídeos do
 * Edital 86/2025 - a mesma organização que a página de cada matéria usa.
 * MOCK: trocar por GET /api/materias quando o backend expuser isso.
 */

export const MATERIAS = [
  {
    id: 'matematica',
    nome: 'Matemática',
    nomeCurto: 'Matemática',
    icone: '📐',
    kicker: 'videoaulas de matemática',
    resumo:
      'Temas baseados no último processo seletivo do IFSP (Edital 86/2025). Clique na thumbnail para assistir.',
    secoes: [
      {
        id: 'irracionais',
        titulo: 'Números Irracionais e Reta Numérica',
        aulas: [
          { id: 'mat-1a', titulo: 'Números irracionais - O que são', videoId: 'znFnSEghhrU' },
          { id: 'mat-1b', titulo: 'Localização na reta numérica', videoId: '2ga7oaYfAKE' },
        ],
      },
      {
        id: 'sistemas',
        titulo: 'Sistemas de Equações do 1º Grau',
        aulas: [
          {
            id: 'mat-2a',
            titulo: 'Sistemas de equações - Método da substituição',
            videoId: 'oT4k6bhB4Dk',
          },
          {
            id: 'mat-2b',
            titulo: 'Sistemas de equações - Método da adição',
            videoId: 'H4j9pBmQZNA',
          },
        ],
      },
      {
        id: 'unidades',
        titulo: 'Unidades de Medida e Conversão',
        aulas: [
          {
            id: 'mat-3a',
            titulo: 'Unidades de medida - Comprimento, massa e volume',
            videoId: 'dHr5phd_qL8',
          },
          {
            id: 'mat-3b',
            titulo: 'Conversão de unidades - Litros, mL e m³',
            videoId: '5KwQvkczMI8',
          },
        ],
      },
      {
        id: 'notacao',
        titulo: 'Notação Científica',
        aulas: [
          { id: 'mat-4a', titulo: 'Notação científica - Aula completa', videoId: 'WZMTUDfvm9E' },
          {
            id: 'mat-4b',
            titulo: 'Notação científica - Exercícios resolvidos',
            videoId: 'iqCXe2lMdMo',
          },
        ],
      },
      {
        id: 'proporcionais',
        titulo: 'Grandezas Proporcionais (Velocidade, Distância, Tempo)',
        aulas: [
          { id: 'mat-5a', titulo: 'Velocidade média - Distância e tempo', videoId: 'AKneIQ0cEHc' },
          {
            id: 'mat-5b',
            titulo: 'Grandezas diretamente e inversamente proporcionais',
            videoId: 'CCq_ZqHWWEk',
          },
        ],
      },
      {
        id: 'pitagoras',
        titulo: 'Geometria Plana - Teorema de Pitágoras',
        aulas: [
          { id: 'mat-6a', titulo: 'Teorema de Pitágoras - Aula completa', videoId: 'YCy36DVuJ88' },
          {
            id: 'mat-6b',
            titulo: 'Pitágoras - Exercícios com losango e diagonal',
            videoId: 'RxfPjqXx-g0',
          },
        ],
      },
      {
        id: 'angulos',
        titulo: 'Ângulos (Complementares, Bissetriz, Retas Paralelas)',
        aulas: [
          { id: 'mat-7a', titulo: 'Ângulos complementares e suplementares', videoId: 'MpiS8EGX0_Q' },
          {
            id: 'mat-7b',
            titulo: 'Ângulos entre retas paralelas cortadas por transversal',
            videoId: 'rDDC98e0ujw',
          },
        ],
      },
      {
        id: 'cilindro',
        titulo: 'Geometria Espacial - Volume do Cilindro',
        aulas: [
          { id: 'mat-8a', titulo: 'Volume do cilindro - Aula completa', videoId: 'zYLmWhH_qQk' },
          {
            id: 'mat-8b',
            titulo: 'Volume do cilindro - Exercícios resolvidos',
            videoId: 'l791rnqEub0',
          },
        ],
      },
      {
        id: 'porcentagem',
        titulo: 'Porcentagem e Aumentos Sucessivos',
        aulas: [
          { id: 'mat-9a', titulo: 'Porcentagem - Aula completa', videoId: 'x38S9zPcCVU' },
          { id: 'mat-9b', titulo: 'Aumentos e descontos sucessivos', videoId: 'T9DqqInDLg4' },
        ],
      },
      {
        id: 'combinatoria',
        titulo: 'Análise Combinatória (Princípio Multiplicativo)',
        aulas: [
          { id: 'mat-10a', titulo: 'Princípio fundamental da contagem', videoId: '3iL5AZ8R7F0' },
          { id: 'mat-10b', titulo: 'Análise combinatória - Exercícios', videoId: '4TlYuubzP0E' },
        ],
      },
      {
        id: 'proporcao',
        titulo: 'Proporção e Frações',
        aulas: [
          { id: 'mat-11a', titulo: 'Razão e proporção - Aula completa', videoId: 'GjxEHeAKWAU' },
          { id: 'mat-11b', titulo: 'Frações - Operações e simplificação', videoId: 'NXb8T626NSo' },
        ],
      },
      {
        id: 'circunferencia',
        titulo: 'Circunferência - Ângulos Inscritos e Centrais',
        aulas: [
          {
            id: 'mat-12a',
            titulo: 'Ângulo central e inscrito na circunferência',
            videoId: 'tWzS3gS5NG0',
          },
          {
            id: 'mat-12b',
            titulo: 'Circunferência - Propriedades e exercícios',
            videoId: 'XnOe08H47dg',
          },
        ],
      },
    ],
  },
  {
    id: 'portugues',
    nome: 'Português e Linguagens',
    nomeCurto: 'Português',
    icone: '📖',
    kicker: 'videoaulas de português',
    resumo:
      'Temas baseados no último processo seletivo do IFSP (Edital 86/2025). Clique na thumbnail para assistir.',
    secoes: [
      {
        id: 'interpretacao',
        titulo: 'Interpretação de Texto',
        aulas: [
          {
            id: 'por-1a',
            titulo: 'Interpretação de texto - Como interpretar',
            videoId: 'O0TTbXCTg-I',
          },
          {
            id: 'por-1b',
            titulo: 'Interpretação de texto - Dicas práticas',
            videoId: 'XsN0e_xPyNI',
          },
        ],
      },
      {
        id: 'figuras',
        titulo: 'Figuras de Linguagem',
        aulas: [
          { id: 'por-2a', titulo: 'Figuras de linguagem - Aula completa', videoId: 'hQS8o50k3rI' },
          {
            id: 'por-2b',
            titulo: 'Metáfora, prosopopeia, onomatopeia e ironia',
            videoId: 'n0e75nRstcU',
          },
        ],
      },
      {
        id: 'formacao',
        titulo: 'Formação de Palavras',
        aulas: [
          { id: 'por-3a', titulo: 'Derivação e composição - Aula completa', videoId: '98qXxXx51T0' },
          {
            id: 'por-3b',
            titulo: 'Derivação parassintética, prefixal e sufixal',
            videoId: 'tl_dB3Wns80',
          },
        ],
      },
      {
        id: 'ligacao',
        titulo: 'Verbos de Ligação',
        aulas: [
          {
            id: 'por-4a',
            titulo: 'Verbos de ligação - O que são e como identificar',
            videoId: 'EgGBJH_QdCc',
          },
          {
            id: 'por-4b',
            titulo: 'Verbos de ligação e predicativo do sujeito',
            videoId: 'CC03oFSUt20',
          },
        ],
      },
      {
        id: 'generos',
        titulo: 'Gêneros Textuais (Notícia)',
        aulas: [
          {
            id: 'por-5a',
            titulo: 'Gêneros textuais - Notícia e pirâmide invertida',
            videoId: 'd_ZJa0yiDCY',
          },
          {
            id: 'por-5b',
            titulo: 'Gêneros textuais - Lide e estrutura da notícia',
            videoId: '2mQa0oWjTLY',
          },
        ],
      },
      {
        id: 'pronomes',
        titulo: 'Pronomes',
        aulas: [
          { id: 'por-6a', titulo: 'Pronomes - Aula completa', videoId: 'PQRdgiIutrE' },
          {
            id: 'por-6b',
            titulo: 'Pronomes - Referência pronominal e coesão',
            videoId: 'cZ3MmXT0uys',
          },
        ],
      },
      {
        id: 'subordinadas',
        titulo: 'Orações Subordinadas e Conjunções',
        aulas: [
          { id: 'por-7a', titulo: 'Orações subordinadas - Aula completa', videoId: 'zRYeauBptu4' },
          {
            id: 'por-7b',
            titulo: 'Conjunções subordinativas e coordenativas',
            videoId: 'lx2aKClIsQo',
          },
        ],
      },
      {
        id: 'verbal',
        titulo: 'Linguagem Verbal e Não Verbal',
        aulas: [
          { id: 'por-8a', titulo: 'Linguagem verbal e não verbal', videoId: 'Gb_D0fRBXSY' },
          { id: 'por-8b', titulo: 'Linguagem mista - Charges e tirinhas', videoId: 'MKeDKqA1Rik' },
        ],
      },
      {
        id: 'sonoros',
        titulo: 'Recursos Sonoros e Poéticos',
        aulas: [
          { id: 'por-9a', titulo: 'Recursos sonoros na poesia', videoId: 'kVjh1ywef-A' },
          { id: 'por-9b', titulo: 'Estilística e efeitos de sentido', videoId: 'aL8HTy9y9_c' },
        ],
      },
      {
        id: 'argumentacao',
        titulo: 'Argumentação e Oralidade',
        aulas: [
          { id: 'por-10a', titulo: 'Argumentação - Técnicas e estratégias', videoId: 'BPx6WkofMXQ' },
          {
            id: 'por-10b',
            titulo: 'Modalidade oral e elementos do discurso',
            videoId: '15y3OXVvI6U',
          },
        ],
      },
    ],
  },
]
