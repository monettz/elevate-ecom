import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rphiqtfiibzpjxlhsehv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlxdGZpaWJ6cGp4bGhzZWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MzQxNTksImV4cCI6MjA5OTIxMDE1OX0.HtNfxrRBd_OAWLLfTAfCNdcSfAi51HiEF_jNKcIjEYk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("Checking orders table columns by doing a limit 1 query...");
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Orders data:", JSON.stringify(data, null, 2));
  }
}

checkDatabase();
