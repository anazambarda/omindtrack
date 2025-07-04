// src/controllers/respostaController.ts
import { Request, Response } from 'express'
import mysql from 'mysql2'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mindtrack'
})

export function salvarRespostas(req: Request, res: Response) {
  const { usuarioID, respostas } = req.body

  if (!usuarioID || !respostas) {
    return res.status(400).json({ erro: 'Dados incompletos.' })
  }

  // 1. Criar formulário
  db.query(
    'INSERT INTO Formulario (usuarioID, data_resposta) VALUES (?, CURDATE())',
    [usuarioID],
    (err, resultado) => {
      if (err) {
        console.error('Erro ao criar formulário:', err)
        return res.status(500).json({ erro: 'Erro ao criar formulário.' })
      }

      const formularioID = (resultado as any).insertId

      // 2. Inserir as respostas
      const valores: [number, number, boolean][] = []
      for (const perguntaID in respostas) {
        const resposta = respostas[perguntaID]
        valores.push([formularioID, parseInt(perguntaID), resposta])
      }

      db.query(
        'INSERT INTO Resposta (formularioID, perguntaID, resposta) VALUES ?',
        [valores],
        (err2) => {
          if (err2) {
            console.error('Erro ao salvar respostas:', err2)
            return res.status(500).json({ erro: 'Erro ao salvar respostas.' })
          }

          return res.json({ mensagem: 'Respostas salvas com sucesso!' })
        }
      )
    }
  )
}
