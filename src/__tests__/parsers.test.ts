import { parseCurlVerbose, parseHAR, parseRawHTTP } from '../parsers';

describe('parseCurlVerbose', () => {
  it('should parse request headers from curl verbose output', () => {
    const input = `> GET /api HTTP/1.1
> Host: example.com
> User-Agent: curl/7.68.0
> Accept: */*
> Authorization: Bearer token123`;
    const result = parseCurlVerbose(input, false);
    expect(result).toEqual({
      'Host': 'example.com',
      'User-Agent': 'curl/7.68.0',
      'Accept': '*/*',
      'Authorization': 'Bearer token123'
    });
  });

  it('should parse response headers from curl verbose output', () => {
    const input = `< HTTP/1.1 200 OK
< Content-Type: application/json
< Set-Cookie: session=abc123
< Cache-Control: no-cache`;
    const result = parseCurlVerbose(input, true);
    expect(result).toEqual({
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=abc123',
      'Cache-Control': 'no-cache'
    });
  });

  it('should handle empty input', () => {
    const result = parseCurlVerbose('', false);
    expect(result).toEqual({});
  });

  it('should skip malformed lines without colon', () => {
    const input = `> GET /api HTTP/1.1
> Host example.com
> Valid-Header: value`;
    const result = parseCurlVerbose(input, false);
    expect(result).toEqual({ 'Valid-Header': 'value' });
  });
});

describe('parseHAR', () => {
  it('should parse request headers from HAR file', () => {
    const har = {
      log: {
        entries: [{
          request: {
            headers: [
              { name: 'Host', value: 'api.example.com' },
              { name: 'Content-Type', value: 'application/json' }
            ]
          },
          response: { headers: [] }
        }]
      }
    };
    const result = parseHAR(JSON.stringify(har), false);
    expect(result).toEqual({
      'Host': 'api.example.com',
      'Content-Type': 'application/json'
    });
  });

  it('should parse response headers from HAR file', () => {
    const har = {
      log: {
        entries: [{
          request: { headers: [] },
          response: {
            headers: [
              { name: 'Content-Type', value: 'text/html' },
              { name: 'Server', value: 'nginx' }
            ]
          }
        }]
      }
    };
    const result = parseHAR(JSON.stringify(har), true);
    expect(result).toEqual({
      'Content-Type': 'text/html',
      'Server': 'nginx'
    });
  });

  it('should throw error for invalid JSON', () => {
    expect(() => parseHAR('invalid json', false)).toThrow('Failed to parse HAR');
  });

  it('should throw error when no entries found', () => {
    const har = { log: { entries: [] } };
    expect(() => parseHAR(JSON.stringify(har), false)).toThrow('No entries found');
  });
});

describe('parseRawHTTP', () => {
  it('should parse headers from raw HTTP request', () => {
    const input = `GET /api/users HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer xyz

{"body":"data"}`;
    const result = parseRawHTTP(input, false);
    expect(result).toEqual({
      'Host': 'example.com',
      'Accept': 'application/json',
      'Authorization': 'Bearer xyz'
    });
  });

  it('should parse headers from raw HTTP response', () => {
    const input = `HTTP/1.1 200 OK
Content-Type: text/html
Server: Apache
Content-Length: 1234

<html>...</html>`;
    const result = parseRawHTTP(input, true);
    expect(result).toEqual({
      'Content-Type': 'text/html',
      'Server': 'Apache',
      'Content-Length': '1234'
    });
  });

  it('should handle empty input', () => {
    const result = parseRawHTTP('', false);
    expect(result).toEqual({});
  });
});
