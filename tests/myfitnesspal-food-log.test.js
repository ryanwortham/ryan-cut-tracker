const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

assert(html.includes('id="food-search-query"'), 'nutrition should keep food search input');
assert(html.includes('id="food-search-meal"'), 'nutrition should choose target meal');
assert(html.includes('id="barcode-input"'), 'nutrition should include barcode entry');
assert(html.includes('id="recent-foods"'), 'nutrition should include recent food quick add');
assert(html.includes('id="custom-food-name"'), 'nutrition should include custom food creation');
assert(html.includes('Save + Log Custom Food'), 'custom food should save and log in one action');
assert(js.includes('async function searchFatSecretFoods'), 'search should try FatSecret through private proxy');
assert(js.includes('async function searchBarcodeFood'), 'barcode lookup should use packaged food API');
assert(js.includes('function recordRecentFood'), 'logged foods should become recent foods');
assert(js.includes('function saveCustomFoodFromForm'), 'custom foods should persist and log');
assert(js.includes('state.customFoods'), 'custom foods should live in saved state');
assert(js.includes('state.recentFoods'), 'recent foods should live in saved state');

console.log('myfitnesspal-style food log contract passed');
