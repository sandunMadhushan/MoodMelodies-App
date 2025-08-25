import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://holktilwijnzvmviyizm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbGt0aWx3aWpuenZtdml5aXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjcwMTAsImV4cCI6MjA3MTcwMzAxMH0.YhqwGLTLihwLopkPrTqk2ABqZkAop9QnIVldU1AJMBw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
