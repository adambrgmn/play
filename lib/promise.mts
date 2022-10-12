export type PromiseObject = Record<string, PromiseLike<unknown>>;

export type AwaitedObject<T extends PromiseObject> = { [Key in keyof T]: Awaited<T[Key]> };

/**
 * Await all promises in an object. The returned promise will reject if any of the included promises
 * are rejected.
 */
export async function all<T extends PromiseObject>(obj: T) {
  let entries = await Promise.all(
    Object.entries(obj).map(async ([key, promise]) => {
      return [key, await promise] as const;
    }),
  );

  return Object.fromEntries(entries) as AwaitedObject<T>;
}

export type AllSettledObject<T extends PromiseObject> = { [Key in keyof T]: PromiseSettledResult<Awaited<T[Key]>> };

/**
 * Wait for all promise in an object to settle. It will always resolve with an object containing the
 * result of the promise. If `status` is `'fulfilled'` it will contain the value. If `status` is
 * `'rejected'` it will contain the reason (e.g. rejected error).
 */
export async function allSettled<T extends PromiseObject>(obj: T) {
  let entries = await Promise.all(
    Object.entries(obj).map(async ([key, promise]) => {
      return [
        key,
        await promise.then(
          (value) => ({ status: 'fulfilled', value }),
          (reason) => ({ status: 'rejected', reason }),
        ),
      ] as const;
    }),
  );

  return Object.fromEntries(entries) as AllSettledObject<T>;
}

/**
 * Wait for the first promise in an object to be resolved or rejected.
 */
export function race<T extends PromiseObject>(obj: T) {
  return Promise.race(Object.values(obj)) as Promise<Awaited<T[keyof T]>>;
}

/**
 * Wait for the first promise in an object to be resolved. The returned object will be rejected if
 * all of the promises are rejected.
 */
export function any<T extends PromiseObject>(obj: T) {
  return Promise.any(Object.values(obj)) as Promise<Awaited<T[keyof T]>>;
}
