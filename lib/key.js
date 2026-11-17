// Normalizes a license key: accepts with/without prefix, any case, stray spaces.
// 'TADBIR-53155B44677BA61D' | 'tadbir-53155b44677ba61d' | '53155B44677BA61D' | 'TADBIR53155B44677BA61D'
// -> 'TADBIR-53155B44677BA61D'
function normalizeKey(k) {
  k = String(k || '').trim().toUpperCase().replace(/\s+/g, '');
  k = k.replace(/^TADBIR-?/, '');
  if (!k) return '';
  return 'TADBIR-' + k;
}
module.exports = { normalizeKey };
