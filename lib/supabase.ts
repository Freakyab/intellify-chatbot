import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from '@supabase/supabase-js'

export const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)