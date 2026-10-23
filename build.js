/* Build the shareable single-file version by inlining CSS and scripts. */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

let html = read('index.html');
const css = read('styles.css');
const scripts = ['js/audio.js', 'js/art.js', 'js/game.js'];

html = html.replace(
  '  <link rel="stylesheet" href="styles.css" />',
  () => `  <style>\n${css}\n  </style>`
);

for (const src of scripts) {
  const tag = `  <script src="${src}"></script>`;
  if (!html.includes(tag)) throw new Error(`Missing script tag for ${src}`);
  html = html.replace(tag, () => `  <script>\n${read(src)}\n  </script>`);
}

const out = path.join(root, 'neon-rage.html');
fs.writeFileSync(out, html);
console.log(`built ${path.relative(process.cwd(), out)} — ${Buffer.byteLength(html)} bytes`);
