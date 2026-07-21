import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderData = {
    id: orderId,
    customer_id: null,
    customer_name: 'Test User',
    customer_email: 'guest@example.com',
    customer_avatar: null,
    total: 50000,
    status: 'Processing',
    address: '123 Test St, Test City, 12345',
    coupon_code: null,
    discount_amount: 0
  };

  console.log('Inserting order...', orderData);
  const { data, error } = await supabase.from('orders').insert(orderData);
  if (error) {
    console.error('Error inserting order:', error);
  } else {
    console.log('Order inserted successfully:', data);
  }
}

testInsert();
