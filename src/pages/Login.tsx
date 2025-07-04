import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'

export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [senha, setSenha] = useState<string>('')
  const [erro, setErro] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErro(null) // limpa erro antigo

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      const data = await res.json()

      if (data.success) {
        navigate('/perguntas')
      } else {
        setErro(data.mensagem || 'Email ou senha inválidos.')
      }
    } catch (err) {
      setErro('Erro na conexão com o servidor.')
    }
  }

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      <p>Digite seus dados de acesso nos campos abaixo</p>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          required
        />

        <a href="/cadastro">Não possui conta? Cadastre-se</a>

        <button type="submit">Acessar</button>

        {erro && <p className="erro-login">{erro}</p>}
      </form>
    </div>
  )
}
