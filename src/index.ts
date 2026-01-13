#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { log } from '@onamfc/developer-log';
import { parseCurlVerbose, parseHAR, parseRawHTTP } from './parsers';
import { formatJSON, formatCurlFlags, formatKeyValue } from './formatters';
import { filterHeaders, redactSensitive } from './utils';

const program = new Command();

program
  .name('header-extract')
  .description('Parse and convert HTTP headers from various formats')
  .version('1.0.0');

program
  .argument('[file]', 'Input file (or use stdin)')
  .option('-t, --type <type>', 'Input type: curl, har, raw', 'curl')
  .option('-f, --format <format>', 'Output format: json, curl, kv', 'json')
  .option('-r, --response', 'Extract response headers (default: request)', false)
  .option('-F, --filter <pattern>', 'Filter headers by regex pattern')
  .option('-R, --redact', 'Redact sensitive headers', false)
  .action((file, options) => {
    try {
      const input = file ? readFileSync(file, 'utf-8') : readStdin();
      let headers: Record<string, string> = {};

      switch (options.type) {
        case 'curl':
          headers = parseCurlVerbose(input, options.response);
          break;
        case 'har':
          headers = parseHAR(input, options.response);
          break;
        case 'raw':
          headers = parseRawHTTP(input, options.response);
          break;
        default:
          throw new Error(`Unknown type: ${options.type}`);
      }

      if (options.filter) {
        headers = filterHeaders(headers, options.filter);
      }

      if (options.redact) {
        headers = redactSensitive(headers);
      }

      let output: string;
      switch (options.format) {
        case 'json':
          output = formatJSON(headers);
          break;
        case 'curl':
          output = formatCurlFlags(headers);
          break;
        case 'kv':
          output = formatKeyValue(headers);
          break;
        default:
          throw new Error(`Unknown format: ${options.format}`);
      }

      console.log(output);
    } catch (error) {
      log.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

function readStdin(): string {
  const chunks: Buffer[] = [];
  const buffer = readFileSync(0);
  return buffer.toString('utf-8');
}

program.parse();
