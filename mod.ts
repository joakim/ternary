/**
 * Ternary values can be one of three values: `true`, `false` or `undefined`, representing the truth value of a
 * three-valued logical proposition.
 */
export type ternary = boolean | undefined

/**
 * Logical complement (negation) of a ternary operand.
 *
 * @returns
 *   - the negated boolean if a boolean
 *   - `undefined` if `undefined`
 */
export function not(a: ternary): ternary {
  return a === undefined ? undefined : !a
}

/**
 * Logical conjunction of two ternary operands.
 *
 * @returns
 *   - `false` if any operand is `false`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `true`
 * @see and
 */
export function both(a: ternary, b: ternary): ternary {
  return a === false ? false : (a === true ? (b === undefined ? undefined : b) : (b === false ? false : undefined))
}

/**
 * Logical disjunction of two ternary operands.
 *
 * @returns
 *   - `true` if any operand is `true`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see or
 */
export function either(a: ternary, b: ternary): ternary {
  return a === true ? true : (a === false ? (b === undefined ? undefined : b) : (b === true ? true : undefined))
}

/**
 * Logical inequality of two ternary operands.
 *
 * @returns
 *   - `true` if both operands are different booleans
 *   - `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see xor
 */
export function differ(a: ternary, b: ternary): ternary {
  return a === undefined || b === undefined ? undefined : a !== b
}

/**
 * Logical equality of two ternary operands.
 *
 * @returns
 *   - `true` if both operands are the same boolean
 *   - `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see xnor
 */
export function same(a: ternary, b: ternary): ternary {
  return a === undefined || b === undefined ? undefined : a === b
}

/**
 * Logical conjunction of an arbitrary number of ternary operands.
 *
 * @returns
 *   - `false` if any operand is `false`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `true`
 * @see both
 */
export function and(...operands: ternary[]): ternary {
  return operands.reduce(both)
}

/**
 * Logical disjunction of an arbitrary number of ternary operands.
 *
 * @returns
 *   - `true` if any operand is `true`
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see either
 */
export function or(...operands: ternary[]): ternary {
  return operands.reduce(either)
}

/**
 * Logical inequality of an arbitrary number of ternary operands.
 *
 * Returns `true` only if the operands are **not** all the same boolean.
 *
 * @returns
 *   - `false` if all operands are the same boolean
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `true`
 * @see differ
 */
export function xor(...operands: ternary[]): ternary {
  return (operands.length < 2 || operands.indexOf(undefined) > -1) ? undefined : !operands.every(operand => operand === operands[0])
}

/**
 * Logical equality of an arbitrary number of ternary operands.
 *
 * Returns `true` only if all operands are the same boolean.
 *
 * @returns
 *   - `true` if all operands are the same boolean
 *   - otherwise, `undefined` if any operand is `undefined`
 *   - otherwise, `false`
 * @see same
 */
export function xnor(...operands: ternary[]): ternary {
  return (operands.length < 2 || operands.indexOf(undefined) > -1) ? undefined : operands.every(operand => operand === operands[0])
}

/**
 * Evaluates a ternary condition and returns the value corresponding to its truth value.
 *
 * @returns
 *   - the value of `isTrue` if the `condition` is `true`
 *   - the value of `isFalse` if the `condition` is `false`
 *   - the value of `isUndefined` if the `condition` is `undefined`
 * @see collapse
 */
export function resolve(condition: ternary, isTrue: unknown, isFalse?: unknown, isUndefined?: unknown): unknown
export function resolve<T>(condition: ternary, isTrue: T, isFalse?: T, isUndefined?: T): T
export function resolve(condition: ternary, isTrue: any, isFalse?: any, isUndefined?: any): any {
  return condition === true ? isTrue : condition === false ? isFalse : isUndefined
}

/**
 * Collapses a ternary condition using Priest's Logic of Paradox, where `undefined` means "both `true` and `false`" and
 * therefore evaluates to `true`.
 *
 * @returns
 *   - the value of `isTrue` if the `condition` is `true` or `undefined`
 *   - the value of `isFalse` if the `condition` is `false`
 * @see resolve
 * @see toBoolean
 */
export function collapse(condition: ternary, isTrue: unknown, isFalse?: unknown): unknown
export function collapse<T>(condition: ternary, isTrue: T, isFalse?: T): T
export function collapse(condition: ternary, isTrue: any, isFalse?: any): any {
  return condition === false ? isFalse : isTrue
}

/**
 * Collapses a ternary truth value to a boolean using Priest's Logic of Paradox.
 *
 * @returns
 *   - `true` if the ternary value is `true` or `undefined`
 *   - `false` if the ternary value is `false`
 * @see collapse
 */
export function toBoolean(a: ternary): boolean {
  return collapse<boolean>(a, true, false)
}

interface TernaryInstance {
  /** Returns the primitive value of the `Ternary` object. */
  valueOf(): ternary
  /** Returns a string representation of the ternary value. */
  toString(): string
}

/**
 * When `Ternary()` is called as a constructor (with `new`), it coerces `value` to a ternary primitive and returns a
 * wrapping `Ternary` object, which is not a primitive.
 *
 * **Warning:** You should rarely find yourself using `Ternary` as a constructor.
 */
type Ternary = {
  new (value?: unknown): TernaryInstance

  /**
   * When `Ternary()` is called as a function (without `new`), it returns `value` coerced to a ternary primitive:
   * `true`, `false` or `undefined`.
   */
  (value?: unknown): ternary
}

export const Ternary: Ternary = (function (this: any, value?: unknown): any {
  const primitive: ternary = value === undefined ? undefined : Boolean(value)

  // Class
  if (new.target) {
    this.valueOf = () => primitive
    this.toString = () => String(primitive)
    return
  }

  // Function
  return primitive
}) as unknown as Ternary
