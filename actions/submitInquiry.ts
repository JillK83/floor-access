'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function submitInquiry(formData: FormData) {
  try {
    const name = (formData.get('name') as string) || 'Anonymous'
    const phone = (formData.get('phone') as string) || ''
    const category = (formData.get('category') as string) || 'General'
    const customerMessage = (formData.get('customerMessage') as string) || ''
    const itemId = formData.get('itemId') as string
    const itemOfInterest = (formData.get('itemOfInterest') as string) || 'General'

    console.log('DEBUG: Received Inquiry Data', { name, phone, category, customerMessage, itemId, itemOfInterest })

    if (!phone) {
      return { success: false, error: 'Phone number is required' }
    }

    // UUID Validation for itemId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const validItemId = (itemId && uuidRegex.test(itemId)) ? itemId : null

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

    let aiResults = {
      intent_tag: 'Low Intent',
      sentiment: 'neutral',
      sms_reply: 'Thank you for your inquiry. A concierge will be with you shortly. — Asian Barn'
    }

    try {
      console.log('Calling Triage Brain (OpenAI)...')
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Item: ${itemOfInterest}\nCategory: ${category}\nMessage: ${customerMessage}` },
        ],
        response_format: { type: 'json_object' },
        timeout: 8000, // 8 second timeout for demo safety
      })

      const rawJson = response.choices[0].message.content!
      const parsed = JSON.parse(rawJson)
      aiResults = {
        intent_tag: parsed.intent_tag || 'Low Intent',
        sentiment: parsed.sentiment || 'neutral',
        sms_reply: parsed.sms_reply || aiResults.sms_reply
      }
    } catch (aiErr) {
      console.error('AI Triage failed, falling back to default:', aiErr)
    }

    // Use Service Role for DB Insert to bypass RLS/Auth issues in demo
    const supabase = createServerSupabaseClient(true)
    
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        customer_name: name,
        customer_phone: phone,
        category: category,
        customer_message: customerMessage,
        item_of_interest: itemOfInterest,
        sentiment: aiResults.sentiment,
        intent_tag: aiResults.intent_tag,
        ai_reply_draft: aiResults.sms_reply,
        status: 'new',
        item_id: validItemId,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Supabase insert error (Non-Fatal):', JSON.stringify(error))
      // For the demo, we still return success: false to the UI if the DB literally failed
      return { success: false, error: error.message }
    }

    console.log('DEBUG: Inquiry Saved Successfully')
    return { success: true }

  } catch (err: any) {
    console.error('FATAL submission error:', err)
    return { success: false, error: 'Internal system error. Please try again later.' }
  }
}
