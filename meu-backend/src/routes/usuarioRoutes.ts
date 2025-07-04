// src/routes/usuarioRoutes.ts
import { Router } from 'express'
import { cadastrarUsuario, loginUsuario } from '../controllers/usuarioController'

const router = Router()

router.post('/usuarios', (req, res) => cadastrarUsuario(req, res))
router.post('/login', (req, res) => loginUsuario(req, res))

export default router
