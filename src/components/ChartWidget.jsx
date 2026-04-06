import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function ChartWidget({ id, config, height = 220 }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) { chartRef.current.destroy() }
    chartRef.current = new Chart(canvasRef.current, config)
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [JSON.stringify(config)])

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

/* ── Shared Chart.js defaults ── */
export const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 } } },
    y: { grid: { color: '#ffffff08' }, ticks: { color: '#64748b', font: { size: 11 } } },
  }
}

export const COLORS = {
  blue:   '#3b82f6',
  green:  '#10b981',
  amber:  '#f59e0b',
  red:    '#ef4444',
  purple: '#8b5cf6',
  teal:   '#06b6d4',
  gray:   '#94a3b8',
}

export function barDataset(label, data, color, extra = {}) {
  return {
    label,
    data,
    backgroundColor: color + '33',
    borderColor: color,
    borderWidth: 1.5,
    borderRadius: 4,
    ...extra,
  }
}

export function lineDataset(label, data, color, filled = false, extra = {}) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: filled ? color + '18' : 'transparent',
    fill: filled,
    tension: 0.4,
    pointRadius: 4,
    ...extra,
  }
}

export function legendPlugin() {
  return { display: true, labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 10 } }
}
