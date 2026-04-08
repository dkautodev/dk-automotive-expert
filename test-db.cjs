const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_EXTERNAL_SUPABASE_URL="?([^"\n]+)"?/)[1];
const key = env.match(/VITE_EXTERNAL_SUPABASE_ANON_KEY="?([^"\n]+)"?/)[1];

console.log('URL:', url);
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('pricing_grids').select('*').limit(1);
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS:', data);
  }
}
run();
