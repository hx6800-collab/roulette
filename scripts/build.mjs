// src/index.template.html 에 Tailwind CSS 와 canvas-confetti 를 인라인하여
// 외부 네트워크 없이 동작하는 단일 index.html 을 생성한다.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const twBin = require.resolve('tailwindcss/lib/cli.js');
const css = execFileSync(process.execPath, [twBin, '-i', 'src/tailwind.css', '--minify'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
});
const confetti = readFileSync(require.resolve('canvas-confetti/dist/confetti.browser.js'), 'utf8');

let html = readFileSync('src/index.template.html', 'utf8');
for (const marker of ['/* INLINE:tailwind */', '/* INLINE:confetti */']) {
  if (!html.includes(marker)) throw new Error(`marker not found: ${marker}`);
}
html = html
  .replace('/* INLINE:tailwind */', () => css)
  .replace('/* INLINE:confetti */', () =>
    '/* canvas-confetti v1.6.0 | ISC License | (c) Kiril Vatev */\n' + confetti.replace(/<\/script/gi, '<\\/script'));

writeFileSync('index.html', html);
console.log(`index.html written (${html.length.toLocaleString()} chars)`);
