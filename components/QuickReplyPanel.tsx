'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageSquare, Check, Copy } from 'lucide-react'
import { openSMS } from '@/lib/sms'
import { updateInquiryStatus } from '@/actions/updateInquiryStatus'

interface Inquiry {
  id: string
  customer_name: string
  customer_phone: string
  item_of_interest: string
  customer_message: string
  sentiment: string
  intent_tag: string
  sms_reply: string
  ai_reply_draft?: string
  status: string
  created_at: string
  item_id?: string
  price?: number
}

interface QuickReplyPanelProps {
  inquiry: Inquiry | null
  onStatusUpdate: (id: string, status: string) => void
}

export default function QuickReplyPanel({ inquiry, onStatusUpdate }: QuickReplyPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [smsCopied, setSmsCopied] = useState(false)

  if (!inquiry) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-stone-800 rounded-sm bg-matte-black/50">
        <MessageSquare className="w-12 h-12 text-stone-700 mb-4 stroke-[1]" />
        <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
          Select an inquiry to begin triage
        </p>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inquiry.ai_reply_draft || inquiry.sms_reply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReply = () => {
    const draft = inquiry.ai_reply_draft || inquiry.sms_reply
    const launched = openSMS(inquiry.customer_phone, draft)
    
    if (!launched) {
      navigator.clipboard.writeText(draft)
      setSmsCopied(true)
      setTimeout(() => setSmsCopied(false), 3000)
    }
  }

  const markAsReplied = async () => {
    setIsUpdating(true)
    try {
      await updateInquiryStatus(inquiry.id, 'replied')
      onStatusUpdate(inquiry.id, 'replied')
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={inquiry.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="h-full bg-charcoal border border-white/5 rounded-sm flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-matte-black/20">
          <div className="max-w-[720px] mx-auto space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <p className="font-mono text-[10px] text-gold/60 uppercase tracking-[0.4em]">Quick Response Atelier</p>
                <h2 className="text-4xl font-serif text-white tracking-tight leading-none">
                  {inquiry.customer_name || 'Anonymous client'}
                </h2>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] text-stone-600 uppercase tracking-widest mb-2">Status</p>
                <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-sm border ${
                  inquiry.status === 'replied' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-gold/10 text-gold border-gold/20'
                }`}>
                  {inquiry.status}
                </span>
              </div>
            </div>
            
            <div className="flex gap-12 py-2 items-baseline">
              <div className="space-y-1.5">
                <p className="font-mono text-[9px] text-stone-600 uppercase tracking-[0.2em] whitespace-nowrap">Interest</p>
                <p className="text-sm text-stone-300 font-medium">{inquiry.item_of_interest}</p>
              </div>
              {inquiry.price && (
                <div className="space-y-1.5 border-l border-white/10 pl-12">
                  <p className="font-mono text-[9px] text-stone-600 uppercase tracking-[0.2em] whitespace-nowrap">Valuation</p>
                  <p className="text-sm text-gold font-medium">${Number(inquiry.price).toLocaleString()}</p>
                </div>
              )}
              <div className="space-y-1.5 border-l border-white/10 pl-12">
                <p className="font-mono text-[9px] text-stone-600 uppercase tracking-[0.2em] whitespace-nowrap">Contact</p>
                <p className="text-sm text-stone-400 font-mono italic tracking-tight">{inquiry.customer_phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <div className="max-w-[720px] mx-auto p-10 space-y-12">
            {/* Customer Message */}
            <section className="space-y-5">
              <h3 className="font-mono text-[10px] text-stone-500 uppercase tracking-[0.25em] font-medium">Inquiry Message</h3>
              <div className="bg-matte-black/50 border border-white/5 p-10 rounded-sm">
                <p className="text-stone-300 italic serif leading-relaxed text-xl">
                  &quot;{inquiry.customer_message}&quot;
                </p>
              </div>
            </section>

            {/* AI Draft */}
            <section className="space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-[10px] text-gold uppercase tracking-[0.25em] font-medium">AI Concierge Draft</h3>
                <button 
                  onClick={handleCopy}
                  className="text-stone-500 hover:text-white transition-colors flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy Draft'}
                </button>
              </div>
              <div className="bg-gold/5 border border-gold/10 p-10 rounded-sm relative group">
                <p className="text-stone-200 leading-relaxed font-sans text-xl">
                  {inquiry.ai_reply_draft || inquiry.sms_reply}
                </p>
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-mono text-gold uppercase tracking-[0.2em]">GPT-4o Optimized</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="p-10 bg-matte-black-dark border-t border-white/5 grid grid-cols-2 gap-5 shrink-0">
          <button
            onClick={handleReply}
            className={`flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-widest font-bold h-14 rounded-sm transition-all active:scale-[0.98] ${
              smsCopied ? 'bg-gold text-matte-black' : 'bg-white text-matte-black hover:bg-stone-200'
            }`}
          >
            {smsCopied ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
            {smsCopied ? 'Ready to Paste' : 'Launch SMS Atelier'}
          </button>
          <button
            onClick={markAsReplied}
            disabled={isUpdating || inquiry.status === 'replied'}
            className="flex items-center justify-center gap-3 border border-stone-800 text-stone-500 font-mono text-[10px] uppercase tracking-widest font-bold h-14 rounded-sm hover:border-gold/30 hover:text-gold transition-all disabled:opacity-30 active:scale-[0.98]"
          >
            {isUpdating ? 'Updating...' : (
              <>
                <Check className="w-3 h-3" />
                Mark as Replied
              </>
            )}
          </button>
        </div>

        {/* Global Feedback Toast (Gold Glow) */}
        <AnimatePresence>
          {smsCopied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
              <div className="bg-matte-black/90 border border-gold/40 backdrop-blur-xl px-10 py-5 rounded-sm shadow-[0_20px_50px_rgba(197,160,89,0.2)] flex items-center gap-6">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Copy className="w-4 h-4 text-gold" />
                </div>
                <div className="space-y-1">
                  <p className="text-gold font-mono text-[9px] uppercase tracking-[0.3em] font-bold">Desktop Detected</p>
                  <p className="text-stone-300 font-serif text-sm italic">Draft captured to clipboard for manual paste.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
