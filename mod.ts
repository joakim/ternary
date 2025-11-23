/**
 * Ternary values can be one of three values: `true`, `false` or `undefined`, representing the truth value of a
 * three-valued logical proposition.
 */
export type ternary = boolean | undefined

/** Logical NOT (logical complement, negation) of a ternary operand. Converts truth to falsity and vice versa. */
export function not(a: ternary): ternary {
  return a === undefined ? undefined : !a
}

/** Logical AND (logical conjunction) for a set of ternary operands. */
export function and(a: ternary, b: ternary): ternary {
  return a === false ? false : (a === true ? (b === undefined ? undefined : b) : (b === false ? false : undefined))
}

/** Logical OR (logical disjunction) for a set of ternary operands. */
export function or(a: ternary, b: ternary): ternary {
  return a === true ? true : (a === false ? (b === undefined ? undefined : b) : (b === true ? true : undefined))
}

/** Logical XOR (logical inequality) for a set of ternary operands. */
export function xor(a: ternary, b: ternary): ternary {
  return a === undefined || b === undefined ? undefined : a !== b
}

/** Logical XNOR (logical equality) for a set of ternary operands. */
export function xnor(a: ternary, b: ternary): ternary {
  return a === undefined || b === undefined ? undefined : a === b
}

/** Ternary conditional, evaluates to one of three values based on a ternary condition. */
export function cond<T = any>(condition: ternary, ifTrue: any, ifFalse?: any, ifUndefined?: any): T {
  return condition === true ? ifTrue : condition === false ? ifFalse : ifUndefined
}

/** Logical equality for a set of ternary operands. Alias of `xnor`. */
export const eq = xnor

interface TernaryInstance extends Object {
  /** Returns the primitive value of the `Ternary` object. */
  valueOf(): ternary
  /** Returns a string representation of the ternary value. */
  toString(): string
}

type Ternary = {
  /**
   * When `Ternary()` is called as a function (without `new`), it returns `value` coerced to a ternary primitive:
   * `true`, `false` or `undefined`.
   */
  (value?: unknown): ternary

  /**
   * When `Ternary()` is called as a constructor (with `new`), it coerces `value` to a ternary primitive and returns a
   * wrapping `Ternary` object, which is not a primitive.
   *
   * **Warning:** You should rarely find yourself using `Ternary` as a constructor.
   */
  new (value?: unknown): TernaryInstance
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
