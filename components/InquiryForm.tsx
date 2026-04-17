'use client'

import { useState, useRef, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { submitInquiry } from '@/actions/submitInquiry'

const CATEGORIES = ['Availability', 'Delivery', 'Lost & Found', 'Pricing', 'Other']

interface ItemContext {
  id: string
  name: string
  price: number
}

interface InquiryFormProps {
  itemContext?: ItemContext
  onSuccess?: () => void
}

export default function InquiryForm({ itemContext, onSuccess }: InquiryFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState(itemContext ? 'Availability' : CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const itemOfInterest = itemContext?.name || 'General Concierge'

  useEffect(() => {
    if (category === 'Other' && messageRef.current) {
      messageRef.current.focus()
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (category === 'Other' && !message.trim()) {
      setError('Please describe your request')
      return
    }
    
    if (!phone.trim()) {
      setError('Phone number is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('phone', phone)
      formData.append('category', category)
      formData.append('customerMessage', message)
      formData.append('itemOfInterest', itemOfInterest)

      if (itemContext) {
        formData.append('itemId', itemContext.id)
      }

      await submitInquiry(formData)
      setIsSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-[400px] bg-[#0a0a0a] border border-gold/30 p-12 rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.8)] text-center space-y-8 relative overflow-hidden">
          {/* Decorative Atelier Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          
          <div className="flex justify-center">
            <div className="rounded-full bg-gold/5 p-6 border border-gold/10">
              <CheckCircle className="w-12 h-12 text-gold stroke-[1.2]" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-serif text-white tracking-tight leading-tight">Request Received</h2>
            <div className="space-y-3">
              <p className="text-stone-400 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                Your inquiry for <br/>
                <span className="text-gold block mt-2 text-xs font-bold tracking-[0.2em]">{itemContext?.name || 'General Concierge'}</span>
              </p>
              <div className="h-[1px] w-8 bg-gold/20 mx-auto" />
              <p className="text-stone-600 font-mono text-[9px] uppercase tracking-[0.25em] pt-2">
                Our floor manager will text you <br/> back shortly.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsSuccess(false)
              setName('')
              setPhone('')
              setMessage('')
              setCategory(itemContext ? 'Availability' : CATEGORIES[0])
            }}
            className="w-full font-mono text-[10px] text-gold/60 uppercase tracking-[0.3em] py-4 border border-gold/10 rounded-sm hover:bg-gold/5 hover:text-white transition-all"
          >
            Close Confirmation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto space-y-12">
      <header className="relative z-10 space-y-2">
        <p className="text-stone-500 font-mono text-[10px] uppercase tracking-[0.3em]">Direct Concierge</p>
        <h1 className="text-3xl font-serif text-white tracking-tight">
          {itemContext ? `Inquire: ${itemContext.name}` : 'Get Floor Access — Text Us'}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-gray-400">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-gray-400">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>

          {/* Category Chips - Only show in Global Flow (A) */}
          {!itemContext && (
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400">What can we help with?</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat)
                      setError(null)
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                      category === cat
                        ? 'bg-gold text-matte-black border-gold'
                        : 'bg-transparent text-gray-300 border-white/20 hover:border-white/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-gray-400">
              Message {category === 'Other' ? '(Required)' : '(Optional)'}
            </label>
            <textarea
              ref={messageRef}
              rows={3}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (e.target.value.trim()) setError(null)
              }}
              placeholder={category === 'Other' ? "Tell us more — what's going on?" : "Any additional details..."}
              className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none ${
                error && category === 'Other' ? 'border-red-500/50' : 'border-white/10'
              }`}
            />
            {error && category === 'Other' && (
              <p className="text-red-400 text-[10px] font-mono uppercase tracking-wide">{error}</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-[10px] font-mono uppercase tracking-wide text-center animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold text-matte-black font-semibold py-4 rounded-lg hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isSubmitting ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  )
}
