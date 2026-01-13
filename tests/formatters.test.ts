import { formatJSON, formatCurlFlags, formatKeyValue } from '../src/formatters';

const testHeaders = {
  'Host': 'example.com',
  'User-Agent': 'test/1.0',
  'Accept': 'application/json'
};

describe('formatJSON', () => {
  it('should format headers as JSON', () => {
    const output = formatJSON(testHeaders);
    const parsed = JSON.parse(output);
    expect(parsed['Host']).toBe('example.com');
    expect(parsed['User-Agent']).toBe('test/1.0');
  });
});

describe('formatCurlFlags', () => {
  it('should format headers as curl -H flags', () => {
    const output = formatCurlFlags(testHeaders);
    expect(output).toContain('-H "Host: example.com"');
    expect(output).toContain('-H "User-Agent: test/1.0"');
    expect(output).toContain('-H "Accept: application/json"');
  });

  it('should escape quotes in header values', () => {
    const headers = { 'X-Custom': 'value with "quotes"' };
    const output = formatCurlFlags(headers);
    expect(output).toContain('value with \\"quotes\\"');
  });
});

describe('formatKeyValue', () => {
  it('should format headers as key-value pairs', () => {
    const output = formatKeyValue(testHeaders);
    expect(output).toContain('Host: example.com');
    expect(output).toContain('User-Agent: test/1.0');
    expect(output).toContain('Accept: application/json');
  });
});
