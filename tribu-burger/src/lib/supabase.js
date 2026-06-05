import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jhfyfdllfzxtciibsfri.supabase.co'
const supabaseKey = 'sb_publishable_Q6pe_RH2AwtkbZGDz2uu2w_JrVcQ6qo'

export const supabase = createClient(supabaseUrl, supabaseKey)
