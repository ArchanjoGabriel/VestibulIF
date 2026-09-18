/**
 * Todas as URLs do app em um lugar so.
 *
 * Nenhum componente escreve rota a mao: renomear uma rota vira uma edicao
 * unica, e nao uma cacada por `to="/..."` espalhado pelo projeto.
 */

export const CAMINHOS = {
  inicio: '/',
  login: '/login',
  cadastro: '/cadastro',
  dashboard: '/dashboard',
  videoaulas: '/videoaulas',
  materia: (id = ':materiaId') => `/materias/${id}`,
  vestibulares: '/vestibulares',
  quiz: (id = ':provaId') => `/vestibulares/${id}/quiz`,
  resultado: (id = ':tentativaId') => `/resultados/${id}`,
  perfil: '/perfil',
}
