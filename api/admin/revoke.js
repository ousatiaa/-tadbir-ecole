const { deleteLicense } = require('../../lib/db');
const { send, body, isAdmin } = require('../../lib/util');
const { normalizeKey } = require('../../lib/key');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST') return send(res, 405, { ok: false, reason: 'method-not-allowed' });
  const b = body(req);
  if (!isAdmin(b)) return send(res, 403, { ok: false, reason: 'unauthorized' });
  try {
    await deleteLicense(normalizeKey(b.licenseKey));
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { ok: false, reason: 'server-error' });
  }
};
