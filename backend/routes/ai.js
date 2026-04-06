// routes/ai.js  –  Secure proxy for Anthropic API calls
//
// All AI requests pass through here so the ANTHROPIC_API_KEY
// never lives in the browser / frontend bundle.
//
import { Router } from 'express'

const router  = Router()
const MODEL   = 'claude-sonnet-4-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

// POST /api/ai/chat
// Body: { mode: 'individual'|'sme', messages: [{role, content}], userMessage: string }
router.post('/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    // Return a helpful fallback so the UI still works without a key
    return res.status(503).json({
      error: 'AI not configured',
      fallback: true,
      message: 'Set ANTHROPIC_API_KEY in .env to enable live AI responses.',
    })
  }

  const { mode = 'individual', messages = [], userMessage } = req.body
  if (!userMessage) return res.status(400).json({ error: 'userMessage is required' })

  const systemPrompt = mode === 'sme'
    ? `You are FinFlow AI, a smart financial assistant for Indian SME/business users.
Give concise, accurate, actionable financial advice tailored to India.
Use ₹ for currency. Keep responses under 200 words. Be specific and practical.
For tax questions, reference Indian tax laws (Income Tax Act, GST Act, MSME Act).
Reference government schemes, GST compliance, and business growth strategies.
Always end with one actionable next step.`
    : `You are FinFlow AI, a smart financial assistant for Indian individual users.
Give concise, accurate, actionable personal finance advice tailored to India.
Use ₹ for currency. Keep responses under 200 words. Be specific and practical.
Reference Indian tax laws (Income Tax Act, 80C, 80D, etc.), mutual funds, SIPs.
Always end with one actionable next step.`

  const apiMessages = [
    ...messages.filter(m => m.role !== 'system'),
    { role: 'user', content: userMessage },
  ]

  try {
    const upstream = await fetch(API_URL, {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':          apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 400,
        system:     systemPrompt,
        messages:   apiMessages,
      }),
    })

    const data  = await upstream.json()

    if (!upstream.ok) {
      console.error('[AI proxy] Anthropic error:', data)
      return res.status(upstream.status).json({
        error: data?.error?.message || 'Anthropic API error',
      })
    }

    const reply = data?.content?.[0]?.text
    res.json({ reply, model: data.model, usage: data.usage })

  } catch (err) {
    console.error('[AI proxy] Fetch error:', err)
    res.status(502).json({ error: 'Failed to reach Anthropic API' })
  }
})

export default router
