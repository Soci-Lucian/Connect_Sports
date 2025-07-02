import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ovjepxsifxywlxiohcuo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92amVweHNpZnh5d2x4aW9oY3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODMxODgsImV4cCI6MjA2NTA1OTE4OH0.1--4Zklu45OZuUKdmDONHcSgeT-M8k3Hoem4aNpQ2kM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})