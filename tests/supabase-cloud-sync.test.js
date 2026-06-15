const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

assert(html.includes('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'), 'Supabase browser client should load from CDN');
assert(html.includes('./supabase-config.js'), 'Supabase config file should load before the app');
assert(js.includes('function isSupabaseConfigured'), 'app should detect whether Supabase is configured');
assert(js.includes('function getSupabaseClient'), 'app should create a Supabase client when configured');
assert(js.includes('async function createAuthUser'), 'signup should use async auth flow for Supabase');
assert(js.includes('supabase.auth.signUp'), 'signup should call Supabase Auth');
assert(js.includes('supabase.auth.signInWithPassword'), 'login should call Supabase Auth');
assert(js.includes('async function syncStateToCloud'), 'app state should sync to Supabase');
assert(js.includes('async function loadCloudState'), 'app state should restore from Supabase');
assert(js.includes('forged_user_state'), 'cloud sync should use the forged_user_state table');
assert(js.includes('Saved to cloud'), 'save status should show cloud persistence when available');
assert(readme.includes('Supabase setup'), 'README should document Supabase setup');
assert(fs.existsSync(path.join(root, 'supabase-schema.sql')), 'Supabase schema SQL should be included');

console.log('supabase cloud sync contract passed');
