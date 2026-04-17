import FloorGallery from '@/components/FloorGallery'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getFloorItems() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('floor_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching floor items:', error)
    return []
  }
  
  return data || []
}

export default async function FloorPage() {
  const items = await getFloorItems()

  return (
    <main className="min-h-screen bg-matte-black text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 bg-radial-at-t from-charcoal to-matte-black opacity-40 pointer-events-none" />
      
      <div className="relative z-10 w-full">
        <FloorGallery items={items} />
      </div>
    </main>
  )
}
