// Initialise et exporte le client Supabase unique pour toute l'app
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// createClient gère automatiquement la session (localStorage) et le refresh token
export const supabase = createClient(supabaseUrl, supabaseAnonKey)