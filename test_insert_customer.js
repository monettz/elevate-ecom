import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rphiqtfiibzpjxlhsehv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlxdGZpaWJ6cGp4bGhzZWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MzQxNTksImV4cCI6MjA5OTIxMDE1OX0.HtNfxrRBd_OAWLLfTAfCNdcSfAi51HiEF_jNKcIjEYk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsertCustomer() {
  const customerId = 'test-customer-' + Math.random();
  console.log('Inserting customer...', customerId);
  
  const { data, error } = await supabase.from('customers').insert({
    id: customerId,
    email: `${customerId}@example.com`,
    name: 'Test Customer',
    role: 'user'
  });
  
  if (error) {
    console.error('Error inserting customer:', JSON.stringify(error, null, 2));
  } else {
    console.log('Customer inserted successfully');
  }
}

testInsertCustomer();
