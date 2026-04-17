import React from 'react'

interface StatusBadgeProps {
  intent: string
}

export default function StatusBadge({ intent }: StatusBadgeProps) {
  let colors = 'bg-stone-700 text-stone-200'

  if (intent === 'High Intent / Sales') {
    colors = 'bg-red-900 text-red-200'
  } else if (intent === 'Urgent') {
    colors = 'bg-amber-900 text-amber-200'
  } else if (intent === 'Appointment Request') {
    colors = 'bg-blue-900 text-blue-200'
  } else if (intent === 'Medium / General Inquiry' || intent === 'General Inquiry') {
    colors = 'bg-stone-700 text-stone-200'
  }

  return (
    <span className={`rounded-sm font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider ${colors}`}>
      {intent}
    </span>
  )
}
