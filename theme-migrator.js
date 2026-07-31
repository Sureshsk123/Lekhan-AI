import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(process.cwd(), 'src');

const walk = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk(srcDir);
let modifiedCount = 0;

const replacements = [
  // Backgrounds
  { regex: /bg-white dark:bg-slate-[89]00/g, replacement: 'bg-surface-primary' },
  { regex: /bg-white\/80 dark:bg-slate-900\/80/g, replacement: 'bg-surface-primary/80' },
  { regex: /bg-white\/90 dark:bg-slate-900\/90/g, replacement: 'bg-surface-primary/90' },
  { regex: /bg-slate-50 dark:bg-slate-900/g, replacement: 'bg-surface-secondary' },
  { regex: /bg-slate-100 dark:bg-slate-800/g, replacement: 'bg-surface-tertiary' },
  { regex: /bg-slate-100\/50 dark:bg-slate-800\/50/g, replacement: 'bg-surface-tertiary/50' },
  { regex: /bg-slate-100\/70 dark:bg-slate-800\/70/g, replacement: 'bg-surface-tertiary/70' },
  { regex: /bg-slate-100\/80 dark:bg-slate-800\/80/g, replacement: 'bg-surface-tertiary/80' },
  { regex: /bg-slate-50\/80 dark:bg-slate-900\/80/g, replacement: 'bg-surface-secondary/80' },
  { regex: /bg-slate-50 dark:bg-slate-950/g, replacement: 'bg-surface-secondary' },
  { regex: /bg-slate-800 dark:bg-slate-800/g, replacement: 'bg-surface-tertiary' },

  // Text colors
  { regex: /text-slate-900 dark:text-slate-100/g, replacement: 'text-content-primary' },
  { regex: /text-slate-900 dark:text-white/g, replacement: 'text-content-primary' },
  { regex: /text-slate-800 dark:text-slate-200/g, replacement: 'text-content-primary' },
  { regex: /text-slate-700 dark:text-slate-300/g, replacement: 'text-content-secondary' },
  { regex: /text-slate-700 dark:text-slate-200/g, replacement: 'text-content-secondary' },
  { regex: /text-slate-600 dark:text-slate-400/g, replacement: 'text-content-tertiary' },
  { regex: /text-slate-600 dark:text-slate-300/g, replacement: 'text-content-tertiary' },
  { regex: /text-slate-500 dark:text-slate-400/g, replacement: 'text-content-tertiary' },
  { regex: /text-slate-500 dark:text-slate-500/g, replacement: 'text-content-tertiary' },

  // Border colors
  { regex: /border-slate-200 dark:border-slate-[78]00/g, replacement: 'border-border-light' },
  { regex: /border-slate-100 dark:border-slate-[78]00/g, replacement: 'border-border-light' },
  { regex: /border-slate-300 dark:border-slate-600/g, replacement: 'border-border-strong' },
  { regex: /border-slate-200\/50 dark:border-slate-700\/50/g, replacement: 'border-border-light/50' },
  { regex: /border-slate-200\/60 dark:border-slate-800\/80/g, replacement: 'border-border-light/60' },

  // Hover states
  { regex: /hover:bg-slate-100 dark:hover:bg-slate-800/g, replacement: 'hover:bg-surface-tertiary' },
  { regex: /hover:bg-slate-50 dark:hover:bg-slate-800\/50/g, replacement: 'hover:bg-surface-tertiary/50' },
  { regex: /hover:bg-slate-200\/60 dark:hover:bg-slate-700\/60/g, replacement: 'hover:bg-surface-tertiary/60' },
  { regex: /hover:bg-slate-50 dark:hover:bg-slate-800/g, replacement: 'hover:bg-surface-tertiary' },

  // Divided elements (using divide-slate-x)
  { regex: /divide-slate-200 dark:divide-slate-800/g, replacement: 'divide-border-light' },
  
  // Specific tweaks
  { regex: /bg-slate-900/g, replacement: 'bg-surface-primary' },
  { regex: /bg-white/g, replacement: 'bg-surface-primary' }
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    replacements.forEach(({ regex, replacement }) => {
      newContent = newContent.replace(regex, replacement);
    });

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      modifiedCount++;
      console.log(`Updated ${file}`);
    }
  }
});

console.log(`Updated ${modifiedCount} files with semantic tokens.`);
