import React from 'react'

interface StatusBadgeProps {
  intent: string
}

export default function StatusBadge({ intent }: StatusBadgeProps) {
  let colors = 'bg-stone-800 text-stone-400 border-white/5'

  if (intent === 'High Intent' || intent === 'Urgent') {
    colors = 'bg-red-950/50 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
  } else if (intent === 'Medium Intent') {
    colors = 'bg-gold/10 text-gold border-gold/20'
  } else if (intent === 'Low Intent') {
    colors = 'bg-stone-800 text-stone-500 border-white/5'
  }

  return (
    <span className={`rounded-sm font-mono text-[9px] px-2 py-0.5 uppercase tracking-[0.15em] font-medium border ${colors}`}>
      {intent}
    </span>
  )
}
