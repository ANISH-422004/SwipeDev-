const fs = require('fs');
const path = require('path');

// Excluded folders and files
const EXCLUDE = ['node_modules', '.git', '.env', '.DS_Store'];

function isExcluded(fileOrDirName) {
  return EXCLUDE.includes(fileOrDirName);
}

function getLanguageFromExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  const extMap = {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.tsx': 'typescript',
    '.json': 'json',
    '.html': 'html',
    '.css': 'css',
    '.md': 'markdown',
    '.sh': 'bash',
    '.py': 'python',
  };
  return extMap[ext] || '';
}

function generateMarkdownFromDir(dir, mdLines = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (isExcluded(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      generateMarkdownFromDir(fullPath, mdLines);
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      const language = getLanguageFromExtension(entry.name);
      const relativePath = path.relative(process.cwd(), fullPath);
      mdLines.push(`### \`${relativePath}\`\n`);
      mdLines.push(`\`\`\`${language}\n${content}\n\`\`\`\n`);
    }
  }

  return mdLines;
}

// Entry point
const projectDir = process.cwd(); // Or provide a specific path
const markdownLines = generateMarkdownFromDir(projectDir);
fs.writeFileSync('project_code.md', markdownLines.join('\n'));

console.log('✅ Markdown file generated: project_code.md');
