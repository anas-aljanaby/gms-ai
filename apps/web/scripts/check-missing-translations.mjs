import fs from 'node:fs';
import path from 'node:path';

const appRoot = path.resolve(import.meta.dirname, '..');
const localesRoot = path.join(appRoot, 'public', 'locales');
const enDir = path.join(localesRoot, 'en');
const arDir = path.join(localesRoot, 'ar');

const flattenKeys = (value, prefix = '') => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    return flattenKeys(child, nextKey);
  });
};

const sortedJsonFiles = (dirPath) =>
  fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b));

const namespaceFiles = Array.from(new Set([...sortedJsonFiles(enDir), ...sortedJsonFiles(arDir)]));
const issues = [];

for (const fileName of namespaceFiles) {
  const enPath = path.join(enDir, fileName);
  const arPath = path.join(arDir, fileName);

  if (!fs.existsSync(enPath)) {
    issues.push(`[${fileName}] Missing EN namespace file`);
    continue;
  }
  if (!fs.existsSync(arPath)) {
    issues.push(`[${fileName}] Missing AR namespace file`);
    continue;
  }

  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const arJson = JSON.parse(fs.readFileSync(arPath, 'utf8'));
  const enKeys = new Set(flattenKeys(enJson));
  const arKeys = new Set(flattenKeys(arJson));

  const missingInAr = [...enKeys].filter((key) => !arKeys.has(key)).sort((a, b) => a.localeCompare(b));
  const missingInEn = [...arKeys].filter((key) => !enKeys.has(key)).sort((a, b) => a.localeCompare(b));

  if (missingInAr.length > 0) {
    issues.push(`[${fileName}] Missing in AR: ${missingInAr.join(', ')}`);
  }
  if (missingInEn.length > 0) {
    issues.push(`[${fileName}] Missing in EN: ${missingInEn.join(', ')}`);
  }
}

if (issues.length > 0) {
  console.error('Translation parity check failed.\n');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Translation parity check passed for ${namespaceFiles.length} namespace files.`);
}
