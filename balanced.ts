import { type ternary } from "./mod.ts"

/**
 * A trit is the balanced ternary equivalent of a bit that can be one of three values:
 * - `-1`: Negative
 * - `0`: Zero
 * - `+1`: Positive
 */
export type trit = -1 | 0 | 1

/** Logical complement (negation) of a trit. */
export const not = (a: trit): trit => -a as trit

/** Logical conjunction of two trits. */
export const both = (a: trit, b: trit): trit => Math.min(a, b) as trit

/** Logical disjunction of two trits. */
export const either = (a: trit, b: trit): trit => Math.max(a, b) as trit

/** Logical inequality of two trits. */
export const differ = (a: trit, b: trit): trit => both(either(a, b), not(both(a, b)))

/** Logical equality of two trits. */
export const same = (a: trit, b: trit): trit => not(differ(a, b))

/** Logical conjunction of an arbitrary number of trits. */
export const and = (...n: trit[]): trit => n.reduce(both)

/** Logical disjunction of an arbitrary number of trits. */
export const or = (...n: trit[]): trit => n.reduce(either)

/** Logical inequality of an arbitrary number of trits. */
export const xor = (...n: trit[]): trit => and(or(...n), not(and(...n)))

/** Logical equality of an arbitrary number of trits. */
export const xnor = (...n: trit[]): trit => not(xor(...n))

/** Evaluates a trit and returns the value corresponding to its truth value. */
export function resolve(condition: trit, isPositive: unknown, isNegative?: unknown, isZero?: unknown): unknown
export function resolve<T>(condition: trit, isPositive: T, isNegative?: T, isZero?: T): T
export function resolve(condition: trit, isPositive: any, isNegative?: any, isZero?: any): any {
  return condition === 1 ? isPositive : condition === -1 ? isNegative : isZero
}

/** Collapses a trit using Priest's Logic of Paradox. */
export function collapse(condition: trit, isPositive: unknown, isNegative?: unknown): unknown
export function collapse<T>(condition: trit, isPositive: T, isNegative?: T): T
export function collapse(condition: trit, isPositive: any, isNegative: any): any {
  return condition === -1 ? isNegative : isPositive
}

/** Collapses a trit to a boolean using Priest's Logic of Paradox. */
export const toBoolean = (a: trit): boolean => collapse<boolean>(a, true, false)

/** Converts a trit to a ternary truth value. */
export const toTernary = (a: trit): ternary => a === 1 ? true : a === -1 ? false : undefined

/** Converts a ternary truth value to a trit. */
export const fromTernary = (a: ternary): trit => a === true ? 1 : a === false ? -1 : 0
