import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const url = envFile.match(/NEXT_PUBLIC_SUPABASE_URL='([^']+)'/)[1];
const key = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY='([^']+)'/)[1];

fetch(`${url}/rest/v1/users?select=*&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` }
})
.then(res => {
  console.log("Users status:", res.status);
  return res.text();
})
.then(console.log);
