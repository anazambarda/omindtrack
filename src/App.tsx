import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import PaginaDePerguntas from './pages/PaginaDePerguntas'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
         <Route path="/perguntas" element={<PaginaDePerguntas />} />
      </Routes>
    </Router>
  )
}

export default App
