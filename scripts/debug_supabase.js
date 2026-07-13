import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function run() {
  const { data: selectData, error: selectError } = await supabase.from('orders').select('*').limit(1);
  console.log('Select Data:', selectData);
  
  if (selectData && selectData.length > 0) {
    const orderId = selectData[0].id;
    console.log('Attempting update on:', orderId);
    const { data, error } = await supabase.from('orders').update({ fake_column_123: 'test' }).eq('id', orderId).select();
    console.log('Update Data:', data);
    console.log('Update Error:', error);
  } else {
    console.log('No orders found to update');
  }
}

run();
