import { createServerSupabaseClient } from './lib/supabase-server'

async function verifySupabase() {
  const supabase = createServerSupabaseClient()
  
  console.log('--- VERIFYING SUPABASE INQUIRIES ---')
  
  // 1. Fetch the latest inquiry
  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching inquiries:', error)
    return
  }

  if (!inquiries || inquiries.length === 0) {
    console.log('No inquiries found in the table.')
    return
  }

  const latest = inquiries[0]
  console.log('Latest Inquiry Record:', JSON.stringify(latest, null, 2))
  
  // 2. Check for the specific fields the user mentioned
  const fields = ['intent_tag', 'sentiment', 'sms_reply']
  const results = fields.map(field => ({
    field,
    exists: field in latest,
    value: latest[field]
  }))

  console.log('Verification Results:', results)
}

verifySupabase()
