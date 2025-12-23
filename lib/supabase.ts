import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()!

if (!supabaseUrl || !supabaseAnonKey) {
    // We can't throw here comfortably because build time might fail if envs are missing
    console.warn("Supabase credentials missing in environment variables.")
}

// Client for public access (respects RLS)
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any

// Admin client for server-side operations (bypasses RLS)
// Only use this in server-side API routes!
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null
