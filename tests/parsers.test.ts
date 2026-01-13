import { parseCurlVerbose, parseHAR, parseRawHTTP } from '../src/parsers';

describe('parseCurlVerbose', () => {
  it('should parse request headers from curl verbose output', () => {
    const input = `> GET /api/users HTTP/1.1
> Host: example.com
> User-Agent: curl/7.68.0
> Accept: */*
> Authorization: Bearer token123`;
    
    const headers = parseCurlVerbose(input, false);
    expect(headers['Host']).toBe('example.com');
    expect(headers['User-Agent']).toBe('curl/7.68.0');
    expect(headers['Authorization']).toBe('Bearer token123');
  });

  it('should parse response headers from curl verbose output', () => {
    const input = `< HTTP/1.1 200 OK
< Content-Type: application/json
< Content-Length: 1234
< Set-Cookie: session=abc123`;
    
    const headers = parseCurlVerbose(input, true);
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['Content-Length']).toBe('1234');
    expect(headers['Set-Cookie']).toBe('session=abc123');
  });
});

describe('parseHAR', () => {
  it('should parse headers from HAR file', () => {
    const har = {
      log: {
        entries: [{
          request: {
            headers: [
              { name: 'Host', value: 'api.example.com' },
              { name: 'Accept', value: 'application/json' }
            ]
          },
          response: {
            headers: [
              { name: 'Content-Type', value: 'application/json' }
            ]
          }
        }]
      }
    };
    
    const headers = parseHAR(JSON.stringify(har), false);
    expect(headers['Host']).toBe('api.example.com');
    expect(headers['Accept']).toBe('application/json');
  });
});

describe('parseRawHTTP', () => {
  it('should parse headers from raw HTTP request', () => {
    const input = `GET /api/users HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0\nAccept: application/json\n\n`;
    
    const headers = parseRawHTTP(input, false);
    expect(headers['Host']).toBe('example.com');
    expect(headers['Accept']).toBe('application/json');
  });
});
