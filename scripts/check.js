
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data keys:', data && data.length > 0 ? Object.keys(data[0]) : 'no data');
  console.log('Data description:', data && data.length > 0 ? data[0].description : 'N/A');
}

check();
