import { useState } from 'react'
import '../styles/dashboard.css'

const Dashboard = () => {
  const [filtros, setFiltros] = useState({
    data_inicio: '',
    data_fim: '',
    idade_min: '',
    idade_max: '',
    sexo: ''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setFiltros({ ...filtros, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Filtros aplicados (só visual mesmo rs)')
  }

  const dados = {
    usuario: { nome: 'Ana Z.' },
    total_pontuacao_usuario: 52,
    media_pontuacao_usuario: 6.5,
    interpretacao_usuario: 'Possível transtorno leve.',
    respostas_sem_transtorno: 3,
    respostas_com_transtorno: 5,
    media_pontuacao_geral: 7.2,
    percentual_transtorno: 61.5,
    total_usuarios: 18,
    idade_min: 21,
    idade_max: 47,
    historico_resultados: [
      { data_resposta: '2025-07-01', pontuacao: 5, estratificacao: 'Sem transtorno Mental' },
      { data_resposta: '2025-06-20', pontuacao: 8, estratificacao: 'Transtorno leve' },
      { data_resposta: '2025-06-10', pontuacao: 9, estratificacao: 'Transtorno Moderado' },
      { data_resposta: '2025-06-01', pontuacao: 6, estratificacao: 'Sem transtorno Mental' }
    ]
  }

  return (
    <div className="dashboard-container">
      <h1>Olá, {dados.usuario.nome}! 👋</h1>

      <form onSubmit={handleSubmit} className="filtro-form">
        <h2>Filtros</h2>
        <div className="filtro-grid">
          <div className="filtro-item">
            <label htmlFor="data_inicio">Data Início</label>
            <input
              type="date"
              name="data_inicio"
              value={filtros.data_inicio}
              onChange={handleChange}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="data_fim">Data Fim</label>
            <input
              type="date"
              name="data_fim"
              value={filtros.data_fim}
              onChange={handleChange}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="idade_min">Idade Mínima</label>
            <input
              type="number"
              name="idade_min"
              value={filtros.idade_min}
              onChange={handleChange}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="idade_max">Idade Máxima</label>
            <input
              type="number"
              name="idade_max"
              value={filtros.idade_max}
              onChange={handleChange}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="sexo">Sexo</label>
            <select
              name="sexo"
              value={filtros.sexo}
              onChange={handleChange}
            >
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
          </div>
        </div>

        <button type="submit" className="botao-filtro">
          Aplicar Filtros
        </button>
      </form>

      <section className="metrics-section">
        <h2>Métricas Individuais</h2>
        <ul>
          <li><strong>Pontuação Total:</strong> {dados.total_pontuacao_usuario}</li>
          <li><strong>Média:</strong> {dados.media_pontuacao_usuario}</li>
          <li><strong>Interpretação:</strong> {dados.interpretacao_usuario}</li>
          <li><strong>Sem transtorno:</strong> {dados.respostas_sem_transtorno}</li>
          <li><strong>Com transtorno:</strong> {dados.respostas_com_transtorno}</li>
        </ul>
      </section>

      <section className="metrics-section">
        <h2>Métricas Gerais</h2>
        <ul>
          <li><strong>Média Geral:</strong> {dados.media_pontuacao_geral}</li>
          <li><strong>% com transtorno:</strong> {dados.percentual_transtorno}%</li>
          <li><strong>Total de usuários:</strong> {dados.total_usuarios}</li>
          <li><strong>Faixa Etária:</strong> {dados.idade_min}–{dados.idade_max}</li>
        </ul>
      </section>

      <section className="metrics-section">
        <h2>Histórico</h2>
        <table className="historico-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Pontuação</th>
              <th>Estratificação</th>
            </tr>
          </thead>
          <tbody>
            {dados.historico_resultados.map((r, i) => (
              <tr key={i}>
                <td>{r.data_resposta}</td>
                <td>{r.pontuacao}</td>
                <td>{r.estratificacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Dashboard
