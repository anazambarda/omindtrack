// src/index.ts
import express from 'express'
import cors from 'cors'
import usuarioRoutes from './routes/usuarioRoutes'
import perguntasRoutes from './routes/perguntasRoutes'
import respostaRoutes from './routes/respostaRoutes'
import resultadoRoutes from './routes/resultadoRoutes'
import dashboardRoutes from './routes/dashboardRoutes'




const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use('/api', respostaRoutes)

app.use('/api', usuarioRoutes)
app.use('/api', perguntasRoutes)
app.use('/api/resultado', resultadoRoutes)
app.use('/api', dashboardRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})
