import test from 'node:test';
import assert from 'node:assert/strict';
import { isVisitorCountingHost, recordVisit, seoulDate } from '../src/visitorStats.ts';

function fixture() {
  const storage = new Map(), counts = new Map(), requests = [];
  const clientStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const request = async (input, options = {}) => {
    const url = new URL(input); requests.push({ url, method: options.method ?? 'GET' });
    if (options.method === 'PATCH') {
      for (const [path, value] of Object.entries(JSON.parse(options.body))) {
        counts.set(path, (counts.get(path) ?? 0) + value['.sv'].increment);
      }
      return new Response(null, { status: 204 });
    }
    const path = url.pathname.split('/visits/')[1]?.replace(/\.json$/, '');
    assert.ok(path === 'total' || path?.startsWith('days/'), 'Read only one small counter at a time');
    return Response.json(counts.get(path) ?? null);
  };
  return { clientStorage, request, requests, counts };
}

test('repeat visits count once per browser/day and the next Korean day increments the total', async () => {
  const f = fixture();
  assert.deepEqual(await recordVisit(f.clientStorage, '2026-10-21', f.request), { today: 1, total: 1 });
  assert.deepEqual(await recordVisit(f.clientStorage, '2026-10-21', f.request), { today: 1, total: 1 });
  assert.deepEqual(await recordVisit(f.clientStorage, '2026-10-22', f.request), { today: 1, total: 2 });
  assert.equal(f.requests.filter(r => r.method === 'PATCH').length, 2);
});

test('overlapping calls share the reserved day and make one write', async () => {
  const f = fixture();
  await Promise.all([recordVisit(f.clientStorage, '2026-10-21', f.request), recordVisit(f.clientStorage, '2026-10-21', f.request)]);
  assert.equal(f.counts.get('total'), 1);
});

test('blocked storage reads shared stats without writing', async () => {
  const f = fixture(); f.counts.set('total', 23);
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.deepEqual(await recordVisit(blocked, '2026-10-21', f.request), { today: 0, total: 23 });
  assert.equal(f.requests.some(r => r.method === 'PATCH'), false);
});

test('an ambiguous write failure is not retried or counted again on refresh', async () => {
  const f = fixture();
  await assert.rejects(recordVisit(f.clientStorage, '2026-10-21', async () => { throw Error('timeout'); }));
  await recordVisit(f.clientStorage, '2026-10-21', f.request);
  assert.equal(f.requests.some(r => r.method === 'PATCH'), false);
});

test('Korean midnight and production-only counting are explicit', () => {
  assert.equal(seoulDate(new Date('2026-10-21T14:59:59Z')), '2026-10-21');
  assert.equal(seoulDate(new Date('2026-10-21T15:00:00Z')), '2026-10-22');
  assert.equal(isVisitorCountingHost('ranke0802.web.app'), true);
  for (const host of ['localhost', '127.0.0.1', 'ranke0802--pr-example.web.app', 'ranke0802.web.app.attacker.invalid']) assert.equal(isVisitorCountingHost(host), false);
});
