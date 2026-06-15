const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

assert(html.includes('id="food-search-form"'), 'USDA food search form should be present');
assert(html.includes('id="food-search-query"'), 'USDA search should collect a food query');
assert(html.includes('id="food-search-meal"'), 'USDA search should let users choose a target meal');
assert(html.includes('id="food-search-results"'), 'USDA results container should be present');
assert(html.includes('Manual entry stays below'), 'manual macro fallback should remain visible');
assert(js.includes('USDA_SEARCH_ENDPOINT'), 'USDA endpoint constant should exist');
assert(js.includes('function normalizeUsdaFood'), 'USDA responses should be normalized into app food shape');
assert(js.includes('function searchUsdaFoods'), 'app should search USDA FoodData Central');
assert(js.includes('source: "USDA"'), 'USDA foods should preserve their source');
assert(js.includes('data-usda-result'), 'USDA results should be selectable');
assert(js.includes('source: food.source || "manual"'), 'manual entries should remain supported');

console.log('nutrition USDA search contract passed');
