import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nvxcwidvcmwqkzucuhyw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52eGN3aWR2Y213cWt6dWN1aHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MTA1MzQsImV4cCI6MjA1NDA4NjUzNH0.G8Fu-E7WwMwdnIGrCBpIPuRsHunU2RgGm_wHZVUIf-Y'

export const supabase = createClient(supabaseUrl, supabaseKey) 