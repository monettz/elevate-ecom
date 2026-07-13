import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const brandsToInsert = [
  { name: 'Apple', logo: 'https://cdn.simpleicons.org/apple/000000' },
  { name: 'Samsung', logo: 'https://cdn.simpleicons.org/samsung/1428A0' },
  { name: 'Nike', logo: 'https://cdn.simpleicons.org/nike/000000' },
  { name: 'Adidas', logo: 'https://cdn.simpleicons.org/adidas/000000' },
  { name: 'Sony', logo: 'https://cdn.simpleicons.org/sony/000000' },
  { name: 'LG', logo: 'https://cdn.simpleicons.org/lg/A50034' },
  { name: 'Puma', logo: 'https://cdn.simpleicons.org/puma/111111' },
  { name: 'Dell', logo: 'https://cdn.simpleicons.org/dell/0076CE' },
  { name: 'HP', logo: 'https://cdn.simpleicons.org/hp/0096D6' },
  { name: 'Microsoft', logo: 'https://cdn.simpleicons.org/microsoft/5E5E5E' }
];

async function seedBrands() {
  console.log('Seeding brands...');
  const { data, error } = await supabase.from('brands').insert(brandsToInsert);
  
  if (error) {
    console.error('Error inserting brands:', error);
  } else {
    console.log('Successfully inserted 10 brands!');
  }
}

seedBrands();
