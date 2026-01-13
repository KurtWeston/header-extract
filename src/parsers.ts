import { log } from '@onamfc/developer-log';

export function parseCurlVerbose(input: string, isResponse: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  const lines = input.split('\n');
  const prefix = isResponse ? '<' : '>';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(prefix)) continue;

    const headerLine = trimmed.substring(1).trim();
    if (!headerLine || headerLine.startsWith('HTTP/')) continue;

    const colonIndex = headerLine.indexOf(':');
    if (colonIndex === -1) continue;

    const name = headerLine.substring(0, colonIndex).trim();
    const value = headerLine.substring(colonIndex + 1).trim();
    if (name && value) {
      headers[name] = value;
    }
  }

  return headers;
}

export function parseHAR(input: string, isResponse: boolean): Record<string, string> {
  try {
    const har = JSON.parse(input);
    const entries = har.log?.entries || [];
    
    if (entries.length === 0) {
      throw new Error('No entries found in HAR file');
    }

    const entry = entries[0];
    const headerArray = isResponse ? entry.response?.headers : entry.request?.headers;
    
    if (!headerArray) {
      throw new Error(`No ${isResponse ? 'response' : 'request'} headers found`);
    }

    const headers: Record<string, string> = {};
    for (const { name, value } of headerArray) {
      headers[name] = value;
    }

    return headers;
  } catch (error) {
    throw new Error(`Failed to parse HAR: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function parseRawHTTP(input: string, isResponse: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  const lines = input.split('\n');
  let inHeaders = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!inHeaders) {
      if (trimmed.startsWith('HTTP/') || trimmed.match(/^[A-Z]+\s+\/.*HTTP/)) {
        inHeaders = true;
      }
      continue;
    }

    if (trimmed === '') break;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const name = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();
    if (name && value) {
      headers[name] = value;
    }
  }

  return headers;
}
