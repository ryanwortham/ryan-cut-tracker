const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

assert(html.includes('styles.css?v=20260615-recipes-cachefix'), 'stylesheet URL should be cache-busted for the recipe deploy');
assert(html.includes('app.js?v=20260615-recipes-cachefix'), 'app script URL should be cache-busted for the recipe deploy');
assert(!html.includes('20260615-fatsecret-search'), 'old FatSecret asset cache key should not remain in index.html');

console.log('asset cache version contract passed');
