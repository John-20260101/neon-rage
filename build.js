/* Build the shareable single-file version by inlining CSS and scripts. */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

let html = read('index.html');
let css = read('styles.css');

// Inline local background images so the shareable HTML stays self-contained.
const imageMime = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
css = css.replace(/url\(["']?(images\/[^"')]+)["']?\)/g, (match, rel) => {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing image asset for CSS: ${rel}`);
  const ext = path.extname(rel).toLowerCase();
  const mime = imageMime[ext];
  if (!mime) throw new Error(`Unsupported image asset type: ${rel}`);
  return `url("data:${mime};base64,${fs.readFileSync(file).toString('base64')}")`;
});
// Inline the lazily loaded move-demo GIFs referenced by data-gif.
html = html.replace(/data-gif="(images\/demos\/[^"]+\.gif)"/g, (match, rel) => {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing demo asset: ${rel}`);
  return `data-gif="data:image/gif;base64,${fs.readFileSync(file).toString('base64')}"`;
});

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
