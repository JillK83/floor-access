'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import InquiryCard from './InquiryCard'

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

interface RealtimeInquiryListProps {
  initialInquiries: Inquiry[]
}

export default function RealtimeInquiryList({ initialInquiries }: RealtimeInquiryListProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)

  const sortInquiries = (list: Inquiry[]) => {
    return [...list].sort((a, b) => {
      const isAPriority = a.intent_tag === 'Urgent' || a.intent_tag === 'High Intent / Sales'
      const isBPriority = b.intent_tag === 'Urgent' || b.intent_tag === 'High Intent / Sales'

      if (isAPriority && !isBPriority) return -1
      if (!isAPriority && isBPriority) return 1

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  useEffect(() => {
    // Initial sort
    setInquiries(sortInquiries(initialInquiries))

    // Realtime subscription
    const channel = supabase
      .channel('inquiries_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'inquiries' },
        (payload) => {
          const newInquiry = payload.new as Inquiry
          setInquiries((current) => sortInquiries([newInquiry, ...current]))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialInquiries])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
      {inquiries.length > 0 ? (
        inquiries.map((inquiry) => (
          <InquiryCard key={inquiry.id} inquiry={inquiry} />
        ))
      ) : (
        <div className="col-span-full py-20 text-center border border-dashed border-stone-800 rounded-sm">
          <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">No pending inquiries</p>
        </div>
      )}
    </div>
  )
}
