const { getLicense, updateMachines } = require('../lib/db');
const { send, body, signToken } = require('../lib/util');
const { normalizeKey } = require('../lib/key');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST') return send(res, 405, { ok: false, reason: 'method-not-allowed' });
  try {
    const { machineId } = body(req);
    const licenseKey = normalizeKey(body(req).licenseKey);
    if (!licenseKey || !machineId) return send(res, 400, { ok: false, reason: 'missing-fields' });
    const lic = await getLicense(licenseKey);
    if (!lic) return send(res, 404, { ok: false, reason: 'invalid-key' });
    if (lic.expiry && new Date() > new Date(lic.expiry)) return send(res, 403, { ok: false, reason: 'expired' });
    const machines = Array.isArray(lic.machines) ? lic.machines : [];
    if (!machines.includes(machineId)) {
      if (machines.length >= lic.max_devices) return send(res, 403, { ok: false, reason: 'limit-reached' });
      machines.push(machineId);
      await updateMachines(lic.license_key, machines);
    }
    const payload = {
      licenseKey: lic.license_key,
      machineId,
      customer: lic.customer,
      issued: new Date().toISOString().slice(0, 10),
      expiry: lic.expiry
    };
    return send(res, 200, { ok: true, token: signToken(payload), customer: lic.customer });
  } catch (e) {
    return send(res, 500, { ok: false, reason: 'server-error' });
  }
};
