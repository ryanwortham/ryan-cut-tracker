const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const edgeFunction = fs.readFileSync(path.join(root, 'supabase/functions/fatsecret-search/index.ts'), 'utf8');

assert(html.includes('id="food-search-form"'), 'nutrition food search form should be present');
assert(html.includes('id="food-search-query"'), 'nutrition search should collect a food query');
assert(html.includes('id="food-search-meal"'), 'nutrition search should let users choose a target meal');
assert(html.includes('id="food-serving-amount"'), 'nutrition search should let users set serving amount');
assert(html.includes('id="food-serving-unit"'), 'nutrition search should let users set serving unit');
assert(html.includes('id="food-search-results"'), 'nutrition results container should be present');
assert(html.includes('Manual entry stays below'), 'manual macro fallback should remain visible');
assert(/FatSecret lookup/i.test(html), 'FatSecret should be the primary lookup label');
assert(html.includes('Search FatSecret'), 'FatSecret should be the primary search button label');

assert(js.includes('FATSECRET_PROXY_ENDPOINT'), 'FatSecret proxy endpoint should be configured from frontend config');
assert(js.includes('function normalizeFatSecretFood'), 'FatSecret responses should be normalized into app food shape');
assert(js.includes('function searchFatSecretFoods'), 'app should search FatSecret through a proxy');
assert(js.includes('function parseFoodQuery'), 'nutrition search should parse natural serving text like 6 oz chicken');
assert(js.includes('const commonFoodMacros'), 'nutrition search should have common macro estimates when API lookup is unavailable');
assert(js.includes('function localFoodMatches'), 'nutrition search should show common estimates before weak fallback matches');
assert(js.includes('function normalizeUsdaFood'), 'USDA responses should remain as a fallback source');
assert(js.includes('USDA_SEARCH_ENDPOINT'), 'USDA fallback endpoint constant should remain available');
assert(js.includes('source: "FatSecret"'), 'FatSecret foods should preserve their source');
assert(js.includes('source: "USDA"'), 'USDA fallback foods should preserve their source');
assert(js.includes('data-usda-result'), 'nutrition results should be selectable');
assert(js.includes('source: food.source || "manual"'), 'manual entries should remain supported');

assert(edgeFunction.includes('FATSECRET_CLIENT_ID'), 'Edge Function should read FatSecret client id from secrets');
assert(edgeFunction.includes('FATSECRET_CLIENT_SECRET'), 'Edge Function should read FatSecret client secret from secrets');
assert(edgeFunction.includes('oauth.fatsecret.com/connect/token'), 'Edge Function should request an OAuth token');
assert(edgeFunction.includes('method: "foods.search"'), 'Edge Function should call FatSecret foods.search');

console.log('nutrition FatSecret search contract passed');
