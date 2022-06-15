/**
 * @typedef {Record<string, PromiseLike<unknown>>} PromiseObject
 */

/**
 * @template {PromiseObject} T
 * @typedef {{ [Key in keyof T]: Awaited<T[Key]> }} AwaitedObject
 */

/**
 * Await all promises in an object. The returned promise will reject if any of the included promises
 * are rejected.
 *
 * @template {PromiseObject} T
 * @param {T} obj
 * @returns {Promise<AwaitedObject<T>>}
 */
export async function all(obj) {
  let entries = await Promise.all(
    Object.entries(obj).map(async ([key, promise]) => {
      return [key, await promise];
    }),
  );

  return Object.fromEntries(entries);
}

/**
 * @template {PromiseObject} T
 * @typedef {{ [Key in keyof T]: PromiseSettledResult<Awaited<T[Key]>> }} AllSettledObject
 */

/**
 * Wait for all promise in an object to settle. It will always resolve with an object containing the
 * result of the promise. If `status` is `'fulfilled'` it will contain the value. If `status` is
 * `'rejected'` it will contain the reason (e.g. rejected error).
 *
 * @template {PromiseObject} T
 * @param {T} obj
 * @returns {Promise<AllSettledObject<T>>}
 */
export async function allSettled(obj) {
  let entries = await Promise.all(
    Object.entries(obj).map(async ([key, promise]) => [
      key,
      await promise.then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason }),
      ),
    ]),
  );

  return Object.fromEntries(entries);
}

/**
 * Wait for the first promise in an object to be resolved or rejected.
 *
 * @template {PromiseObject} T
 * @param {T} obj
 * @returns {Promise<Awaited<T[keyof T]>>}
 */
export function race(obj) {
  /** @type {any} */
  let result = Promise.race(Object.values(obj));
  return result;
}

/**
 * Wait for the first promise in an object to be resolved. The returned object will be rejected if
 * all of the promises are rejected.
 *
 * @template {PromiseObject} T
 * @param {T} obj
 * @returns {Promise<Awaited<T[keyof T]>>}
 */
export function any(obj) {
  /** @type {any} */
  let result = Promise.any(Object.values(obj));
  return result;
}
