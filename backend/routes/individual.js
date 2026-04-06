// routes/individual.js  –  All REST endpoints for Individual mode
import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import {
  individualTransactions,
  individualBudgets,
  individualGoals,
  individualAlerts,
  individualMetrics,
  incomeVsExpenses,
  spendingByCategory,
} from '../data/store.js'

const router = Router()

// ─── METRICS (dashboard summary) ───────────────────────────────
router.get('/metrics', (_req, res) => {
  res.json({
    ...individualMetrics,
    lastUpdated: new Date().toISOString(),
  })
})

// ─── CHART DATA ─────────────────────────────────────────────────
router.get('/charts/income-vs-expenses', (_req, res) => {
  res.json(incomeVsExpenses)
})

router.get('/charts/spending', (_req, res) => {
  res.json(spendingByCategory)
})

// ─── TRANSACTIONS ────────────────────────────────────────────────
router.get('/transactions', (req, res) => {
  const { cat, search, limit = 50, offset = 0 } = req.query
  let result = [...individualTransactions]

  if (cat && cat !== 'All') result = result.filter(t => t.cat === cat)
  if (search) result = result.filter(t =>
    t.desc.toLowerCase().includes(search.toLowerCase())
  )

  // Sort newest first
  result.sort((a, b) => new Date(b.date) - new Date(a.date))

  const total   = result.length
  const sliced  = result.slice(Number(offset), Number(offset) + Number(limit))

  // Summary stats
  const credits = result.filter(t => t.amt > 0).reduce((s, t) => s + t.amt, 0)
  const debits  = result.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0)

  res.json({ data: sliced, total, credits, debits, netFlow: credits - debits })
})

router.post('/transactions', (req, res) => {
  const { date, desc, cat, amt } = req.body
  if (!desc || amt === undefined || amt === null) {
    return res.status(400).json({ error: 'desc and amt are required' })
  }

  const txn = {
    id:   uuid(),
    date: date || new Date().toISOString().split('T')[0],
    desc,
    cat:  cat || 'Other',
    amt:  Number(amt),
  }
  individualTransactions.unshift(txn)
  res.status(201).json(txn)
})

router.delete('/transactions/:id', (req, res) => {
  const idx = individualTransactions.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = individualTransactions.splice(idx, 1)
  res.json({ deleted: removed })
})

// ─── BUDGETS ─────────────────────────────────────────────────────
router.get('/budgets', (_req, res) => {
  const total  = individualBudgets.reduce((s, b) => s + b.budget, 0)
  const spent  = individualBudgets.reduce((s, b) => s + b.spent, 0)
  res.json({ data: individualBudgets, totalBudget: total, totalSpent: spent, remaining: total - spent })
})

router.post('/budgets', (req, res) => {
  const { name, budget } = req.body
  if (!name || !budget) return res.status(400).json({ error: 'name and budget required' })
  const item = { id: uuid(), name, budget: Number(budget), spent: 0 }
  individualBudgets.push(item)
  res.status(201).json(item)
})

router.patch('/budgets/:id', (req, res) => {
  const item = individualBudgets.find(b => b.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  if (req.body.budget !== undefined) item.budget = Number(req.body.budget)
  if (req.body.spent  !== undefined) item.spent  = Number(req.body.spent)
  if (req.body.name   !== undefined) item.name   = req.body.name
  res.json(item)
})

router.delete('/budgets/:id', (req, res) => {
  const idx = individualBudgets.findIndex(b => b.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = individualBudgets.splice(idx, 1)
  res.json({ deleted: removed })
})

// ─── GOALS ───────────────────────────────────────────────────────
router.get('/goals', (_req, res) => {
  const totalSaved  = individualGoals.reduce((s, g) => s + g.current, 0)
  const totalTarget = individualGoals.reduce((s, g) => s + g.target, 0)
  res.json({
    data: individualGoals,
    totalSaved,
    totalTarget,
    completionPct: Math.round(totalSaved / totalTarget * 100),
  })
})

router.post('/goals', (req, res) => {
  const { name, target, deadline, monthly } = req.body
  if (!name || !target) return res.status(400).json({ error: 'name and target required' })
  const goal = {
    id: uuid(), name,
    target: Number(target), current: 0,
    deadline: deadline || '', monthly: Number(monthly) || 0,
  }
  individualGoals.push(goal)
  res.status(201).json(goal)
})

router.patch('/goals/:id/deposit', (req, res) => {
  const goal = individualGoals.find(g => g.id === req.params.id)
  if (!goal) return res.status(404).json({ error: 'Not found' })
  const amount = Number(req.body.amount)
  if (!amount || amount <= 0) return res.status(400).json({ error: 'amount must be > 0' })
  goal.current = Math.min(goal.target, goal.current + amount)
  res.json(goal)
})

router.delete('/goals/:id', (req, res) => {
  const idx = individualGoals.findIndex(g => g.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = individualGoals.splice(idx, 1)
  res.json({ deleted: removed })
})

// ─── ALERTS ──────────────────────────────────────────────────────
router.get('/alerts', (_req, res) => {
  res.json({
    data: [...individualAlerts].sort((a, b) => new Date(b.time) - new Date(a.time)),
    counts: {
      danger: individualAlerts.filter(a => a.type === 'danger').length,
      warn:   individualAlerts.filter(a => a.type === 'warn').length,
      info:   individualAlerts.filter(a => a.type === 'info').length,
      success:individualAlerts.filter(a => a.type === 'success').length,
    }
  })
})

router.delete('/alerts/:id', (req, res) => {
  const idx = individualAlerts.findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = individualAlerts.splice(idx, 1)
  res.json({ deleted: removed })
})

router.delete('/alerts', (_req, res) => {
  individualAlerts.length = 0
  res.json({ cleared: true })
})

export default router
