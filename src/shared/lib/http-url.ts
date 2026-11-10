export function normalizeHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'https://' || trimmed === 'http://') {
    return '';
  }
  const withProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return trimmed;
    }
    return url.toString();
  } catch {
    return trimmed;
  }
}

export function isHttpUrl(value: string) {
  if (!value) {
    return true;
  }
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
