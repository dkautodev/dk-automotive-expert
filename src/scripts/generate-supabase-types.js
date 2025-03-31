
#!/usr/bin/env node

/**
 * This script can be used to generate TypeScript types from your Supabase database schema.
 * Run this script with:
 * 
 * npm run generate-types
 * 
 * Note: You need to have the Supabase CLI installed for this script to work.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Replace these with your actual Supabase project details
const SUPABASE_URL = process.env.SUPABASE_URL || "https://lqjwvaqqhqgmkjsriijw.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxand2YXFxaHFnbWtqc3JpaWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTAyOTYsImV4cCI6MjA1NzY2NjI5Nn0.GyKs7HY6WxdDo7Hf4XZoTQEknNy2pkcZN0ByHq38qMI";

const outputPath = path.resolve(__dirname, '../integrations/supabase/types.ts');

console.log('Generating TypeScript types from Supabase schema...');

try {
  // Get the schema
  const result = execSync(`npx supabase gen types typescript --project-id ${SUPABASE_URL.split('//')[1].split('.')[0]} --schema public`, {
    encoding: 'utf-8',
  });

  // Write to file
  fs.writeFileSync(outputPath, result);

  console.log(`Types generated successfully at ${outputPath}`);
} catch (error) {
  console.error('Error generating types:', error.message);
  console.log('You can manually generate types by running:');
  console.log('npx supabase gen types typescript --project-id YOUR_PROJECT_ID');
  console.log('And then copying the output to src/integrations/supabase/types.ts');
}
