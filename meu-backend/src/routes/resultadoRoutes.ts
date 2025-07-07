import { Router } from 'express'
import { salvarResultado } from '../controllers/resultadoController'

const router = Router()

router.post('/', salvarResultado)

export default router
