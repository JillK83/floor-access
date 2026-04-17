'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { openSMS } from '@/lib/sms'
import { updateItemStatus } from '@/actions/updateItemStatus'
import StatusBadge from './StatusBadge'

interface Inquiry {
  id: string
  customer_name: string
  customer_phone: string
  item_of_interest: string
  customer_message: string
  category: string
  sentiment: string
  intent_tag: string
  sms_reply: string
  status: string
  created_at: string
  item_id?: string
  price?: number
}

interface InquiryCardProps {
  inquiry: Inquiry
  isSelected?: boolean
  onSelect?: (inquiry: Inquiry) => void
}

export default function InquiryCard({ inquiry, isSelected, onSelect }: InquiryCardProps) {
  const isPending = inquiry.status === 'pending' || inquiry.status === 'replied'
  const isNew = inquiry.status === 'new'
  const isGeneral = inquiry.item_of_interest === 'General Concierge'
  const isLogistics = inquiry.category === 'Delivery'
  const isUrgent = inquiry.category === 'Delivery' || inquiry.category === 'Lost & Found'

  // Override logic: Force Urgent if Frustrated, Lost & Found, or Delivery
  const displayIntent = (inquiry.sentiment === 'frustrated' || isUrgent)
    ? 'Urgent'
    : inquiry.intent_tag

  const sentimentStyles = {
    positive: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]',
    frustrated: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]',
    neutral: 'bg-stone-500'
  }

  return (
    <div 
      onClick={() => onSelect?.(inquiry)}
      className={`relative border cursor-pointer transition-all duration-300 p-6 space-y-5 rounded-sm flex flex-col ${
        isSelected 
          ? 'bg-gold/10 border-gold shadow-[0_0_20px_rgba(184,160,74,0.15)] z-10' 
          : 'bg-white/5 border-stone-800 hover:border-stone-600 shadow-lg'
      } ${isPending ? 'opacity-60' : 'opacity-100'} ${
        isNew ? 'ring-1 ring-gold/20 animate-pulse-subtle' : ''
      }`}
    >
      <header className="flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-between items-start gap-4">
          <p className="text-xl font-serif text-white font-semibold leading-tight break-words overflow-wrap-anywhere tracking-tight">
            {inquiry.customer_name || 'Anonymous client'}
          </p>
          {isNew && (
            <div className="shrink-0 pt-1.5">
              <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#c5a059]" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="shrink-0">
            <StatusBadge intent={displayIntent} />
          </div>
          <h3 className="font-mono text-[9px] text-stone-500 uppercase tracking-[0.2em] font-light leading-none">
            · {inquiry.item_of_interest || 'General Inquiry'}
          </h3>
          {isLogistics && (
            <span className="bg-blue-500/10 text-blue-400 font-mono text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-light border border-blue-500/20">
              Logistics
            </span>
          )}
        </div>
      </header>

      <p className="text-stone-400 text-sm leading-relaxed line-clamp-2 italic font-serif">
        &quot;{inquiry.customer_message}&quot;
      </p>

      <div className="flex justify-between items-end pt-2 border-t border-white/5 mt-auto">
        <div className="space-y-1.5">
          <p className="font-mono text-[9px] text-stone-600 uppercase tracking-tighter">
            {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] text-stone-400">
            {inquiry.customer_phone}
            {inquiry.sentiment && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                <div className={`w-1.5 h-1.5 rounded-full ${sentimentStyles[inquiry.sentiment as keyof typeof sentimentStyles] || sentimentStyles.neutral}`} />
                <span className={`uppercase tracking-widest text-[8px] font-medium ${
                  inquiry.sentiment === 'positive' ? 'text-green-500' : 
                  inquiry.sentiment === 'frustrated' ? 'text-orange-500' : 
                  'text-stone-500'
                }`}>
                  {inquiry.sentiment === 'frustrated' ? 'Frustrated' : 
                   inquiry.sentiment === 'positive' ? 'Positive' : 'Neutral'}
                </span>
              </div>
            )}
          </div>
        </div>

        {inquiry.price && (
          <div className="text-right">
            <p className="text-sm font-serif text-gold leading-none">${Number(inquiry.price).toLocaleString()}</p>
          </div>
        )}
      </div>

      {isSelected && !isGeneral && (inquiry.item_id || inquiry.item_of_interest) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 mt-2"
        >
          <button
            onClick={async (e) => {
              e.stopPropagation()
              console.log('--- ADMIN CLICK: Confirm Availability ---')
              console.log('Item:', inquiry.item_of_interest)
              console.log('ID:', inquiry.item_id)
              
              await updateItemStatus(inquiry.item_id, 'pending', inquiry.item_of_interest)
              
              console.log('--- ADMIN CLICK: Complete ---')
            }}
            className="w-full bg-[#c5a059] text-matte-black font-mono text-[10px] font-bold uppercase tracking-[0.2em] py-3 rounded-sm hover:bg-gold-light transition-all active:scale-[0.98]"
          >
            Confirm Availability
          </button>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; background-color: rgba(197, 160, 89, 0.05); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
