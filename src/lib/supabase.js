import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient = null

if (supabaseUrl && supabaseKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey)
  } catch (e) {
    console.error('Error inicializando Supabase:', e)
  }
} else {
  console.warn('Variables de entorno de Supabase no configuradas. Usando datos por defecto.')
}

export const supabase = supabaseClient
