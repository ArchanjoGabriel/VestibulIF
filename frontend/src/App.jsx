import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthProvider'
import { AppRotas } from './routes/AppRotas'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRotas />
      </AuthProvider>
    </BrowserRouter>
  )
}
