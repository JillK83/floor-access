'use client'

import { useState } from 'react'
import { openSMS } from '@/lib/sms.ts'
import { updateItemStatus } from '@/actions/updateItemStatus'
import StatusBadge from './StatusBadge'

interface Inquiry {
  id: string
  customer_name: string
  customer_phone: string
  item_of_interest: string
  customer_message: string
  sentiment: string
  intent_tag: string
  sms_reply: string
  created_at: string
  item_id?: string
}

export default function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const [isPending, setIsPending] = useState(false)

  const handleMarkAsPending = async () => {
    // Optimistic dimming
    setIsPending(true)
    
    if (inquiry.item_id) {
      try {
        await updateItemStatus(inquiry.item_id, 'pending')
      } catch (error) {
        console.error('Failed to update item status:', error)
        // Optionally revert on error, but user said optimistic dimming to show it's 'actioned'
      }
    }
  }

  const handleReply = () => {
    openSMS(inquiry.customer_phone, inquiry.sms_reply)
  }

  return (
    <div className={`border border-stone-800 bg-white/5 p-6 space-y-4 transition-opacity duration-500 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <header className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h3 className="font-mono text-xs text-stone-400 uppercase tracking-widest leading-none">
            {inquiry.item_of_interest || 'General Inquiry'}
          </h3>
          <p className="text-xl font-serif text-stone-100">{inquiry.customer_name || 'Anonymous'}</p>
        </div>
        <StatusBadge intent={inquiry.intent_tag} />
      </header>

      <p className="text-stone-300 text-sm leading-relaxed min-h-[3rem]">
        &quot;{inquiry.customer_message}&quot;
      </p>

      <div className="flex justify-between items-end pt-2">
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-stone-500 uppercase tracking-tighter">
            {new Date(inquiry.created_at).toLocaleString()}
          </p>
          <p className="font-mono text-xs text-gold/80">{inquiry.customer_phone}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReply}
            className="border border-stone-500 text-stone-200 px-4 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest hover:bg-stone-800 transition-all"
          >
            Reply via SMS
          </button>
          
          {inquiry.item_id && (
            <button
              onClick={handleMarkAsPending}
              disabled={isPending}
              className="bg-stone-200 text-stone-900 px-4 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
            >
              Mark as Pending
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
