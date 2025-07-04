import { Router } from 'express'
import { listarPerguntas } from '../controllers/perguntasController'

const router = Router()

router.get('/perguntas', listarPerguntas)

export default router
