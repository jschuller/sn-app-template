/**
 * Tests for the item list's offset pagination (src/client/services/pagination.js).
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { loadPages, mergeById } from '../src/client/services/pagination.js';

const PAGE_SIZE = 3;

/** A newest-first list served with limit/offset, like GET /items. */
function fakeServer(count) {
    let next = count;
    const rows = Array.from({ length: count }, (_, i) => ({ sys_id: `id${count - i}`, name: `item ${count - i}` }));
    return {
        rows,
        fetchPage: async (offset) => rows.slice(offset, offset + PAGE_SIZE).map((row) => ({ ...row })),
        create() {
            next += 1;
            rows.unshift({ sys_id: `id${next}`, name: `item ${next}` });
        },
        rename(sysId, name) {
            rows.find((row) => row.sys_id === sysId).name = name;
        },
        remove(sysId) {
            rows.splice(rows.findIndex((row) => row.sys_id === sysId), 1);
        },
    };
}

const ids = (rows) => rows.map((row) => row.sys_id);

describe('mergeById', () => {
    test('appends new rows in order', () => {
        assert.deepEqual(ids(mergeById([{ sys_id: 'a' }], [{ sys_id: 'b' }, { sys_id: 'c' }])), ['a', 'b', 'c']);
    });

    test('lists a repeated row once, in its first place, with the newer copy', () => {
        const merged = mergeById(
            [{ sys_id: 'a', name: 'old' }, { sys_id: 'b' }],
            [{ sys_id: 'a', name: 'new' }, { sys_id: 'c' }, { sys_id: 'c' }],
        );
        assert.deepEqual(ids(merged), ['a', 'b', 'c']);
        assert.equal(merged[0].name, 'new');
    });

    test('does not change its inputs', () => {
        const current = [{ sys_id: 'a' }];
        mergeById(current, [{ sys_id: 'b' }]);
        assert.deepEqual(current, [{ sys_id: 'a' }]);
    });
});

describe('loadPages', () => {
    test('loads the requested number of pages and reports more', async () => {
        const server = fakeServer(10);
        const { rows, hasMore } = await loadPages(server.fetchPage, 2, PAGE_SIZE);
        assert.deepEqual(ids(rows), ['id10', 'id9', 'id8', 'id7', 'id6', 'id5']);
        assert.equal(hasMore, true);
    });

    test('stops at a short page', async () => {
        const server = fakeServer(4);
        const { rows, hasMore } = await loadPages(server.fetchPage, 5, PAGE_SIZE);
        assert.deepEqual(ids(rows), ['id4', 'id3', 'id2', 'id1']);
        assert.equal(hasMore, false);
    });

    test('loads at least one page', async () => {
        const { rows } = await loadPages(fakeServer(2).fetchPage, 0, PAGE_SIZE);
        assert.equal(rows.length, 2);
    });
});

describe('the App.jsx flow', () => {
    test('"Load more" after someone else creates a row lists no row twice and skips none', async () => {
        const server = fakeServer(7);
        let { rows } = await loadPages(server.fetchPage, 1, PAGE_SIZE);
        server.create(); // id8 lands on top and shifts every offset by one
        rows = mergeById(rows, await server.fetchPage(rows.length));
        rows = mergeById(rows, await server.fetchPage(rows.length));
        rows = mergeById(rows, await server.fetchPage(rows.length));
        assert.equal(new Set(ids(rows)).size, rows.length, 'no duplicate sys_id (React key)');
        for (let n = 1; n <= 7; n += 1) assert.ok(ids(rows).includes(`id${n}`), `id${n} is shown`);
    });

    test('a reload after a change keeps every loaded page and shows the change', async () => {
        const server = fakeServer(10);
        let pageCount = 1;
        const { rows: first } = await loadPages(server.fetchPage, pageCount, PAGE_SIZE);
        const shown = mergeById(first, await server.fetchPage(first.length));
        pageCount += 1;
        assert.equal(shown.length, 6);
        server.rename('id5', 'renamed');
        server.remove('id9');
        server.create();
        const { rows } = await loadPages(server.fetchPage, pageCount, PAGE_SIZE);
        assert.deepEqual(ids(rows), ['id11', 'id10', 'id8', 'id7', 'id6', 'id5']);
        assert.equal(rows.find((row) => row.sys_id === 'id5').name, 'renamed');
    });
});
