const URL_BASE = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '');
const KEY = (process.env.SUPABASE_SERVICE_KEY || '').trim();

async function call(method, path, body, extraHeaders) {
  const headers = {
    apikey: KEY,
    'Content-Type': 'application/json'
  };
  if (KEY.startsWith('eyJ')) headers.Authorization = 'Bearer ' + KEY;
  const res = await fetch(URL_BASE + '/rest/v1' + path, {
    method,
    headers: Object.assign(headers, extraHeaders || {}),
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!res.ok) throw new Error('db ' + res.status + ': ' + text);
  return text ? JSON.parse(text) : null;
}

async function getLicense(key) {
  const rows = await call('GET', '/tadbir_licenses?license_key=eq.' + encodeURIComponent(key) + '&select=*');
  return rows && rows[0] ? rows[0] : null;
}

async function listLicenses() {
  return call('GET', '/tadbir_licenses?select=*&order=created_at.desc');
}

async function insertLicense(row) {
  const rows = await call('POST', '/tadbir_licenses', row, { Prefer: 'return=representation' });
  return rows[0];
}

async function updateMachines(key, machines) {
  return call('PATCH', '/tadbir_licenses?license_key=eq.' + encodeURIComponent(key), { machines }, { Prefer: 'return=minimal' });
}

async function deleteLicense(key) {
  return call('DELETE', '/tadbir_licenses?license_key=eq.' + encodeURIComponent(key), null, { Prefer: 'return=minimal' });
}

module.exports = { getLicense, listLicenses, insertLicense, updateMachines, deleteLicense };
