import { Router } from 'express'
import { getDashboard } from '../controllers/dashboardController'

const router = Router()

router.post('/dashboard/:usuarioID', getDashboard)

export default router
