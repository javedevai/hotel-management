import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejqozm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcW96bXB0ZHdkYm6MjA3OTc5ODkzN30.DJA1JH2ChStxzukWZjiajWZu1TnYuHDbo51V';

export const supabase = createClient(supabaseUrl, supabaseKey);