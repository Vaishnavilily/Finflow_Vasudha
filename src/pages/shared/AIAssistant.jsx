// src/pages/shared/AIAssistant.jsx  –  Backend-powered version
// Sends all AI requests through /api/ai/chat (API key stays on server)
import React, { useState, useRef, useEffect } from 'react'
import { ai } from '../../api/client.js'

const IND_SUGGESTIONS = [
  'How can I reduce my monthly expenses?',
  'What is the best SIP strategy for ₹10,000/month?',
  'Should I choose old or new tax regime?',
  'How much emergency fund do I need?',
  'Explain the 50-30-20 budgeting rule',
  'How to start investing in mutual funds?',
  'What is SWP in mutual funds?',
  'How to plan for early retirement at 45?',
]

const SME_SUGGESTIONS = [
  'How do I improve my business cash flow?',
  'What are the best funding options for my SME?',
  'Explain GST input tax credit for my business',
  'How to calculate the right pricing for my service?',
  'What government schemes are available for MSMEs?',
  'How to improve my accounts receivable cycle?',
  'Explain the difference between GSTR-1 and GSTR-3B',
  'How to reduce my business tax liability?',
]

const INSIGHTS = {
  individual: [
    { cls: 'alert-info',    icon: '💡', text: 'Your Food spending (₹9,200) exceeded budget. Meal prepping 3 days/week can save ₹2,500/month.' },
    { cls: 'alert-success', icon: '📈', text: 'Investing ₹5,000/month in a Nifty 50 index fund at 12% CAGR gives ₹44.6L in 15 years.' },
    { cls: 'alert-warn',    icon: '⚠️', text: 'Your debt-to-income ratio is 14%. Prepaying home loan EMI by ₹2,000/month saves ₹3.8L in interest.' },
    { cls: 'alert-info',    icon: '🎯', text: 'You are 4 months away from completing your New Laptop goal at current pace.' },
  ],
  sme: [
    { cls: 'alert-info',    icon: '💡', text: 'Offering early-payment discounts (2% for 10-day payment) can reduce receivable days from 28 to 18.' },
    { cls: 'alert-success', icon: '📊', text: 'Your Q1 revenue growth of 12% YoY exceeds the industry average of 8.4% for IT services SMEs.' },
    { cls: 'alert-warn',    icon: '⚠️', text: 'High payroll-to-revenue ratio at 30.6%. Industry benchmark is 25–28%.' },
    { cls: 'alert-info',    icon: '💰', text: 'You may qualify for CGTMSE credit guarantee — get a ₹25L working capital loan without collateral.' },
  ]
}

const FALLBACKS = {
  individual: [
    'To reduce monthly expenses, track every rupee for 30 days. Use the 50-30-20 rule: 50% needs, 30% wants, 20% savings. **Next step:** List all subscriptions and cancel unused ones today.',
    'For a ₹10,000/month SIP, split: Nifty 50 index fund (50%), flexi-cap fund (30%), small-cap fund (20%). At 12% CAGR over 15 years ≈₹50L. **Next step:** Open a Zerodha or Groww account this week.',
    'For FY 2024-25 above ₹15L income with deductions over ₹3.75L, Old Regime is usually better. **Next step:** Use the Tax Planner to compare both scenarios.',
  ],
  sme: [
    'To improve SME cash flow: (1) Offer 2% early-payment discounts, (2) Invoice immediately on delivery, (3) Use MSME Samadhaan for delayed payments. **Next step:** Send reminders to all invoices older than 15 days.',
    'Top SME funding: MSME Mudra Loan (up to ₹10L, 7.5%), CGTMSE (up to ₹2Cr, no collateral). **Next step:** Apply for Udyam Registration if not done.',
    'Reduce GST liability: Max out ITC on business purchases, reconcile GSTR-2B monthly, never miss GSTR-1 deadline (₹200/day late fee). **Next step:** Reconcile last 3 months ITC claims.',
  ]
}

export default function AIAssistant({ mode }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am FinFlow AI, your ${mode === 'sme' ? 'business' : 'personal'} financial assistant. I can help you with ${mode === 'sme' ? 'cash flow management, GST filing, funding, pricing strategy, and business growth' : 'budgeting, investments, tax planning, goal setting, and financial forecasting'}. What would you like to know today?`
    }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const suggestions = mode === 'sme' ? SME_SUGGESTIONS : IND_SUGGESTIONS
  const insights    = INSIGHTS[mode] || INSIGHTS.individual

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')
    const updatedMsgs = [...messages, { role: 'user', text: userMsg }]
    setMessages(updatedMsgs)
    setLoading(true)

    try {
      const history = updatedMsgs.slice(1, -1).map(m => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))
      const data = await ai.chat(mode, history, userMsg)
      if (data.fallback) {
        const pool  = FALLBACKS[mode] || FALLBACKS.individual
        setMessages(prev => [...prev, { role: 'assistant', text: pool[Math.floor(Math.random() * pool.length)] }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
      }
    } catch (_) {
      const pool  = FALLBACKS[mode] || FALLBACKS.individual
      setMessages(prev => [...prev, { role: 'assistant', text: pool[Math.floor(Math.random() * pool.length)] }])
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      <div className="grid-2">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>FinFlow AI</div>
              <div style={{ fontSize: 11, color: 'var(--accent2)' }}>● Online — {mode === 'sme' ? 'Business' : 'Personal'} Mode (via backend proxy)</div>
            </div>
          </div>
          <div className="ai-chat">
            <div className="chat-msgs">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
                />
              ))}
              {loading && (
                <div className="msg msg-ai">
                  <div className="typing"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="chat-input-row">
              <input className="input" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey} placeholder="Ask anything about your finances..." disabled={loading} />
              <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="card mb-16">
            <div className="card-title">Quick Questions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {suggestions.map((q, i) => (
                <button key={i} className="btn btn-outline btn-sm" style={{ textAlign: 'left', fontSize: 12 }}
                  onClick={() => sendMessage(q)} disabled={loading}>{q}</button>
              ))}
            </div>
          </div>
          <div className="card mb-16">
            <div className="card-title">AI Insights for You</div>
            {insights.map((ins, i) => (
              <div key={i} className={`alert-item ${ins.cls}`}>
                <span>{ins.icon}</span>
                <div className="text-sm">{ins.text}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">Backend Status</div>
            <div className="alert-item alert-info">
              <span>🔌</span>
              <div className="text-sm">
                AI requests are proxied securely through <code style={{ background: 'var(--bg3)', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>localhost:4000/api/ai/chat</code>.
                Set <code style={{ background: 'var(--bg3)', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>ANTHROPIC_API_KEY</code> in the backend <code style={{ background: 'var(--bg3)', padding: '1px 4px', borderRadius: 4, fontSize: 11 }}>.env</code> file.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
