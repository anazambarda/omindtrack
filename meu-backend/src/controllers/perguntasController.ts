import { Request, Response } from 'express'
import mysql from 'mysql2'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mindtrack'
})

export function listarPerguntas(req: Request, res: Response) {
  db.query('SELECT perguntaID, pergunta AS texto FROM Pergunta', (err, results) => {
    if (err) {
      console.error('Erro ao buscar perguntas:', err)
      return res.status(500).json({ erro: 'Erro ao buscar perguntas.' })
    }

    res.json(results)
  })
}
