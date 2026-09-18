import { Navigate, Route, Routes } from 'react-router-dom'

import { LayoutApp } from '../components/layout/LayoutApp'
import { RotaProtegida, RotaPublica } from './RotaProtegida'
import { CAMINHOS } from './caminhos'

import { Inicio } from '../pages/Inicio/Inicio'
import { Login } from '../pages/Login/Login'
import { Cadastro } from '../pages/Cadastro/Cadastro'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { Videoaulas } from '../pages/Videoaulas/Videoaulas'
import { MateriaDetalhe } from '../pages/MateriaDetalhe/MateriaDetalhe'
import { Vestibulares } from '../pages/Vestibulares/Vestibulares'
import { Quiz } from '../pages/Quiz/Quiz'
import { Resultado } from '../pages/Resultado/Resultado'
import { Perfil } from '../pages/Perfil/Perfil'
import { NaoEncontrada } from '../pages/NaoEncontrada/NaoEncontrada'

export function AppRotas() {
  return (
    <Routes>
      <Route element={<LayoutApp />}>
        <Route path={CAMINHOS.inicio} element={<Inicio />} />

        {/* Quem ja tem sessao nao deve cair em login/cadastro. */}
        <Route element={<RotaPublica />}>
          <Route path={CAMINHOS.login} element={<Login />} />
          <Route path={CAMINHOS.cadastro} element={<Cadastro />} />
        </Route>

        {/* Tudo abaixo exige sessao valida. */}
        <Route element={<RotaProtegida />}>
          <Route path={CAMINHOS.dashboard} element={<Dashboard />} />
          <Route path={CAMINHOS.videoaulas} element={<Videoaulas />} />
          <Route path={CAMINHOS.materia()} element={<MateriaDetalhe />} />
          {/* O hub de materias e a propria pagina de videoaulas. */}
          <Route path="/materias" element={<Navigate to={CAMINHOS.videoaulas} replace />} />
          <Route path={CAMINHOS.vestibulares} element={<Vestibulares />} />
          <Route path={CAMINHOS.quiz()} element={<Quiz />} />
          <Route path={CAMINHOS.resultado()} element={<Resultado />} />
          <Route path={CAMINHOS.perfil} element={<Perfil />} />
        </Route>

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
