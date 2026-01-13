import { filterHeaders, redactSensitive, validateHeaders } from '../utils';

describe('filterHeaders', () => {
  it('should filter headers by regex pattern', () => {
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': '1234',
      'Host': 'example.com',
      'Accept': 'text/html'
    };
    const result = filterHeaders(headers, 'content');
    expect(result).toEqual({
      'Content-Type': 'application/json',
      'Content-Length': '1234'
    });
  });

  it('should be case-insensitive', () => {
    const headers = { 'Authorization': 'Bearer token', 'Host': 'example.com' };
    const result = filterHeaders(headers, 'AUTHORIZATION');
    expect(result).toEqual({ 'Authorization': 'Bearer token' });
  });

  it('should return empty object when no matches', () => {
    const headers = { 'Host': 'example.com' };
    const result = filterHeaders(headers, 'nonexistent');
    expect(result).toEqual({});
  });
});

describe('redactSensitive', () => {
  it('should redact authorization headers', () => {
    const headers = { 'Authorization': 'Bearer secret', 'Host': 'example.com' };
    const result = redactSensitive(headers);
    expect(result).toEqual({ 'Authorization': '[REDACTED]', 'Host': 'example.com' });
  });

  it('should redact cookie headers', () => {
    const headers = { 'Cookie': 'session=abc123', 'Set-Cookie': 'token=xyz' };
    const result = redactSensitive(headers);
    expect(result).toEqual({ 'Cookie': '[REDACTED]', 'Set-Cookie': '[REDACTED]' });
  });

  it('should redact api-key headers', () => {
    const headers = { 'X-API-Key': 'secret123', 'apikey': 'key456' };
    const result = redactSensitive(headers);
    expect(result['X-API-Key']).toBe('[REDACTED]');
    expect(result['apikey']).toBe('[REDACTED]');
  });

  it('should not redact non-sensitive headers', () => {
    const headers = { 'Content-Type': 'application/json', 'Host': 'example.com' };
    const result = redactSensitive(headers);
    expect(result).toEqual(headers);
  });
});

describe('validateHeaders', () => {
  it('should validate correct headers', () => {
    const headers = { 'Host': 'example.com', 'Accept': 'text/html' };
    expect(validateHeaders(headers)).toBe(true);
  });

  it('should reject headers with newlines in name', () => {
    const headers = { 'Host\nInjection': 'value' };
    expect(validateHeaders(headers)).toBe(false);
  });

  it('should reject headers with newlines in value', () => {
    const headers = { 'Host': 'example.com\ninjection' };
    expect(validateHeaders(headers)).toBe(false);
  });

  it('should reject non-string values', () => {
    const headers = { 'Host': 123 as any };
    expect(validateHeaders(headers)).toBe(false);
  });
});
