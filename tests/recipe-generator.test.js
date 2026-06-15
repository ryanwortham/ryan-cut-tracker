const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

assert(html.includes('id="recipe-ingredients"'), 'nutrition should collect ingredients on hand');
assert(html.includes('id="generate-recipes"'), 'nutrition should include a recipe generation button');
assert(html.includes('id="recipe-suggestions"'), 'nutrition should render recipe suggestions');
assert(html.includes('Healthy Recipe Ideas'), 'recipe card should be visible to users');
assert(js.includes('const healthyRecipeTemplates'), 'healthy recipe templates should exist');
assert(js.includes('function generateHealthyRecipes'), 'ingredients should generate recipe suggestions');
assert(js.includes('function renderRecipeSuggestions'), 'recipe suggestions should render in the nutrition UI');
assert(js.includes('data-log-recipe'), 'recipe suggestions should be loggable to a meal');
assert(js.includes('source: "recipe"'), 'logged recipes should preserve recipe source');
assert(js.includes('Chicken Rice Power Bowl'), 'common chicken/rice recipe should be available');

console.log('recipe generator contract passed');
