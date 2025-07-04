// src/controllers/usuarioController.ts
import { Request, Response } from 'express'
import mysql from 'mysql2'

// Conexão com o banco
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mindtrack'
})

// Cadastro de novo usuário
function cadastrarUsuario(req: Request, res: Response): void {
  const { nome, email, senha, idade, sexo } = req.body

  if (!nome || !email || !senha || !idade || !sexo) {
    res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })
    return
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      res.status(500).json({ erro: 'Erro ao verificar email.' })
      return
    }

    if ((results as any[]).length > 0) {
      res.status(400).json({ mensagem: 'Este email já está em uso.' })
      return
    }

    db.query(
      'INSERT INTO usuarios (nome, email, senha, idade, sexo) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senha, idade, sexo],
      (err) => {
        if (err) {
          res.status(500).json({ erro: 'Erro ao cadastrar usuário.' })
          return
        }

        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' })
      }
    )
  })
}

// Login
function loginUsuario(req: Request, res: Response): void {
  const { email, senha } = req.body

  if (!email || !senha) {
    res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' })
    return
  }

  db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, results) => {
    if (err) {
      res.status(500).json({ erro: 'Erro ao fazer login.' })
      return
    }

    if ((results as any[]).length > 0) {
      const usuario = (results as any[])[0]
      res.json({
        success: true,
        usuarioID: usuario.usuarioID,
        nome: usuario.nome
      })
    } else {
      res.json({ success: false, mensagem: 'Email ou senha inválidos.' })
    }
  })
}

export { cadastrarUsuario, loginUsuario }
