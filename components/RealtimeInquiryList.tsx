'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import InquiryCard from './InquiryCard'
import QuickReplyPanel from './QuickReplyPanel'

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

interface RealtimeInquiryListProps {
  initialInquiries: Inquiry[]
}

export default function RealtimeInquiryList({ initialInquiries }: RealtimeInquiryListProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    initialInquiries.length > 0 ? initialInquiries[0].id : null
  )

  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId) || null

  const sortInquiries = (list: Inquiry[]) => {
    return [...list].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  useEffect(() => {
    setInquiries(sortInquiries(initialInquiries))
  }, [initialInquiries])

  useEffect(() => {
    // Realtime subscription
    const channel = supabase
      .channel('inquiries_realtime_triage')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newInquiry = payload.new as Inquiry
            setInquiries((current) => sortInquiries([newInquiry, ...current]))
          } else if (payload.eventType === 'UPDATE') {
            const updatedInquiry = payload.new as Inquiry
            setInquiries((current) => 
              sortInquiries(current.map(i => i.id === updatedInquiry.id ? updatedInquiry : i))
            )
          } else if (payload.eventType === 'DELETE') {
            console.log('REALTIME triage sync: Removing record', payload.old.id)
            setInquiries((current) => current.filter(i => i.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleStatusUpdate = (id: string, status: string) => {
    setInquiries(current => 
      current.map(i => i.id === id ? { ...i, status } : i)
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)] min-h-[600px]">
      {/* Left Column: List */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <InquiryCard 
              key={inquiry.id} 
              inquiry={inquiry} 
              isSelected={selectedInquiryId === inquiry.id}
              onSelect={(i) => setSelectedInquiryId(i.id)}
            />
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-stone-800 rounded-sm">
            <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">No inquiries</p>
          </div>
        )}
      </div>

      {/* Right Column: Triage Detail */}
      <div className="flex-1 min-w-0">
        <QuickReplyPanel 
          inquiry={selectedInquiry} 
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  )
}
