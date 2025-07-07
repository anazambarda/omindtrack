import { Request, Response } from 'express'
import mysql from 'mysql2'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mindtrack'
})

export function salvarResultado(req: Request, res: Response) {
  const { usuarioID, formularioID, pontuacao, estratificacao } = req.body

  if (!usuarioID || !formularioID || pontuacao === undefined || !estratificacao) {
    return res.status(400).json({ erro: 'Dados incompletos.' })
  }

  db.query(
    'INSERT INTO Resultado (formularioID, usuarioID, pontuacao, estratificacao) VALUES (?, ?, ?, ?)',
    [formularioID, usuarioID, pontuacao, estratificacao],
    (err) => {
      if (err) {
        console.error('Erro ao salvar resultado:', err)
        return res.status(500).json({ erro: 'Erro ao salvar resultado.' })
      }
      return res.json({ mensagem: 'Resultado salvo com sucesso!' })
    }
  )
}
