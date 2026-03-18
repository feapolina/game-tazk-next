import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const url = envFile.match(/NEXT_PUBLIC_SUPABASE_URL='([^']+)'/)[1];
const key = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY='([^']+)'/)[1];

fetch(`${url}/rest/v1/profiles?select=id,full_name`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` }
})
.then(res => res.json())
.then(data => {
  console.log("Profiles in DB:", data);
})
.catch(console.error);
