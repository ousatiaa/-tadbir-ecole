const crypto = require('crypto');

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(obj));
}

function body(req) {
  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = {}; }
  }
  return b || {};
}

function signToken(payload) {
  const priv = (process.env.PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(JSON.stringify(payload));
  sign.end();
  const signature = sign.sign(priv, 'base64');
  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
}

function isAdmin(b) {
  return !!process.env.ADMIN_TOKEN && b.adminToken === process.env.ADMIN_TOKEN;
}

module.exports = { send, body, signToken, isAdmin };
