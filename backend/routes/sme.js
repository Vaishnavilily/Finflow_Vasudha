// routes/sme.js  –  All REST endpoints for SME mode
import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import {
  smeExpenses,
  smeInvoices,
  smeCashFlow,
  smeKpis,
  smeAlerts,
} from '../data/store.js'

const router = Router()

// ─── METRICS (dashboard KPIs) ────────────────────────────────────
router.get('/metrics', (_req, res) => {
  res.json({ ...smeKpis, lastUpdated: new Date().toISOString() })
})

// ─── CHART DATA ──────────────────────────────────────────────────
router.get('/charts/cashflow', (_req, res) => {
  res.json(smeCashFlow)
})

router.get('/charts/expenses-breakdown', (_req, res) => {
  // Aggregate by category
  const cats = {}
  smeExpenses.forEach(e => {
    cats[e.cat] = (cats[e.cat] || 0) + e.amt
  })
  const total = Object.values(cats).reduce((s, v) => s + v, 0)
  res.json(
    Object.entries(cats).map(([label, value]) => ({
      label,
      value,
      pct: Math.round(value / total * 100),
    }))
  )
})

// ─── EXPENSES ────────────────────────────────────────────────────
router.get('/expenses', (req, res) => {
  const { cat, status, search, limit = 50, offset = 0 } = req.query
  let result = [...smeExpenses]

  if (cat)    result = result.filter(e => e.cat === cat)
  if (status) result = result.filter(e => e.status === status)
  if (search) result = result.filter(e =>
    e.vendor.toLowerCase().includes(search.toLowerCase())
  )

  result.sort((a, b) => new Date(b.date) - new Date(a.date))

  const total      = result.length
  const totalAmt   = result.reduce((s, e) => s + e.amt, 0)
  const pendingAmt = result.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amt, 0)
  const sliced     = result.slice(Number(offset), Number(offset) + Number(limit))

  res.json({ data: sliced, total, totalAmt, pendingAmt })
})

router.post('/expenses', (req, res) => {
  const { date, vendor, cat, amt, status } = req.body
  if (!vendor || !amt) return res.status(400).json({ error: 'vendor and amt required' })

  const expense = {
    id:     uuid(),
    date:   date   || new Date().toISOString().split('T')[0],
    vendor,
    cat:    cat    || 'Operations',
    amt:    Number(amt),
    status: status || 'Pending',
  }
  smeExpenses.unshift(expense)
  res.status(201).json(expense)
})

router.patch('/expenses/:id', (req, res) => {
  const item = smeExpenses.find(e => e.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  Object.assign(item, req.body)
  res.json(item)
})

router.delete('/expenses/:id', (req, res) => {
  const idx = smeExpenses.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = smeExpenses.splice(idx, 1)
  res.json({ deleted: removed })
})

// ─── INVOICES ────────────────────────────────────────────────────
router.get('/invoices', (req, res) => {
  const { status, search } = req.query
  let result = [...smeInvoices]

  if (status) result = result.filter(i => i.status === status)
  if (search) result = result.filter(i =>
    i.client.toLowerCase().includes(search.toLowerCase()) ||
    i.no.toLowerCase().includes(search.toLowerCase())
  )

  const totalPending  = result.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amt, 0)
  const totalOverdue  = result.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amt, 0)
  const overdueCount  = result.filter(i => i.status === 'Overdue').length

  res.json({ data: result, totalPending, totalOverdue, overdueCount })
})

router.post('/invoices', (req, res) => {
  const { client, amt, due } = req.body
  if (!client || !amt || !due) return res.status(400).json({ error: 'client, amt and due required' })

  // Auto-generate invoice number
  const lastNo = smeInvoices.length > 0
    ? parseInt(smeInvoices[smeInvoices.length - 1].no.split('-').pop()) + 1
    : 1
  const no = `INV-2025-${String(lastNo).padStart(3, '0')}`

  const invoice = {
    id:     uuid(),
    no,
    client,
    amt:    Number(amt),
    due,
    status: 'Pending',
  }
  smeInvoices.push(invoice)
  res.status(201).json(invoice)
})

router.patch('/invoices/:id/status', (req, res) => {
  const inv = smeInvoices.find(i => i.id === req.params.id)
  if (!inv) return res.status(404).json({ error: 'Not found' })
  const allowed = ['Pending', 'Overdue', 'Paid', 'Cancelled']
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` })
  }
  inv.status = req.body.status
  if (req.body.status === 'Paid') inv.paidAt = new Date().toISOString()
  res.json(inv)
})

router.delete('/invoices/:id', (req, res) => {
  const idx = smeInvoices.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = smeInvoices.splice(idx, 1)
  res.json({ deleted: removed })
})

// ─── CASH FLOW FORECAST ──────────────────────────────────────────
router.get('/cashflow/summary', (_req, res) => {
  const months = smeCashFlow.labels
  const net    = smeCashFlow.inflows.map((v, i) => v - smeCashFlow.outflows[i])
  const latest = net[net.length - 1]
  const avg    = Math.round(net.reduce((s, v) => s + v, 0) / net.length)

  // Project next 3 months using simple trend
  const trend  = (net[net.length - 1] - net[0]) / (net.length - 1)
  const projected = [1, 2, 3].map(i => Math.round(latest + trend * i))

  res.json({
    history:   { labels: months, inflows: smeCashFlow.inflows, outflows: smeCashFlow.outflows, net },
    avgNetCashFlow: avg,
    projectedNext3Months: projected,
    bufferDays: Math.round(latest / (smeCashFlow.outflows[smeCashFlow.outflows.length - 1] / 30)),
  })
})

// ─── ALERTS ──────────────────────────────────────────────────────
router.get('/alerts', (_req, res) => {
  res.json({
    data: [...smeAlerts].sort((a, b) => new Date(b.time) - new Date(a.time)),
    counts: {
      danger:  smeAlerts.filter(a => a.type === 'danger').length,
      warn:    smeAlerts.filter(a => a.type === 'warn').length,
      info:    smeAlerts.filter(a => a.type === 'info').length,
      success: smeAlerts.filter(a => a.type === 'success').length,
    }
  })
})

router.delete('/alerts/:id', (req, res) => {
  const idx = smeAlerts.findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = smeAlerts.splice(idx, 1)
  res.json({ deleted: removed })
})

router.delete('/alerts', (_req, res) => {
  smeAlerts.length = 0
  res.json({ cleared: true })
})

export default router
