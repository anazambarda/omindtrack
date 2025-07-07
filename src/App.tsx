import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import PaginaDePerguntas from './pages/PaginaDePerguntas'
import Inicio from './pages/Inicio'
import Resultado from './pages/Resultado'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/perguntas" element={<PaginaDePerguntas />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/dashboard" element={<Dashboard />} />
         
      </Routes>
    </Router>
  )
}

export default App
