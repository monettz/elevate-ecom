import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rphiqtfiibzpjxlhsehv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlxdGZpaWJ6cGp4bGhzZWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MzQxNTksImV4cCI6MjA5OTIxMDE1OX0.HtNfxrRBd_OAWLLfTAfCNdcSfAi51HiEF_jNKcIjEYk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderData = {
    id: orderId,
    customer_id: 'invalid-id',
    customer_name: 'Test User',
    customer_email: 'guest@example.com',
    customer_avatar: null,
    total: 50000,
    status: 'Processing',
    address: '123 Test St, Test City, 12345',
    coupon_code: null,
    discount_amount: 0
  };

  console.log('Inserting order with invalid customer_id...');
  const { error } = await supabase.from('orders').insert(orderData);
  if (error) {
    console.error('Error inserting order:', JSON.stringify(error, null, 2));
    return;
  }
}

testInsert();
