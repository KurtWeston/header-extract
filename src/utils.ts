const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'set-cookie',
  'api-key',
  'x-api-key',
  'apikey',
  'access-token',
  'x-access-token'
];

export function filterHeaders(headers: Record<string, string>, pattern: string): Record<string, string> {
  const regex = new RegExp(pattern, 'i');
  const filtered: Record<string, string> = {};
  
  for (const [name, value] of Object.entries(headers)) {
    if (regex.test(name)) {
      filtered[name] = value;
    }
  }
  
  return filtered;
}

export function redactSensitive(headers: Record<string, string>): Record<string, string> {
  const redacted: Record<string, string> = {};
  
  for (const [name, value] of Object.entries(headers)) {
    const lowerName = name.toLowerCase();
    const isSensitive = SENSITIVE_HEADERS.some(sensitive => lowerName.includes(sensitive));
    redacted[name] = isSensitive ? '[REDACTED]' : value;
  }
  
  return redacted;
}

export function validateHeaders(headers: Record<string, string>): boolean {
  for (const [name, value] of Object.entries(headers)) {
    if (!name || typeof name !== 'string') return false;
    if (typeof value !== 'string') return false;
    if (name.includes('\n') || value.includes('\n')) return false;
  }
  return true;
}
