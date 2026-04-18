import { createClient } from '@supabase/supabase-js'

export function createServerSupabaseClient(useServiceRole = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const key = (useServiceRole && serviceKey) ? serviceKey : anonKey

  return createClient(supabaseUrl, key, {
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, next: { revalidate: 0 } })
      }
    }
  })
}
