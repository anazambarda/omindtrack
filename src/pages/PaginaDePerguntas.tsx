import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/perguntas.css'

type Pergunta = {
  perguntaID: number
  texto: string
}

export default function Perguntas() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [respostas, setRespostas] = useState<Record<number, boolean | null>>({})
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3001/api/perguntas')
      .then(res => {
        if (!res.ok) throw new Error('Erro na resposta da API')
        return res.json()
      })
      .then(data => {
        setTimeout(() => {
          setPerguntas(data)
          const estadoInicial = Object.fromEntries(
            data.map((p: Pergunta) => [p.perguntaID, null])
          )
          setRespostas(estadoInicial)
          setCarregando(false)
        }, 500)
      })
      .catch(() => {
        setErro('Erro ao carregar perguntas.')
        setCarregando(false)
      })
  }, [])

  const handleChange = (perguntaID: number, valor: string) => {
    setRespostas({ ...respostas, [perguntaID]: valor === 'sim' })
  }

  const handleSubmit = async () => {
    const respondidas = Object.values(respostas).filter(r => r !== null).length
    if (respondidas !== perguntas.length) {
      setErro('Por favor, responda todas as perguntas.')
      return
    }

    const pontuacao = Object.values(respostas).filter(r => r === true).length
    let estratificacao = ''

    if (pontuacao === 0) estratificacao = 'Sem transtorno Mental'
    else if (pontuacao <= 7) estratificacao = 'Transtorno leve'
    else if (pontuacao <= 14) estratificacao = 'Transtorno moderado'
    else estratificacao = 'Transtorno grave'

    try {
      await fetch('http://localhost:3001/api/respostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioID: 1,
          respostas
        })
      })

      navigate('/resultado', { state: { estratificacao } })
    } catch (e) {
      setErro('Erro ao enviar respostas.')
    }
  }

  return (
    <div className="perguntas-container">
      <h2>VOCÊ PRECISA CUIDAR DA SAÚDE MENTAL!</h2>

      <div className="intro-text">
        <p>
          A saúde mental é essencial porque influencia como pensamos, sentimos e agimos no dia a dia...
        </p>
        <p>
          As perguntas abaixo são do instrumento Self Report Questionnaire (SRQ 20)...
        </p>
        <p>Para uma análise precisa, responda a todas as questões.</p>
      </div>

      {carregando && <p className="carregando">Carregando perguntas...</p>}
      {erro && <p className="erro">{erro}</p>}

      {!carregando && perguntas.map((p, i) => (
        <div key={p.perguntaID} className="question-block">
          <p><strong>{i + 1}- {p.texto}</strong></p>
          <label>
            <input
              type="radio"
              name={`p${p.perguntaID}`}
              value="sim"
              checked={respostas[p.perguntaID] === true}
              onChange={() => handleChange(p.perguntaID, 'sim')}
            /> Sim
          </label>
          <label>
            <input
              type="radio"
              name={`p${p.perguntaID}`}
              value="nao"
              checked={respostas[p.perguntaID] === false}
              onChange={() => handleChange(p.perguntaID, 'nao')}
            /> Não
          </label>
        </div>
      ))}

      {!carregando && perguntas.length > 0 && (
        <button className="btn" onClick={handleSubmit}>Enviar</button>
      )}
    </div>
  )
}
