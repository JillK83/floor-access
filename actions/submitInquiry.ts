'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function submitInquiry(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const category = formData.get('category') as string
  const customerMessage = formData.get('customerMessage') as string
  const itemId = formData.get('itemId') as string
  const itemOfInterest = formData.get('itemOfInterest') as string

  console.log('DEBUG: Received Inquiry Data', { name, phone, category, customerMessage, itemId, itemOfInterest })

  if (!phone) {
    throw new Error('Phone number is required')
  }

  // AI Categorization and Sentiment Analysis
  const systemPrompt = `You are an expert triage assistant for 'Asian Barn,' a premium NYC furniture showroom. 
  Analyze the customer inquiry and return ONLY valid JSON with no markdown fences.
  
  PRIORITY TIERS:
  - 'High Intent': Direct sales inquiries, pricing requests, or checkout intent. (Action: Sales/Consult)
  - 'Medium Intent': Inventory status, stock checks, or logistical questions. (Action: Logistics/Stock)
  - 'Low Intent': Store hours, location, or general FAQ. (Action: Hours/FAQ)

  JSON SCHEMA:
  {
    "intent_tag": "High Intent" | "Medium Intent" | "Low Intent",
    "sentiment": "positive" | "neutral" | "frustrated",
    "sms_reply": "A warm, personal draft under 160 chars. Address the specific intent. Signed — Asian Barn Concierge"
  }`

  console.log('Calling Triage Brain (OpenAI)...')
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Item: ${itemOfInterest || 'General'}\nCategory: ${category}\nMessage: ${customerMessage}` },
    ],
    response_format: { type: 'json_object' },
  })

  const rawJson = response.choices[0].message.content!
  const parsed = JSON.parse(rawJson)
  const { intent_tag, sentiment, sms_reply } = parsed

  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{
      customer_name: name,
      customer_phone: phone,
      category: category,
      customer_message: customerMessage,
      item_of_interest: itemOfInterest,
      sentiment: sentiment,
      intent_tag: intent_tag,
      ai_reply_draft: sms_reply,
      status: 'new',
      item_id: itemId || null,
      created_at: new Date().toISOString()
    }])

  if (error) {
    console.error('Supabase insert error:', JSON.stringify(error))
    throw new Error(`Failed to save inquiry: ${error.message}`)
  }

  console.log('DEBUG: Inquiry Saved Successfully')

  return { success: true }
}
