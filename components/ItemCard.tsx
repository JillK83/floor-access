'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FloorItem {
  id: string
  name: string
  description: string
  image_url: string
  price: number
  status: 'available' | 'pending' | 'sold'
  created_at: string
}

interface ItemCardProps {
  item: FloorItem
  onClick: (item: FloorItem) => void
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const [imageError, setImageError] = useState(false)
  const isNew = new Date(item.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(item)}
      className="group relative cursor-pointer bg-charcoal border border-white/5 rounded-sm overflow-hidden transition-colors hover:border-gold/30 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="aspect-[4/5] relative overflow-hidden bg-stone-900 shrink-0">
        {!imageError ? (
          <img
            src={item.image_url}
            alt={item.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-charcoal border-[1px] border-[#c5a059] text-center space-y-4">
            <p className="font-serif text-[#c5a059] text-lg leading-tight tracking-tight">
              {item.name}
            </p>
            <div className="w-8 h-[1px] bg-[#c5a059]/30" />
            <p className="font-mono text-[8px] text-[#c5a059]/60 uppercase tracking-[0.4em]">
              Collection <br/> Atelier
            </p>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <span className="bg-gold text-matte-black px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
              New Arrival
            </span>
          )}
          {item.status === 'pending' && (
            <span className="bg-stone-500 text-white px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1 mb-6">
          <p className="text-stone-500 text-[10px] font-mono uppercase tracking-widest leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Footer Baseline: Title, Price, Measurements */}
        <div className="pt-5 border-t border-white/5 mt-auto">
          <div className="h-[4.5rem] flex flex-col justify-start">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-lg font-serif text-white leading-tight break-words line-clamp-2">
                {item.name}
              </h3>
              <span className="text-gold font-mono text-sm font-medium tracking-tight whitespace-nowrap pt-1">
                ${Number(item.price).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-end h-6">
            <span className="text-[9px] font-mono text-stone-600 uppercase tracking-[0.25em]">
              {/* Extraction logic for dimensions like 30" x 20" */}
              {item.description.match(/\d+[\s"]*[xX]\s*\d+/) ? item.description.match(/\d+[\s"]*[xX]\s*\d+/)?.[0] : "Atelier Scale"}
            </span>
            <span className="text-[10px] font-mono text-gold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-300">
              Inquire →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
