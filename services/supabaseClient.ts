import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejqozmptdwdbkbazxzyk.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcW96bXB0ZHdkYmtiYXp4enlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjI5MzcsImV4cCI6MjA3OTc5ODkzN30.DJA1JH2ChStxzukWZjiajWZu1TnYuHDbo51V_h9_puM';

export const supabase = createClient(supabaseUrl, supabaseKey);
