const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

function workerHarness({ failOptional = false } = {}) {
  const listeners = {};
  const entries = new Map();
  const deleted = [];
  let waitingSkipped = false;
  let claimed = false;
  const cache = {
    async put(key, value) { entries.set(String(key), value); },
    async match(key) { return entries.get(typeof key === 'string' ? key : key.url); }
  };
  const names = ['gridshift-shell-v3', 'gridshift-shell-v4', 'gridshift-shell-v5', 'gridshift-shell-v6', 'gridshift-shell-v7', 'another-app-cache'];
  const sandbox = {
    URL,
    Promise,
    Request: class TestRequest {
      constructor(input, options = {}) {
        this.url = new URL(input, 'https://gridshift.example/sw.js').href;
        this.method = options.method || 'GET';
        this.mode = options.mode;
        this.cache = options.cache;
      }
    },
    Response: { error: () => ({ offlineError: true }) },
    fetch: async request => {
      const url = new URL(request.url);
      const optionalFailure = failOptional && url.pathname.endsWith('gridshift-mark.svg');
      return { ok: !optionalFailure, status: optionalFailure ? 404 : 200, url: request.url };
    },
    caches: {
      async open() { return cache; },
      async match(key) { return cache.match(key); },
      async keys() { return names; },
      async delete(name) { deleted.push(name); return true; }
    },
    self: {
      location: { origin: 'https://gridshift.example' },
      clients: { async claim() { claimed = true; } },
      addEventListener(name, callback) { listeners[name] = callback; },
      skipWaiting() { waitingSkipped = true; }
    }
  };
  vm.runInNewContext(source, sandbox, { filename: 'sw.js' });
  return {
    listeners, entries, deleted,
    get waitingSkipped() { return waitingSkipped; },
    get claimed() { return claimed; }
  };
}

test('service worker installs the required shell when an optional visual asset is missing', async () => {
  const harness = workerHarness({ failOptional: true });
  let installPromise;
  harness.listeners.install({ waitUntil(promise) { installPromise = promise; } });
  await installPromise;
  assert.ok(harness.entries.has('./index.html'));
  assert.ok(harness.entries.has('./core.js'));
  assert.ok(harness.entries.has('./app.js'));
  assert.equal(harness.entries.has('./assets/gridshift-mark.svg'), false);
});

test('activation removes only older Gridshift shell caches and claims clients', async () => {
  const harness = workerHarness();
  let activationPromise;
  harness.listeners.activate({ waitUntil(promise) { activationPromise = promise; } });
  await activationPromise;
  assert.deepEqual(harness.deleted, ['gridshift-shell-v3', 'gridshift-shell-v4', 'gridshift-shell-v5', 'gridshift-shell-v6', 'gridshift-shell-v7']);
  assert.equal(harness.claimed, true);
});

test('an update waits until the user chooses to activate it', () => {
  const harness = workerHarness();
  harness.listeners.message({ data: { type: 'OTHER' } });
  assert.equal(harness.waitingSkipped, false);
  harness.listeners.message({ data: { type: 'SKIP_WAITING' } });
  assert.equal(harness.waitingSkipped, true);
});

test('navigation uses the cached shell for a consistent offline app launch', async () => {
  const harness = workerHarness();
  harness.entries.set('./index.html', { shell: true });
  let responsePromise;
  harness.listeners.fetch({
    request: { method: 'GET', mode: 'navigate', url: 'https://gridshift.example/' },
    respondWith(promise) { responsePromise = promise; }
  });
  assert.deepEqual(await responsePromise, { shell: true });
});
