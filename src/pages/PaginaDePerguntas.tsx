import { useEffect, useState } from 'react'
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

    try {
      const res = await fetch('http://localhost:3001/api/respostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioID: 1, // Substitua com o ID real
          respostas
        })
      })

      const data = await res.json()
      console.log(data)
      // redirecionar ou mostrar feedback aqui
    } catch (e) {
      setErro('Erro ao enviar respostas.')
    }
  }

  return (
    <div className="perguntas-container">
      <h2>VOCÊ PRECISA CUIDAR DA SAÚDE MENTAL!</h2>

      <div className="intro-text">
        <p>
          A saúde mental é essencial porque influencia como pensamos, sentimos e agimos no dia a dia.
          Ela afeta nossas relações, decisões e bem-estar geral, sendo tão importante quanto a saúde física.
        </p>
        <p>
          As perguntas abaixo são do instrumento Self Report Questionnaire (SRQ 20), para rastreamento de sofrimento mental,
          e não de diagnóstico psiquiátrico (diagnóstico só pode ser fornecido por um profissional).
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
