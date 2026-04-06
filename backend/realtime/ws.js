// realtime/ws.js  –  WebSocket real-time ticker
//
// Broadcasts live metric updates to all connected clients every N seconds.
// Each client can subscribe to 'individual' or 'sme' (or both) channels.
//
import { WebSocketServer, WebSocket } from 'ws'
import { liveState } from '../data/store.js'

// ─── tiny helpers ────────────────────────────────────────────────
const jitter = (val, pct = 0.005) =>
  +(val * (1 + (Math.random() - 0.5) * 2 * pct)).toFixed(2)

const clamp = (val, min, max) => Math.min(max, Math.max(min, val))

// ─── simulate realistic market-like drift ────────────────────────
function tickIndividual() {
  const s = liveState.individual
  s.monthlyIncome  = clamp(jitter(s.monthlyIncome,  0.002), 70000, 100000)
  s.totalExpenses  = clamp(jitter(s.totalExpenses,  0.004), 40000, 70000)
  s.netWorth       = clamp(jitter(s.netWorth,       0.003), 350000, 600000)
  s.savingsRate    = clamp(
    +(((s.monthlyIncome - s.totalExpenses) / s.monthlyIncome * 100).toFixed(1)),
    20, 60
  )
  s.lastUpdated    = new Date().toISOString()
  return s
}

function tickSme() {
  const s = liveState.sme
  s.monthlyRevenue    = clamp(jitter(s.monthlyRevenue,    0.003), 900000, 1600000)
  s.operatingExpenses = clamp(jitter(s.operatingExpenses, 0.002), 600000, 1000000)
  s.netProfit         = Math.round(s.monthlyRevenue - s.operatingExpenses)
  s.grossMargin       = clamp(+(((s.monthlyRevenue - s.operatingExpenses) / s.monthlyRevenue * 100).toFixed(1)), 30, 70)
  s.operatingMargin   = clamp(+(s.grossMargin - 15).toFixed(1), 15, 50)
  s.receivableDays    = clamp(Math.round(jitter(s.receivableDays, 0.01)), 15, 45)
  s.lastUpdated       = new Date().toISOString()
  return s
}

// ─── WebSocket server ─────────────────────────────────────────────
export function setupWebSocket(server, tickMs = 5000) {
  const wss = new WebSocketServer({ server, path: '/ws' })

  // Track subscriptions per client
  const clients = new Map()  // ws → Set<'individual'|'sme'>

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress
    console.log(`[WS] Client connected from ${ip}`)
    clients.set(ws, new Set(['individual']))  // default subscription

    // Send welcome + initial state
    ws.send(JSON.stringify({
      type:      'connected',
      message:   'FinFlow real-time stream connected',
      channels:  ['individual', 'sme'],
      timestamp: new Date().toISOString(),
    }))

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString())

        // Client can subscribe/unsubscribe channels
        // { type: 'subscribe',   channel: 'sme' }
        // { type: 'unsubscribe', channel: 'individual' }
        if (msg.type === 'subscribe' && ['individual','sme'].includes(msg.channel)) {
          clients.get(ws)?.add(msg.channel)
          ws.send(JSON.stringify({ type: 'subscribed', channel: msg.channel }))
        }
        if (msg.type === 'unsubscribe' && ['individual','sme'].includes(msg.channel)) {
          clients.get(ws)?.delete(msg.channel)
          ws.send(JSON.stringify({ type: 'unsubscribed', channel: msg.channel }))
        }

        // Ping/pong keepalive
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }))
        }
      } catch (_) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }))
      }
    })

    ws.on('close', () => {
      clients.delete(ws)
      console.log(`[WS] Client disconnected (${ip})`)
    })

    ws.on('error', (err) => console.error('[WS] Error:', err.message))
  })

  // ─── Broadcast ticker ─────────────────────────────────────────
  const interval = setInterval(() => {
    const indSnap = tickIndividual()
    const smeSnap = tickSme()

    for (const [ws, subs] of clients) {
      if (ws.readyState !== WebSocket.OPEN) continue

      if (subs.has('individual')) {
        ws.send(JSON.stringify({
          type:    'metrics',
          channel: 'individual',
          data:    indSnap,
        }))
      }

      if (subs.has('sme')) {
        ws.send(JSON.stringify({
          type:    'metrics',
          channel: 'sme',
          data:    smeSnap,
        }))
      }
    }
  }, tickMs)

  wss.on('close', () => clearInterval(interval))

  console.log(`[WS] Real-time server ready (tick every ${tickMs}ms)`)
  return wss
}
