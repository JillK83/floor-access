import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearInquiries() {
  console.log('--- ATELIER CLEAR-DB: Wiping Inquiries Table ---')
  
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Wipe everything

  if (error) {
    console.error('Error wiping inquiries:', error.message)
    process.exit(1)
  }

  console.log('Success: Inquiries table cleared.')
  console.log('--- ATELIER CLEAR-DB: Complete ---')
}

clearInquiries()
