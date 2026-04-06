// src/api/client.js  –  FinFlow Frontend API Client
//
// Drop this file into your finflow/src/api/ folder.
// Import helpers from here instead of hardcoding fetch() calls in pages.
//
// Usage:
//   import api from '../api/client.js'
//   const txns = await api.individual.getTransactions({ cat: 'Food' })

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// ─── raw fetch helper ─────────────────────────────────────────────
async function req(path, options = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── INDIVIDUAL endpoints ─────────────────────────────────────────
export const individual = {
  getMetrics:          ()        => req('/api/individual/metrics'),
  getIncomeVsExpenses: ()        => req('/api/individual/charts/income-vs-expenses'),
  getSpending:         ()        => req('/api/individual/charts/spending'),

  getTransactions:     (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return req(`/api/individual/transactions${qs ? '?' + qs : ''}`)
  },
  addTransaction:      (data)    => req('/api/individual/transactions',  { method: 'POST',   body: data }),
  deleteTransaction:   (id)      => req(`/api/individual/transactions/${id}`, { method: 'DELETE' }),

  getBudgets:          ()        => req('/api/individual/budgets'),
  addBudget:           (data)    => req('/api/individual/budgets',        { method: 'POST',   body: data }),
  updateBudget:        (id, data)=> req(`/api/individual/budgets/${id}`,  { method: 'PATCH',  body: data }),
  deleteBudget:        (id)      => req(`/api/individual/budgets/${id}`,  { method: 'DELETE' }),

  getGoals:            ()        => req('/api/individual/goals'),
  addGoal:             (data)    => req('/api/individual/goals',           { method: 'POST',   body: data }),
  depositToGoal:       (id, amt) => req(`/api/individual/goals/${id}/deposit`, { method: 'PATCH', body: { amount: amt } }),
  deleteGoal:          (id)      => req(`/api/individual/goals/${id}`,    { method: 'DELETE' }),

  getAlerts:           ()        => req('/api/individual/alerts'),
  dismissAlert:        (id)      => req(`/api/individual/alerts/${id}`,   { method: 'DELETE' }),
  clearAlerts:         ()        => req('/api/individual/alerts',          { method: 'DELETE' }),
}

// ─── SME endpoints ───────────────────────────────────────────────
export const sme = {
  getMetrics:          ()        => req('/api/sme/metrics'),
  getCashFlow:         ()        => req('/api/sme/charts/cashflow'),
  getExpensesBreakdown:()        => req('/api/sme/charts/expenses-breakdown'),
  getCashFlowSummary:  ()        => req('/api/sme/cashflow/summary'),

  getExpenses:         (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return req(`/api/sme/expenses${qs ? '?' + qs : ''}`)
  },
  addExpense:          (data)    => req('/api/sme/expenses',              { method: 'POST',   body: data }),
  updateExpense:       (id, data)=> req(`/api/sme/expenses/${id}`,        { method: 'PATCH',  body: data }),
  deleteExpense:       (id)      => req(`/api/sme/expenses/${id}`,        { method: 'DELETE' }),

  getInvoices:         (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return req(`/api/sme/invoices${qs ? '?' + qs : ''}`)
  },
  addInvoice:          (data)    => req('/api/sme/invoices',              { method: 'POST',   body: data }),
  updateInvoiceStatus: (id, status) => req(`/api/sme/invoices/${id}/status`, { method: 'PATCH', body: { status } }),
  deleteInvoice:       (id)      => req(`/api/sme/invoices/${id}`,        { method: 'DELETE' }),

  getAlerts:           ()        => req('/api/sme/alerts'),
  dismissAlert:        (id)      => req(`/api/sme/alerts/${id}`,          { method: 'DELETE' }),
  clearAlerts:         ()        => req('/api/sme/alerts',                 { method: 'DELETE' }),
}

// ─── AI proxy endpoint ────────────────────────────────────────────
export const ai = {
  chat: (mode, messages, userMessage) =>
    req('/api/ai/chat', {
      method: 'POST',
      body: { mode, messages, userMessage },
    }),
}

// ─── WebSocket hook ───────────────────────────────────────────────
//
// Use in a React component:
//
//   const metrics = useRealtimeMetrics('individual')
//   // metrics updates every REALTIME_TICK_MS automatically
//
const WS_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000')
  .replace(/^http/, 'ws') + '/ws'

import { useState, useEffect, useRef } from 'react'

export function useRealtimeMetrics(channel = 'individual') {
  const [metrics, setMetrics]   = useState(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    let reconnectTimer = null

    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        // Subscribe to the requested channel
        ws.send(JSON.stringify({ type: 'subscribe', channel }))
        // Keepalive ping every 30s
        ws._pingTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN)
            ws.send(JSON.stringify({ type: 'ping' }))
        }, 30000)
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'metrics' && msg.channel === channel) {
            setMetrics(msg.data)
          }
        } catch (_) {}
      }

      ws.onclose = () => {
        setConnected(false)
        clearInterval(ws._pingTimer)
        // Auto-reconnect after 3 seconds
        reconnectTimer = setTimeout(connect, 3000)
      }

      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      clearTimeout(reconnectTimer)
      if (wsRef.current) {
        clearInterval(wsRef.current._pingTimer)
        wsRef.current.close()
      }
    }
  }, [channel])

  return { metrics, connected }
}

// ─── Default export convenience ───────────────────────────────────
export default { individual, sme, ai }
