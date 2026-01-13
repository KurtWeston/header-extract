# header-extract

Parse and convert HTTP headers from curl output, HAR files, or raw dumps into various formats

## Features

- Parse headers from curl verbose output (-v flag)
- Extract headers from HAR (HTTP Archive) JSON files
- Parse raw HTTP request/response text dumps
- Output headers as JSON object
- Output headers as curl -H command flags
- Output headers as simple key-value pairs
- Filter headers by name using regex patterns
- Redact sensitive headers (Authorization, Cookie, Set-Cookie, API-Key)
- Case-insensitive header name matching
- Support for both request and response headers
- Read from stdin or file input
- Batch process multiple sources
- Validate header format and detect malformed entries

## How to Use

Use this project when you need to:

- Quickly solve problems related to header-extract
- Integrate typescript functionality into your workflow
- Learn how typescript handles common patterns

## Installation

```bash
# Clone the repository
git clone https://github.com/KurtWeston/header-extract.git
cd header-extract

# Install dependencies
npm install
```

## Usage

```bash
npm start
```

## Built With

- typescript

## Dependencies

- `commander`
- `chalk`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
