import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import cerebroFofo from '../assets/cerebro_fofo.png'
import '../styles/resultado.css'

export default function Resultado() {
  const navigate = useNavigate()
  const location = useLocation()
  const estratificacao = location.state?.estratificacao || 'Sem transtorno Mental'
  const usuarioID = location.state?.usuarioID || 1
  const formularioID = location.state?.formularioID || 1
  const pontuacao = location.state?.pontuacao || 0

  useEffect(() => {
    fetch('http://localhost:3001/api/resultado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioID,
        formularioID,
        pontuacao,
        estratificacao
      })
    })
      .then(res => res.json())
      .then(data => console.log('✅ Resultado salvo:', data))
      .catch(err => console.error('Erro ao salvar resultado:', err))
  }, [])

  const getClasse = () => {
    switch (estratificacao) {
      case 'Transtorno leve': return 'leve'
      case 'Transtorno moderado': return 'moderado'
      case 'Transtorno grave': return 'grave'
      default: return 'sem'
    }
  }

  const getTexto = () => {
    switch (estratificacao) {
      case 'Sem transtorno Mental':
        return 'Seu resultado indica que, no momento, você não apresenta sinais de sofrimento mental significativos. Isso é um ótimo sinal! Continue se cuidando, prestando atenção ao seu bem-estar físico e emocional. Manter bons hábitos e buscar equilíbrio na rotina são atitudes importantes para preservar a saúde mental.'
      case 'Transtorno leve':
        return 'Você apresentou alguns sinais leves de sofrimento mental. Isso pode estar ligado a fatores como estresse, cansaço ou mudanças na rotina. Fique atento(a) aos seus sentimentos e tente reservar momentos para relaxar, dormir bem e praticar atividades que você gosta. Cuidar de você é essencial!'
      case 'Transtorno moderado':
        return 'Seu resultado mostra indícios moderados de sofrimento mental. Pode ser que você esteja enfrentando dificuldades para dormir, se concentrar ou lidar com suas emoções. Isso merece atenção. Tente conversar com alguém de confiança, buscar apoio psicológico ou adotar pequenas mudanças na rotina para aliviar esse peso. Você não está sozinho(a).'
      case 'Transtorno grave':
        return 'Seu resultado aponta sinais mais intensos de sofrimento mental, como tristeza frequente, cansaço constanteou pensamentos negativos. É muito importante buscar apoio profissional nesse momento.Falar com um psicólogo, médico ou outro profissional pode fazer toda a diferença.Você é importante, e cuidar da sua saúde mental é uma prioridade.'
      default:
        return ''
    }
  }

  const getTitulo = () => {
    switch (estratificacao) {
      case 'Transtorno leve': return 'Sofrimento mental leve'
      case 'Transtorno moderado': return 'Sofrimento mental moderado'
      case 'Transtorno grave': return 'Sofrimento mental grave'
      default: return 'Sem transtorno Mental'
    }
  }

  return (
    <main className="resultado-main">
      <div className="resultado-card">
        <h1>RESULTADO</h1>
        <img src={cerebroFofo} alt="Cérebro fofo" />
        <h2 className={getClasse()}>{getTitulo()}</h2>
        <p>{getTexto()}</p>
        <button className="btn-dash" onClick={() => navigate('/dashboard')}>
          Visualizar Dash
        </button>
      </div>
    </main>
  )
}
