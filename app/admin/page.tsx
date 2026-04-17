import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminPINGuard from '@/components/AdminPINGuard'
import RealtimeInquiryList from '@/components/RealtimeInquiryList'

export const dynamic = 'force-dynamic'

async function getInquiries() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inquiries:', error)
    return []
  }

  return data || []
}

export default async function AdminPage() {
  const initialInquiries = await getInquiries()

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 selection:bg-gold/30">
      <AdminPINGuard>
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="font-mono text-xs text-gold uppercase tracking-[0.3em]">Owner Dashboard</p>
              <h1 className="text-5xl md:text-6xl font-serif tracking-tight">
                Floor Manager <span className="text-stone-600">·</span> Asian Barn
              </h1>
            </div>
            <div className="flex items-center gap-4 text-stone-500 font-mono text-[10px] uppercase tracking-widest pb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Realtime Connection Active
            </div>
          </header>

          <section className="space-y-8">
            <div className="flex border-b border-stone-800 pb-4">
              <h2 className="font-mono text-xs text-stone-500 uppercase tracking-widest">Incoming Inquiries</h2>
            </div>
            
            <RealtimeInquiryList initialInquiries={initialInquiries} />
          </section>
        </div>
      </AdminPINGuard>
    </main>
  )
}
