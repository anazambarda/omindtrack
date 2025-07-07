
import { Router } from 'express'
import { salvarRespostas } from '../controllers/respostaController'

const router = Router()

router.post('/respostas', salvarRespostas)

export default router
