'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import ItemCard from './ItemCard'
import InquiryDrawer from './InquiryDrawer'
import InquiryForm from './InquiryForm'

interface FloorItem {
  id: string
  name: string
  description: string
  image_url: string
  price: number
  status: 'available' | 'pending' | 'sold'
  created_at: string
}

interface FloorGalleryProps {
  items: FloorItem[]
}

export default function FloorGallery({ items: initialItems }: FloorGalleryProps) {
  console.log('CLIENT DEBUG: Gallery items:', initialItems)
  const [items, setItems] = useState<FloorItem[]>(initialItems)
  const [selectedItem, setSelectedItem] = useState<FloorItem | null>(null)
  const [isGlobalInquiryOpen, setIsGlobalInquiryOpen] = useState(false)
  const [isSuccessState, setIsSuccessState] = useState(false)

  useEffect(() => {
    // Realtime subscription for floor status updates
    const channel = supabase
      .channel('floor_status_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'floor_items' }, 
        (payload) => {
          console.log('Realtime update received:', payload)
          if (payload.eventType === 'INSERT') {
            setItems(prev => [payload.new as FloorItem, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev => prev.map(item => {
              if (item.id === payload.new.id) {
                console.log('GALLERY SYNC: Received update for ' + (payload.new as any).name)
                return { ...item, ...(payload.new as any) }
              }
              return item
            }))
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 pb-40">
      <header className="mb-16 space-y-4">
        <p className="font-mono text-xs text-[#c5a059] uppercase tracking-[0.4em]">Live Showroom Floor</p>
        <h2 className="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none">
          Missed <span className="text-stone-600 italic">Connections</span>
        </h2>
        <p className="text-stone-500 max-w-md font-mono text-[10px] uppercase tracking-widest leading-relaxed">
          Browse our active inventory. Tap an item to get direct floor access via SMS for pricing, delivery, or details.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {items.map((item) => (
          <ItemCard 
            key={item.id} 
            item={item} 
            onClick={() => setSelectedItem(item)} 
          />
        ))}
      </div>

      {/* Floating Action Button (Flow A) */}
      <div className="fixed bottom-10 right-10 z-50">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#d4b36d' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsGlobalInquiryOpen(true)}
          className="bg-[#c5a059] text-matte-black px-8 py-4 rounded-full font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(197,160,89,0.3)] border border-white/20"
        >
          Text The Floor
        </motion.button>
      </div>

      {/* Inquiry Bottom Sheet (Global or Product Context) */}
      <InquiryDrawer 
        isOpen={!!selectedItem || isGlobalInquiryOpen} 
        onClose={() => {
          setSelectedItem(null)
          setIsGlobalInquiryOpen(false)
          setIsSuccessState(false)
        }}
        title={isSuccessState ? undefined : (selectedItem ? selectedItem.name : 'General Concierge')}
      >
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[400px] flex flex-col justify-center">
          {selectedItem && !isSuccessState && (
            <div className="flex items-baseline gap-3 border-b border-white/5 pb-6">
              <span className="text-stone-500 font-mono text-xs uppercase tracking-widest">Pricing Guide:</span>
              <span className="text-2xl font-serif text-[#c5a059]">${Number(selectedItem.price).toLocaleString()}</span>
            </div>
          )}
          
          <InquiryForm 
            itemContext={selectedItem ? { 
              id: selectedItem.id, 
              name: selectedItem.name, 
              price: selectedItem.price 
            } : undefined} 
            onSuccess={() => {
              setIsSuccessState(true)
              setTimeout(() => {
                setSelectedItem(null)
                setIsGlobalInquiryOpen(false)
                setIsSuccessState(false)
              }, 4000)
            }}
          />
        </div>
      </InquiryDrawer>
    </div>
  )
}
