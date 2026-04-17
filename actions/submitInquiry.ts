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

  console.log('DEBUG: Received Inquiry Data', { name, phone, category, customerMessage })

  if (!phone) {
    throw new Error('Phone number is required')
  }

  // AI Categorization and Sentiment Analysis
  const systemPrompt = `You are a triage assistant for a NYC furniture showroom. Analyze the customer inquiry and return ONLY valid JSON with no markdown fences:
  {
    "intent_tag": "High Intent / Sales" | "Low Urgency / Support" | "Medium / General Inquiry" | "Urgent",
    "sentiment": "positive" | "neutral" | "negative",
    "sms_reply": "pre-written SMS reply under 160 chars, warm and direct, signed — Asian Barn"
  }`

  console.log('Calling OpenAI...')
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Category: ${category}\nMessage: ${customerMessage}` },
    ],
    response_format: { type: 'json_object' },
  })

  console.log('Raw OpenAI response:', response.choices[0].message.content)
  const cleaned = response.choices[0].message.content!.replace(/```json|```/g, '').trim()
  console.log('Cleaned response:', cleaned)
  const parsed = JSON.parse(cleaned)
  console.log('Parsed:', parsed)

  const { intent_tag, sentiment, sms_reply } = parsed

  const supabase = createServerSupabaseClient()
  
  // Mapping to user's actual Supabase column names
  const { data, error } = await supabase
    .from('inquiries')
    .insert([{
      customer_name: name || null,
      customer_phone: phone,
      item_of_interest: category,
      category: category,
      customer_message: customerMessage || '',
      message: customerMessage || '',
      sentiment: sentiment,
      intent_tag: intent_tag,
      sms_reply: sms_reply,
      status: 'new',
      is_urgent: intent_tag === 'Urgent'
    }])

  if (error) {
    console.error('Supabase insert error:', JSON.stringify(error))
    throw new Error(`Failed to save inquiry: ${error.message}`)
  }

  console.log('DEBUG: Inquiry Saved Successfully')

  return { success: true }
}
