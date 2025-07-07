import { Request, Response } from 'express'
import mysql from 'mysql2/promise'

export async function getDashboard(req: Request, res: Response) {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'mindtrack'
    })

    const usuarioID = req.params.usuarioID

    const {
      data_inicio,
      data_fim,
      idade_min,
      idade_max,
      sexo
    } = req.body

    // === 1. Info do usuário
    const [usuarioRows] = await db.execute(
      'SELECT * FROM usuarios WHERE id = ?',
      [usuarioID]
    )
    const usuario = (usuarioRows as any)[0]

    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' })

    // === 2. Histórico individual do usuário
    let queryHistorico = `
      SELECT f.data_resposta, r.pontuacao, r.estratificacao
      FROM resultado r
      JOIN formulario f ON f.id = r.formulario_id
      WHERE r.usuario_id = ?
    `
    const historicoParams: any[] = [usuarioID]

    if (data_inicio) {
      queryHistorico += ' AND f.data_resposta >= ?'
      historicoParams.push(data_inicio)
    }
    if (data_fim) {
      queryHistorico += ' AND f.data_resposta <= ?'
      historicoParams.push(data_fim)
    }

    queryHistorico += ' ORDER BY f.data_resposta DESC'

    const [historicoResultados] = await db.execute(queryHistorico, historicoParams)

    // === 3. Filtros de usuários
    let queryUsuarios = `SELECT * FROM usuarios WHERE 1=1`
    const usuariosParams: any[] = []

    if (idade_min) {
      queryUsuarios += ' AND idade >= ?'
      usuariosParams.push(idade_min)
    }
    if (idade_max) {
      queryUsuarios += ' AND idade <= ?'
      usuariosParams.push(idade_max)
    }
    if (sexo) {
      queryUsuarios += ' AND sexo = ?'
      usuariosParams.push(sexo)
    }

    const [usuariosFiltrados] = await db.execute(queryUsuarios, usuariosParams)
    const usuariosIDs = (usuariosFiltrados as any[]).map(u => u.id)

    // === 4. Resultados filtrados
    let queryResultados = `
      SELECT pontuacao, estratificacao
      FROM resultado r
      JOIN formulario f ON f.id = r.formulario_id
      WHERE r.usuario_id IN (${usuariosIDs.map(() => '?').join(',')})
    `
    const resultadosParams = [...usuariosIDs]

    if (data_inicio) {
      queryResultados += ' AND f.data_resposta >= ?'
      resultadosParams.push(data_inicio)
    }
    if (data_fim) {
      queryResultados += ' AND f.data_resposta <= ?'
      resultadosParams.push(data_fim)
    }

    const [resultadosGerais] = await db.execute(queryResultados, resultadosParams)

    const totalResultados = (resultadosGerais as any[]).length
    const mediaPontuacaoGeral = totalResultados
      ? ((resultadosGerais as any[]).reduce((sum, r) => sum + r.pontuacao, 0) / totalResultados)
      : 0

    const respostasComTranstorno = (resultadosGerais as any[]).filter(
      r => r.estratificacao !== 'Sem transtorno Mental'
    ).length
    const percentualTranstorno = totalResultados
      ? (respostasComTranstorno / totalResultados) * 100
      : 0

    const idades = (usuariosFiltrados as any[]).map(u => u.idade)
    const idadeMinReal = idades.length ? Math.min(...idades) : null
    const idadeMaxReal = idades.length ? Math.max(...idades) : null

    // === 5. Métricas individuais
    const totalPontuacaoUsuario = (historicoResultados as any[]).reduce((acc, r) => acc + r.pontuacao, 0)
    const mediaPontuacaoUsuario = (historicoResultados as any[]).length
      ? totalPontuacaoUsuario / (historicoResultados as any[]).length
      : 0

    const respostasSemTranstorno = (historicoResultados as any[]).filter(
      r => r.estratificacao === 'Sem transtorno Mental'
    ).length
    const respostasComTranstornoUsuario = (historicoResultados as any[]).length - respostasSemTranstorno

    let interpretacao = ''
    if (mediaPontuacaoUsuario === 0) {
      interpretacao = 'Nenhum indício de transtorno mental.'
    } else if (mediaPontuacaoUsuario <= 7) {
      interpretacao = 'Possível transtorno leve.'
    } else if (mediaPontuacaoUsuario <= 14) {
      interpretacao = 'Possível transtorno moderado.'
    } else {
      interpretacao = 'Possível transtorno grave. Recomendado buscar apoio.'
    }

    res.json({
      usuario,
      historico_resultados: historicoResultados,
      total_pontuacao_usuario: totalPontuacaoUsuario,
      media_pontuacao_usuario: Number(mediaPontuacaoUsuario.toFixed(2)),
      media_pontuacao_geral: Number(mediaPontuacaoGeral.toFixed(2)),
      percentual_transtorno: Number(percentualTranstorno.toFixed(2)),
      total_usuarios: (usuariosFiltrados as any[]).length,
      idade_min: idadeMinReal,
      idade_max: idadeMaxReal,
      respostas_sem_transtorno: respostasSemTranstorno,
      respostas_com_transtorno: respostasComTranstornoUsuario,
      interpretacao_usuario: interpretacao,
      filtros: {
        data_inicio,
        data_fim,
        idade_min,
        idade_max,
        sexo
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao gerar o dashboard' })
  }
}
