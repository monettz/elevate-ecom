import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function alterTable() {
  const { data, error } = await supabase.rpc('run_sql', {
    query: `
      ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS processing_date TIMESTAMPTZ;
      ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipped_date TIMESTAMPTZ;
      ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_date TIMESTAMPTZ;
    `
  });
  console.log(error || 'Columns added');
}

alterTable();
