import { type ternary } from "./mod.ts"

/**
 * A trit is the balanced ternary equivalent of a bit that can be one of three values:
 * - `-1`: Negative
 * - `0`: Zero
 * - `+1`: Positive
 */
export type trit = -1 | 0 | 1

/**
 * Logical complement (negation) of a trit.
 *
 * @returns
 *   - the negated boolean if a boolean
 *   - `undefined` if `undefined`
 */
export const not = (a: trit): trit => -a as trit

/**
 * Logical conjunction of two trits.
 *
 * @returns
 *   - `false` if any operand is `false`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `true`
 * @see and
 */
export const both = (a: trit, b: trit): trit => Math.min(a, b) as trit

/**
 * Logical disjunction of two trits.
 *
 * @returns
 *   - `true` if any operand is `true`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see or
 */
export const either = (a: trit, b: trit): trit => Math.max(a, b) as trit

/**
 * Logical inequality of two trits.
 *
 * @returns
 *   - `true` if both operands are different booleans
 *   - `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see xor
 */
export const differ = (a: trit, b: trit): trit => both(either(a, b), not(both(a, b)))

/**
 * Logical equality of two trits.
 *
 * @returns
 *   - `true` if both operands are the same boolean
 *   - `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see xnor
 */
export const same = (a: trit, b: trit): trit => not(differ(a, b))

/**
 * Logical conjunction of an arbitrary number of trits.
 *
 * @returns
 *   - `false` if any operand is `false`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `true`
 * @see both
 */
export const and = (...n: trit[]): trit => n.reduce(both)

/**
 * Logical disjunction of an arbitrary number of trits.
 *
 * @returns
 *   - `true` if any operand is `true`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see either
 */
export const or = (...n: trit[]): trit => n.reduce(either)

/**
 * Logical inequality of an arbitrary number of trits.
 *
 * Returns `true` only if the operands are **not** all the same boolean.
 *
 * @returns
 *   - `false` if all operands are the same boolean
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `true`
 * @see differ
 */
export const xor = (...n: trit[]): trit => and(or(...n), not(and(...n)))

/**
 * Logical equality of an arbitrary number of trits.
 *
 * Returns `true` only if all operands are the same boolean.
 *
 * @returns
 *   - `true` if all operands are the same boolean
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see same
 */
export const xnor = (...n: trit[]): trit => not(xor(...n))

/**
 * Evaluates a trit and returns the argument corresponding to its truth value.
 *
 * @returns
 *   - the value of `isTrue` if the `condition` is `1`
 *   - the value of `isFalse` if the `condition` is `-1`
 *   - the value of `isUndefined` if the `condition` is `0`
 * @see collapse
 */
export function resolve(condition: trit, isPositive: unknown, isNegative?: unknown, isZero?: unknown): unknown
export function resolve<T>(condition: trit, isPositive: T, isNegative?: T, isZero?: T): T
export function resolve(condition: trit, isPositive: any, isNegative?: any, isZero?: any): any {
  return condition === 1 ? isPositive : condition === -1 ? isNegative : isZero
}

/**
 * Collapses a trit using Priest's Logic of Paradox.
 *
 * @returns
 *   - the value of `isTrue` if the `condition` is `1` or `0`
 *   - the value of `isFalse` if the `condition` is `-1`
 * @see resolve
 * @see toBoolean
 */
export function collapse(condition: trit, isPositive: unknown, isNegative?: unknown): unknown
export function collapse<T>(condition: trit, isPositive: T, isNegative?: T): T
export function collapse(condition: trit, isPositive: any, isNegative: any): any {
  return condition === -1 ? isNegative : isPositive
}

/**
 * Collapses a trit to a boolean using Priest's Logic of Paradox.
 *
 * @returns
 *   - `true` if the ternary is `1` or `0`
 *   - `false` if the ternary is `-1`
 * @see collapse
 */
export const toBoolean = (a: trit): boolean => collapse<boolean>(a, true, false)

/**
 * Converts a trit to a ternary.
 *
 * @returns
 *   - `true` if the trit is `1`
 *   - `undefined` if the trit is `0`
 *   - `false` if the trit is `-1`
 * @see fromTernary
 */
export const toTernary = (a: trit): ternary => a === 1 ? true : a === -1 ? false : undefined

/**
 * Converts a ternary to a trit.
 *
 * @returns
 *   - `1` if the ternary is `true`
 *   - `0` if the ternary is `undefined`
 *   - `-1` if the ternary is `false`
 * @see toTernary
 */
export const fromTernary = (a: ternary): trit => a === true ? 1 : a === false ? -1 : 0
