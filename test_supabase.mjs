import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const url = envFile.match(/NEXT_PUBLIC_SUPABASE_URL='([^']+)'/)[1];
const key = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY='([^']+)'/)[1];

async function check() {
  const pRes = await fetch(`${url}/rest/v1/profiles?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  console.log("Profiles status:", pRes.status);
  if (pRes.ok) console.log(await pRes.json());
  else console.log(await pRes.text());

  const gRes = await fetch(`${url}/rest/v1/games?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  console.log("Games status:", gRes.status);
  if (gRes.ok) console.log(await gRes.json());
  else console.log(await gRes.text());
}
check();
