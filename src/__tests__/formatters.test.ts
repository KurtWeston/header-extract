import { formatJSON, formatCurlFlags, formatKeyValue } from '../formatters';

describe('formatJSON', () => {
  it('should format headers as JSON', () => {
    const headers = { 'Content-Type': 'application/json', 'Host': 'example.com' };
    const result = formatJSON(headers);
    expect(result).toBe(JSON.stringify(headers, null, 2));
    expect(JSON.parse(result)).toEqual(headers);
  });

  it('should handle empty headers', () => {
    const result = formatJSON({});
    expect(result).toBe('{}');
  });
});

describe('formatCurlFlags', () => {
  it('should format headers as curl -H flags', () => {
    const headers = { 'Host': 'example.com', 'Accept': 'application/json' };
    const result = formatCurlFlags(headers);
    expect(result).toContain('-H "Host: example.com"');
    expect(result).toContain('-H "Accept: application/json"');
    expect(result).toContain('\\\n');
  });

  it('should escape quotes in header values', () => {
    const headers = { 'X-Custom': 'value with "quotes"' };
    const result = formatCurlFlags(headers);
    expect(result).toContain('value with \\"quotes\\"');
  });

  it('should handle empty headers', () => {
    const result = formatCurlFlags({});
    expect(result).toBe('');
  });
});

describe('formatKeyValue', () => {
  it('should format headers as key-value pairs', () => {
    const headers = { 'Host': 'example.com', 'Accept': 'text/html' };
    const result = formatKeyValue(headers);
    expect(result).toBe('Host: example.com\nAccept: text/html');
  });

  it('should handle empty headers', () => {
    const result = formatKeyValue({});
    expect(result).toBe('');
  });
});
