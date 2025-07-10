import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please create a .env.local file with:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=your-project-url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key'
  )
}

// Create a single client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For use in Client Components - return the same configured client
export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey) 