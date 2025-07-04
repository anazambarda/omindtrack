import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import '../styles/cadastro.css'

interface FormData {
  nome: string
  email: string
  senha: string
  idade: string
  sexo: string
}

export default function Cadastro() {
  const [form, setForm] = useState<FormData>({
    nome: '',
    email: '',
    senha: '',
    idade: '',
    sexo: ''
  })

  const [erro, setErro] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro(null)

    try {
      const res = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        // redirecionar ou limpar formulário
        setForm({
          nome: '',
          email: '',
          senha: '',
          idade: '',
          sexo: ''
        })
      } else {
        setErro(data.mensagem || 'Erro ao cadastrar.')
      }
    } catch (error) {
      setErro('Erro na requisição. Verifique se o backend está rodando.')
    }
  }

  return (
    <div className="cadastro-container">
      <h2>CADASTRO</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome Completo</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          name="senha"
          value={form.senha}
          onChange={handleChange}
          required
        />

        <label>Idade</label>
        <input
          type="number"
          name="idade"
          value={form.idade}
          onChange={handleChange}
          required
        />

        <label>Gênero</label>
        <div className="genero-group">
          <label>
            <input
              type="radio"
              name="sexo"
              value="F"
              checked={form.sexo === 'F'}
              onChange={handleChange}
            /> Feminino
          </label>
          <label>
            <input
              type="radio"
              name="sexo"
              value="M"
              checked={form.sexo === 'M'}
              onChange={handleChange}
            /> Masculino
          </label>
          <label>
            <input
              type="radio"
              name="sexo"
              value="O"
              checked={form.sexo === 'O'}
              onChange={handleChange}
            /> Outro
          </label>
        </div>

        <button type="submit">Cadastrar</button>

        {erro && <p className="erro-cadastro">{erro}</p>}
      </form>
    </div>
  )
}
