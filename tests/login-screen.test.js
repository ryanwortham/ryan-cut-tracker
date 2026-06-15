const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

assert(html.includes('id="auth-gate"'), 'login/signup gate should be present');
assert(html.includes('id="signup-form"'), 'signup form should be present');
assert(html.includes('id="login-form"'), 'login form should be present');
assert(html.includes('id="signup-email"'), 'signup should collect email');
assert(html.includes('id="signup-name"'), 'signup should collect name');
assert(html.includes('id="signup-password"'), 'signup should collect password');
assert(html.includes('id="signup-start-weight"'), 'signup should collect starting weight');
assert(html.includes('id="signup-goal-weight"'), 'signup should collect goal weight');
assert(html.includes('id="signup-goal-date"'), 'signup should collect goal date');
assert(js.includes('const AUTH_USERS_KEY'), 'auth users storage key should exist');
assert(js.includes('function saveAuthUsers'), 'auth users should be saved locally');
assert(js.includes('function createAuthUser') || js.includes('async function createAuthUser'), 'signup should create saved users');
assert(js.includes('function signInAuthUser') || js.includes('async function signInAuthUser'), 'login should restore saved users');
assert(js.includes('function applyAuthenticatedUser'), 'auth should apply profile to app state');
assert(js.includes('localStorage.setItem(AUTH_USERS_KEY'), 'auth users should persist to localStorage');
assert(js.includes('sessionStorage.setItem(AUTH_SESSION_KEY'), 'signed-in user should persist for the session');
console.log('login-screen contract passed');
