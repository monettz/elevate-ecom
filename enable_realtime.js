import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rphiqtfiibzpjxlhsehv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlxdGZpaWJ6cGp4bGhzZWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MzQxNTksImV4cCI6MjA5OTIxMDE1OX0.HtNfxrRBd_OAWLLfTAfCNdcSfAi51HiEF_jNKcIjEYk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRealtime() {
  console.log("Enabling realtime for orders table...");
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'alter publication supabase_realtime add table public.orders;' });
  console.log("Result:", data, error);
}

checkRealtime();
