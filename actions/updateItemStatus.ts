'use server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function updateItemStatus(itemId: string, status: 'available' | 'pending' | 'sold') {
  const supabase = createServerSupabaseClient()
  await supabase.from('floor_items').update({ status }).eq('id', itemId)
}
