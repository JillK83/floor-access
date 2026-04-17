import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminPINGuard from '@/components/AdminPINGuard'
import RealtimeInquiryList from '@/components/RealtimeInquiryList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getInquiries() {
  const supabase = createServerSupabaseClient()
  
  // Fetch inquiries joined with floor_items to get the price and name
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, floor_items(price, name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inquiries:', error)
    return []
  }

  // Flatten the data for the component
  return (data || []).map((inquiry: any) => ({
    ...inquiry,
    price: inquiry.floor_items?.price
  }))
}

export default async function AdminPage() {
  const initialInquiries = await getInquiries()

  return (
    <main className="h-screen flex flex-col bg-stone-950 text-stone-100 selection:bg-gold/30 overflow-hidden font-sans">
      <AdminPINGuard>
        {/* Header - Fixed */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-12 py-10 border-b border-white/5 bg-matte-black/50 backdrop-blur-md z-20">
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-gold uppercase tracking-[0.4em]">Floor Manager Executive</p>
            <h1 className="text-4xl font-serif tracking-tight text-white">
              Triage <span className="text-stone-600 italic">Hub</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-stone-500 font-mono text-[9px] uppercase tracking-[0.2em] pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(184,160,74,0.5)]" />
            Atelier Connection: Established
          </div>
        </header>

        {/* Dynamic Triage Layout */}
        <section className="flex-1 overflow-hidden px-12 py-8">
          <RealtimeInquiryList initialInquiries={initialInquiries} />
        </section>
      </AdminPINGuard>
    </main>
  )
}
