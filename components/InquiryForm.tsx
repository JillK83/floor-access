'use client'

import { useState, useRef, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { submitInquiry } from '@/actions/submitInquiry'

const CATEGORIES = ['Availability', 'Delivery', 'Lost & Found', 'Pricing', 'Other']

export default function InquiryForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const messageRef = useRef<HTMLTextAreaElement>(null)

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

      await submitInquiry(formData)
      setIsSuccess(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-matte-black overflow-hidden animate-in fade-in duration-500">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0 z-0">
          <Image
            src="http://static1.squarespace.com/static/59c26c90bce176b201481ae4/63b5b6ee64b96a44587f8628/69a2349fdb7fc05e5f33beec/1776204161504/d52a40976e70801565d5d4df3d1eef82d5bddf22dd1ab1975d73ebccf777e3e7.png"
            alt="Asian Barn furniture"
            fill
            priority
            className="object-cover opacity-40"
            onError={(e) => {
               e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-sm px-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-gold-bg p-4 border border-gold/30">
              <CheckCircle className="w-20 h-20 text-gold stroke-[1.5]" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">Got it!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              The team is on the floor right now, but we&apos;ll text you back shortly.
            </p>
          </div>

          <button 
            onClick={() => setIsSuccess(false)}
            className="text-gray-500 hover:text-gold transition-colors text-sm font-medium pt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto p-6 space-y-12">
      {/* Watermark */}
      <div className="absolute top-0 left-0 -translate-x-4 -translate-y-8 text-[120px] font-bold text-gold/10 leading-none select-none pointer-events-none z-0">
        01
      </div>

      <header className="relative z-10 space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Get Floor Access — Text Us
        </h1>
        <p className="text-gray-400 text-sm">Our team will respond within minutes</p>
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

          {/* Category Chips */}
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
