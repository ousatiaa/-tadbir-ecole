const { getLicense } = require('../lib/db');
const { send, body } = require('../lib/util');
const { normalizeKey } = require('../lib/key');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST') return send(res, 405, { ok: false, reason: 'method-not-allowed' });
  try {
    const { machineId } = body(req);
    const licenseKey = normalizeKey(body(req).licenseKey);
    if (!licenseKey || !machineId) return send(res, 400, { ok: false, reason: 'missing-fields' });
    const lic = await getLicense(licenseKey);
    if (!lic) return send(res, 404, { ok: false, reason: 'revoked' });
    const machines = Array.isArray(lic.machines) ? lic.machines : [];
    if (!machines.includes(machineId)) return send(res, 403, { ok: false, reason: 'not-activated' });
    if (lic.expiry && new Date() > new Date(lic.expiry)) return send(res, 403, { ok: false, reason: 'expired' });
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { ok: false, reason: 'server-error' });
  }
};
