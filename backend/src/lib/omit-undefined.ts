/**
 * module name:
 *  + omit-undefined.ts
 *
 * description:
 *  + Removes undefined variables from objects.
 */

export function omitUndefined<T extends object>(input: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(input).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
}
