// Copies dist/index.html to dist/404.html so static hosts without rewrite
// rules (GitHub Pages, S3 website hosting) still serve deep links like /team.
import { copyFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
console.log('SPA fallback written: dist/404.html');
