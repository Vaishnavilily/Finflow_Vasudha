// server.js  –  FinFlow Backend Entry Point
import 'dotenv/config'
import http     from 'http'
import express  from 'express'
import cors     from 'cors'

import individualRouter from './routes/individual.js'
import smeRouter        from './routes/sme.js'
import aiRouter         from './routes/ai.js'
import { setupWebSocket } from './realtime/ws.js'

const PORT      = process.env.PORT || 4000
const TICK_MS   = Number(process.env.REALTIME_TICK_MS) || 5000
const ORIGINS   = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000')
                    .split(',').map(s => s.trim())

const app    = express()
const server = http.createServer(app)

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (curl, Postman, etc.)
    if (!origin || ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(`CORS blocked: ${origin}`))
  },
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ─── Health Check ─────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:  'ok',
    service: 'FinFlow Backend',
    version: '1.0.0',
    time:    new Date().toISOString(),
    uptime:  Math.round(process.uptime()),
    ws:      `ws://localhost:${PORT}/ws`,
  })
})

// ─── REST Routes ──────────────────────────────────────────────────
app.use('/api/individual', individualRouter)
app.use('/api/sme',        smeRouter)
app.use('/api/ai',         aiRouter)

// ─── 404 catch-all ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global error handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// ─── WebSocket ────────────────────────────────────────────────────
setupWebSocket(server, TICK_MS)

// ─── Start ───────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log('')
  console.log('  ███████╗██╗███╗   ██╗███████╗██╗      ██████╗ ██╗    ██╗')
  console.log('  ██╔════╝██║████╗  ██║██╔════╝██║     ██╔═══██╗██║    ██║')
  console.log('  █████╗  ██║██╔██╗ ██║█████╗  ██║     ██║   ██║██║ █╗ ██║')
  console.log('  ██╔══╝  ██║██║╚██╗██║██╔══╝  ██║     ██║   ██║██║███╗██║')
  console.log('  ██║     ██║██║ ╚████║██║     ███████╗╚██████╔╝╚███╔███╔╝')
  console.log('  ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝')
  console.log('')
  console.log(`  🚀 Backend running on http://localhost:${PORT}`)
  console.log(`  🔌 WebSocket on  ws://localhost:${PORT}/ws`)
  console.log(`  🤖 AI proxy      ${process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here' ? '✅ Configured' : '⚠️  Not configured (set ANTHROPIC_API_KEY)'}`)
  console.log(`  ⚡ Live tick     every ${TICK_MS}ms`)
  console.log('')
})
