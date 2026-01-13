export function formatJSON(headers: Record<string, string>): string {
  return JSON.stringify(headers, null, 2);
}

export function formatCurlFlags(headers: Record<string, string>): string {
  const flags: string[] = [];
  
  for (const [name, value] of Object.entries(headers)) {
    const escaped = value.replace(/"/g, '\\"');
    flags.push(`-H "${name}: ${escaped}"`);
  }
  
  return flags.join(' \\
  ');
}

export function formatKeyValue(headers: Record<string, string>): string {
  const lines: string[] = [];
  
  for (const [name, value] of Object.entries(headers)) {
    lines.push(`${name}: ${value}`);
  }
  
  return lines.join('\n');
}
