'use server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function updateItemStatus(itemId?: string, status: 'available' | 'pending' | 'sold' = 'pending', itemName?: string) {
  console.log('--- ATELIER UPDATE START ---')
  console.log('Target ID:', itemId)
  console.log('Target Name:', itemName)
  console.log('New Status:', status)

  const supabase = createServerSupabaseClient()

  if (itemId) {
    console.log('Executing update by ID...')
    const { error } = await supabase
      .from('floor_items')
      .update({ status })
      .eq('id', itemId)
    
    if (error) console.error('Update Error (ID):', error)
    else console.log('Successfully updated by ID')
  } else if (itemName) {
    console.log('Executing update by Name (Fuzzy Match)...')
    const { error } = await supabase
      .from('floor_items')
      .update({ status })
      .eq('name', itemName)

    if (error) console.error('Update Error (Name):', error)
    else {
      console.log('Successfully updated by Name')
      // Optional: We could check rows affected here if we had the count, 
      // but for simplicity we'll just log success if no SQL error.
      // To strictly follow user request of "MATCH FAIL" logging:
      const { data: check } = await supabase.from('floor_items').select('id').eq('name', itemName)
      if (!check || check.length === 0) {
        console.warn('MATCH FAIL: No item found for ' + itemName)
      }
    }
  } else {
    console.error('FAILURE: No identifier provided for update')
  }

  console.log('--- ATELIER UPDATE COMPLETE ---')
}
