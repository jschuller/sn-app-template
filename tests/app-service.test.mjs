/**
 * Tests for src/server/AppService.server.js, run in a Node vm with stubbed Glide APIs
 * (the instance-side behaviour is covered by the ATF suite in src/fluent/tests/).
 *
 *   npm test
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import vm from 'node:vm';

const SOURCE = readFileSync(new URL('../src/server/AppService.server.js', import.meta.url), 'utf8');

/** In-memory GlideRecordSecure that records the calls listItems makes. */
function stubGlide(calls) {
    return function GlideRecordSecure(table) {
        calls.push(['table', table]);
        this.orderByDesc = (field) => calls.push(['orderByDesc', field]);
        this.chooseWindow = (first, last) => calls.push(['chooseWindow', first, last]);
        this.query = () => calls.push(['query']);
        this.next = () => false;
    };
}

/** A script context like a scoped app's: Prototype-style Class.create and the platform globals. */
function scope(calls = []) {
    return vm.createContext({
        Class: {
            create: () =>
                function () {
                    this.initialize.apply(this, arguments);
                },
        },
        GlideRecordSecure: stubGlide(calls),
    });
}

const STUBS = ['Class', 'GlideRecordSecure'];
const declared = (context) => Object.keys(context).filter((key) => !STUBS.includes(key));

describe('AppService script include', () => {
    test('declares only AppService in the scope', () => {
        const context = scope();
        vm.runInContext(SOURCE, context);
        assert.deepEqual(declared(context), ['AppService']);
        assert.equal(typeof context.AppService, 'function');
        assert.equal(vm.runInContext('new AppService().type', context), 'AppService');
    });

    test('keeps its own constants when another Script Include declares the same names', () => {
        const context = scope();
        vm.runInContext("var FP = 'x_other_'; var MAX_NAME = 1; var CATEGORIES = ['other'];", context);
        vm.runInContext(SOURCE, context);
        vm.runInContext("var MAX_NAME = 2; var CATEGORIES = ['later']; var MAX_LIMIT = 1;", context);
        const svc = vm.runInContext('new AppService()', context);
        assert.equal(svc._validate({ name: 'x'.repeat(200), category: 'urgent' }, true), '');
        assert.equal(svc._validate({ name: 'x'.repeat(201) }, true), 'name must be at most 200 characters');
        assert.equal(svc._validate({ name: 'a', category: 'other' }, true), 'category must be one of: general, important, urgent');
    });

    test('lists newest first with a stable tie-break and a clamped window', () => {
        const calls = [];
        const context = scope(calls);
        vm.runInContext(SOURCE, context);
        const result = vm.runInContext('new AppService()', context).listItems({ limit: ['500'], offset: ['20'] });
        // JSON round trip: objects made inside the vm have that context's prototypes.
        assert.deepEqual(JSON.parse(JSON.stringify(result)), { status: 200, body: [] });
        assert.deepEqual(calls, [
            ['table', 'x_snc_example_item'],
            ['orderByDesc', 'sys_created_on'],
            ['orderByDesc', 'sys_id'],
            ['chooseWindow', 20, 120],
            ['query'],
        ]);
    });
});
