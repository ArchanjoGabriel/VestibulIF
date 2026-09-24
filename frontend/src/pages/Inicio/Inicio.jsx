import { Link } from 'react-router-dom'

import { MapaIFs } from '../../components/comuns/MapaIFs'
import { CAMINHOS } from '../../routes/caminhos'
import { useAuth } from '../../hooks/useAuth'
import { useTituloDaPagina } from '../../hooks/useTituloDaPagina'

const TRILHAS = [
  {
    titulo: 'Trilha Descoberta',
    texto: 'Entenda as áreas da Rede Federal e descubra qual curso combina com seu perfil.',
  },
  {
    titulo: 'Trilha Preparação',
    texto: 'Conteúdos de base e orientações para se preparar para editais e processos seletivos.',
  },
  {
    titulo: 'Trilha Carreira',
    texto: 'Mentorias para planejar estudos, trajetória acadêmica e inserção no mundo do trabalho.',
  },
]

const AREAS = [
  {
    titulo: 'Tecnologia da Informação',
    texto: 'Programação, dados, infraestrutura e desenvolvimento de soluções digitais.',
  },
  {
    titulo: 'Indústria e Engenharia',
    texto: 'Automação, eletrotécnica, mecânica e processos industriais em laboratórios.',
  },
  {
    titulo: 'Saúde e Ambiente',
    texto: 'Formação técnica com foco em cuidado, sustentabilidade e qualidade de vida.',
  },
  {
    titulo: 'Gestão e Serviços',
    texto: 'Administração, turismo, logística e serviços para economias locais e regionais.',
  },
]

const EVENTOS = [
  { data: '12/04', texto: 'Encontro nacional online: como funciona o Instituto Federal' },
  { data: '20/04', texto: 'Mostra de cursos técnicos e projetos de estudantes' },
  { data: '28/04', texto: 'Oficina de preparação para processos seletivos' },
]

const PERGUNTAS = [
  {
    pergunta: 'Quem pode participar do VestibulIF Piracicaba?',
    resposta:
      'Estudantes interessados em participar do processo seletivo do IFSP Campus Piracicaba.',
  },
  {
    pergunta: 'O programa é gratuito?',
    resposta: 'Sim. Todas as atividades do VestibulIF Piracicaba são gratuitas.',
  },
  {
    pergunta: 'Como acesso minha área do aluno?',
    resposta: 'Clique em "Quero participar" para fazer login e entrar no painel de estudos.',
  },
]

const PILARES = [
  {
    titulo: 'Gratuito',
    texto:
      'Nenhuma funcionalidade é paga e não há anúncios. Quem quer estudar não deveria esbarrar num preço.',
  },
  {
    titulo: 'Conteúdo oficial',
    texto:
      'As provas vêm dos cadernos publicados pelo próprio IFSP, com cada resposta conferida contra o gabarito final.',
  },
  {
    titulo: 'Acessível a todos',
    texto:
      'Funciona no celular, é navegável pelo teclado e foi pensado para quem tem pouca banda ou pouco tempo.',
  },
]

export function Inicio() {
  useTituloDaPagina()

  const { autenticado } = useAuth()
  const destino = autenticado ? CAMINHOS.dashboard : CAMINHOS.login

  return (
    <main id="conteudo-principal">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-kicker">processo seletivo ifsp piracicaba 2026</p>

          <h1>
            Seu <span className="destaque">futuro</span>
            <br />
            começa agora
          </h1>

          <p className="hero-sub">
            O VestibulIF Piracicaba é o portal de orientação para quem quer ingressar no IFSP Campus
            Piracicaba, com informações do processo seletivo, materiais e apoio de preparação.
          </p>

          <div className="hero-actions">
            <Link to={destino} className="btn btn-primary">
              {autenticado ? 'Ir para a área do aluno' : 'Quero participar do VestibulIF'}
            </Link>
            {!autenticado && (
              <Link to={CAMINHOS.cadastro} className="btn btn-ghost">
                Criar conta
              </Link>
            )}
          </div>

          <ul className="hero-metrics" aria-label="Indicadores do programa">
            <li>
              <strong>Piracicaba</strong>
              <span>campus IFSP no interior de SP</span>
            </li>
            <li>
              <strong>Edital</strong>
              <span>informações centralizadas</span>
            </li>
            <li>
              <strong>Preparação</strong>
              <span>trilhas para o vestibular</span>
            </li>
          </ul>
        </div>

        <div className="hero-card hero-panel" id="instituto">
          <h2>Sobre o IFSP Piracicaba</h2>
          <p>
            O IFSP Campus Piracicaba integra a Rede Federal de educação pública e gratuita, com
            cursos técnicos e superiores focados em formação de qualidade, tecnologia e
            desenvolvimento local.
          </p>
          <ul>
            <li>Informações oficiais do processo seletivo do campus</li>
            <li>Orientações de estudo para vestibular e provas</li>
            <li>Acesso rápido ao portal e aos materiais de apoio</li>
          </ul>
        </div>
      </section>

      <MapaIFs />

      <section className="highlights" id="trilhas">
        {TRILHAS.map((trilha) => (
          <article key={trilha.titulo}>
            <h3>{trilha.titulo}</h3>
            <p>{trilha.texto}</p>
          </article>
        ))}
      </section>

      <section className="courses" id="cursos">
        <div className="section-head">
          <p>oferta nacional</p>
          <h2>Áreas em destaque na Rede Federal</h2>
        </div>
        <div className="course-grid">
          {AREAS.map((area) => (
            <article key={area.titulo}>
              <h3>{area.titulo}</h3>
              <p>{area.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="events" id="eventos">
        <div>
          <p>agenda viva</p>
          <h2>Ações para conhecer o universo IF</h2>
        </div>
        <ul>
          {EVENTOS.map((evento) => (
            <li key={evento.data}>
              <strong>{evento.data}</strong> {evento.texto}
            </li>
          ))}
        </ul>
      </section>

      <section className="faq" id="faq">
        <div className="section-head">
          <p>dúvidas frequentes</p>
          <h2>O que você precisa saber</h2>
        </div>
        {PERGUNTAS.map((item) => (
          <details key={item.pergunta}>
            <summary>{item.pergunta}</summary>
            <p>{item.resposta}</p>
          </details>
        ))}
      </section>

      <section className="sobre" id="sobre">
        <div className="section-head">
          <p>quem faz o vestibulif</p>
          <h2>Sobre nós</h2>
        </div>

        <div className="sobre-grid">
          <div className="sobre-texto">
            <p>
              Somos estudantes do <strong>4º ano do Ensino Médio Integrado do IFSP Campus
              Piracicaba</strong>. A ideia deste site nasceu da nossa própria experiência com o
              processo seletivo: achar as provas anteriores e descobrir o que realmente cai era
              bem mais difícil do que precisava ser.
            </p>
            <p>
              Nossa missão é ajudar quem pretende entrar no Instituto Federal, reunindo num lugar
              só as provas oficiais aplicadas pelo IFSP, as videoaulas dos conteúdos cobrados e a
              correção comentada de cada simulado.
            </p>
            <p>
              Tudo aqui é <strong>gratuito e acessível a todos</strong>. A educação pública de
              qualidade já é um direito; o acesso à preparação para entrar nela também deveria
              ser.
            </p>
          </div>

          <ul className="sobre-pilares">
            {PILARES.map((pilar) => (
              <li key={pilar.titulo}>
                <strong>{pilar.titulo}</strong>
                <span>{pilar.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
