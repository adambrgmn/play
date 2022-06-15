import { strict as assert } from 'node:assert';
import test from 'node:test';

import { PromiseProps } from './main.mjs';

test('PromiseProps.all', async (t) => {
  await t.test('awaits all promises in provided object', async () => {
    let result = await PromiseProps.all({
      foo: Promise.resolve('foo'),
      bar: Promise.resolve('bar'),
    });

    assert.deepEqual(result, { foo: 'foo', bar: 'bar' }, 'should resolve with object of resolved values');
  });

  await t.test('throws an error if any promise is rejected', async () => {
    let result = PromiseProps.all({
      foo: Promise.resolve('foo'),
      bar: Promise.reject(new Error('bar')),
    });

    assert.deepEqual(await unwrap(result), new Error('bar'), 'should reject with error from first rejected promise');
  });
});

test('PromiseProps.allSettled', async (t) => {
  await t.test('awaits all values in given object regardless of if the resolve or reject', async () => {
    let result = await PromiseProps.allSettled({
      foo: Promise.resolve('foo'),
      bar: Promise.resolve('bar'),
    });

    assert.deepEqual(
      result,
      { foo: { status: 'fulfilled', value: 'foo' }, bar: { status: 'fulfilled', value: 'bar' } },
      'should resolve with object of resolved values',
    );
  });

  await t.test('does not fail if any of the given promises are rejected', async () => {
    let result = await PromiseProps.allSettled({
      foo: Promise.resolve('foo'),
      bar: Promise.reject(new Error('bar')),
    });

    assert.deepEqual(result.foo, { status: 'fulfilled', value: 'foo' }, 'should indicate fulfilled status');
    assert.deepEqual(result.bar, { status: 'rejected', reason: new Error('bar') }, 'should indicate rejected status');
  });
});

test('PromiseProps.race', async (t) => {
  await t.test('returns the result of the first fulfilled promise', async () => {
    let result = await PromiseProps.race({
      foo: delay(0).then(() => 'foo'),
      bar: delay(5).then(() => 'bar'),
    });

    assert.equal(result, 'foo', 'should resolve fastest promise');
  });

  await t.test('throws an error if the first settled promise is rejected', async () => {
    let result = PromiseProps.race({
      foo: delay(0).then(() => {
        throw new Error('foo');
      }),
      bar: delay(5).then(() => 'bar'),
    });

    assert.deepEqual(await unwrap(result), new Error('foo'), 'should throw error if fastest promise is rejected');
  });
});

test('PromiseProps.any', async (t) => {
  await t.test('returns the result of the first fulfilled promise', async () => {
    let result = await PromiseProps.any({
      foo: delay(0).then(() => 'foo'),
      bar: delay(5).then(() => 'bar'),
    });

    assert.equal(result, 'foo', 'should resolve fastest promise');
  });

  await t.test('rejects the promise if all promises are rejected', async () => {
    let result = PromiseProps.any({
      foo: delay(0).then(() => {
        throw new Error('foo');
      }),
      bar: delay(0).then(() => {
        throw new Error('bar');
      }),
    });

    assert.ok((await unwrap(result)) instanceof global.AggregateError, 'should reject with AggregateError');
  });

  await t.test('awaits the first fulfilled promise, ignoring rejected ones', async () => {
    let result = await PromiseProps.any({
      foo: delay(0).then(() => {
        throw new Error('foo');
      }),
      bar: delay(5).then(() => 'bar'),
    });

    assert.equal(result, 'bar', 'should wait for first fulfilled promise');
  });
});

/**
 * @template T
 * @param {PromiseLike<T>} p
 * @returns {T | unknown}
 */
function unwrap(p) {
  return p.then(
    (r) => r,
    (e) => e,
  );
}

function delay(ms = 0) {
  return new Promise((r) => setTimeout(r, ms));
}
