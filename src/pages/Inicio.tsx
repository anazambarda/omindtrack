// src/pages/Inicio.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/inicio.css'
import cerebroImg from '../assets/cerebro.png'

export default function Inicio() {
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.add('inicio-body')
    return () => {
      document.body.classList.remove('inicio-body')
    }
  }, [])

  return (
    <div className="inicio-page">
      <section className="main">
        <div>
          <div className="card">
            <h2>Iniciar um novo teste</h2>
            <button className="btn" onClick={() => navigate('/perguntas')}>
              Ir para teste →
            </button>
          </div>
          <div className="text">
            Reserve um momento para si,<br />
            descubra como anda sua saúde mental com um teste rápido, simples e reflexivo.
          </div>
        </div>

        <img className="brain-img" src={cerebroImg} alt="Cérebro fofo" />

        <div>
          <div className="card">
            <h2>Ir pro dashboard</h2>
            <button className="btn" onClick={() => navigate('/dashboard')}>
              ← Observar
            </button>
          </div>
          <div className="text">
            Acompanhe sua jornada,<br />
            acesse seu painel e veja seus resultados e progresso em um só lugar.
          </div>
        </div>
      </section>
    </div>
  )
}
