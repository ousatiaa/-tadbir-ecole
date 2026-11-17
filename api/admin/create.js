const crypto = require('crypto');
const { insertLicense } = require('../../lib/db');
const { send, body, isAdmin } = require('../../lib/util');
module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST') return send(res, 405, { ok: false, reason: 'method-not-allowed' });
  const b = body(req);
  if (!isAdmin(b)) return send(res, 403, { ok: false, reason: 'unauthorized' });
  try {
    const key = 'TADBIR-' + crypto.randomBytes(8).toString('hex').toUpperCase();
    await insertLicense({
      license_key: key,
      customer: b.customer || 'Customer',
      max_devices: Number(b.maxDevices) || 1,
      machines: [],
      expiry: b.expiry || null
    });
    return send(res, 200, { ok: true, licenseKey: key });
  } catch (e) {
    return send(res, 500, { ok: false, reason: 'server-error' });
  }
};
