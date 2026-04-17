import { createServerSupabaseClient } from './lib/supabase-server'

async function debugSchema() {
  const supabase = createServerSupabaseClient()
  
  console.log('--- DEBUGGING SUPABASE SCHEMA ---')
  
  // 1. Check if we can connect and list tables
  const { data: tables, error: tableError } = await supabase
    .from('inquiries')
    .select('*')
    .limit(0)

  if (tableError) {
    console.error('Error selecting from inquiries:', tableError)
  } else {
    console.log('Successfully connected to inquiries table.')
  }

  // 2. Introspect columns (via RPC or just a sample select)
  const { data: sample, error: sampleError } = await supabase
    .from('inquiries')
    .select('*')
    .limit(1)

  if (sampleError) {
    console.error('Error fetching sample record:', sampleError)
  } else {
    console.log('Inquiries table columns:', Object.keys(sample[0] || {}))
  }
}

debugSchema()
