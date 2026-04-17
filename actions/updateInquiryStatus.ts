'use server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function updateInquiryStatus(inquiryId: string, status: 'new' | 'replied' | 'archived') {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', inquiryId)

  if (error) {
    console.error('Failed to update inquiry status:', error)
    throw new Error(`Failed to update inquiry status: ${error.message}`)
  }

  return { success: true }
}
