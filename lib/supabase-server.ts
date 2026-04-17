import { createClient } from '@supabase/supabase-js'

export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, next: { revalidate: 0 } })
      }
    }
  })
}
