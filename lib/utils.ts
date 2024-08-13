export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+(.)/g, (_, letter) => letter.toUpperCase())
    .replace(/\s+/g, '');
}
