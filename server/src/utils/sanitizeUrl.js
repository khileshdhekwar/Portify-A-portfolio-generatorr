/**
 * Portify AI — Server-Side Safe URL Sanitizer
 * Mitigates XSS via javascript:, vbscript:, and malicious data: URI schemes in exported HTML & templates
 */
const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const normalized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('data:text/html') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('file:')
  ) {
    return '#';
  }

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('data:image/')
  ) {
    return trimmed;
  }

  if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return '#';
};

module.exports = { sanitizeUrl };

