/**
 * Portify AI — Client-Side Safe URL Sanitizer
 * Mitigates XSS via javascript:, vbscript:, and malicious data: URI schemes in links
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Neutralize dangerous URI protocols (including obfuscated/whitespace variants)
  const normalized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('data:text/html') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('file:')
  ) {
    return '#';
  }

  // Safe protocols: http, https, mailto, tel, relative paths (/), anchors (#), and image data URIs
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

  // Domain without scheme e.g. "github.com/developer"
  if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return '#';
};

export default sanitizeUrl;

