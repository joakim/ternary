# Ternary

Provides types and functions for [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic) (3VL),
specifically Kleene K3 / Łukasiewicz Ł3 logic, used by the SQL standard among others.

It enforces strict equality, unlike JavaScript's [sloppy definition of truth](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), and works as expected with booleans.

Nothing fancy, just:

```ts
type ternary = boolean | undefined
```

With functions for common logical operations:

- `not`
- `and`
- `or`

As well as:

- `xor`
- `xnor` (`eq`)
- `cond`, a [conditional](https://en.wikipedia.org/wiki/Ternary_conditional_operator) that is actually ternary

Also included is `Ternary`, a function/class like `Boolean`, for coercing any value to a ternary value. This will be sloppy, because JavaScript.

## What for?

Well, sometimes you need a third truth value:

|                       | `true`   | `false`  | `undefined`    |
|-----------------------|----------|----------|----------------|
| **Unknown**           | true     | false    | unknown        |
| **Undecidable**       | true     | false    | undecidable    |
| **User input**        | yes      | no       | not applicable |
| **Access control**    | allow    | deny     | indeterminate  |
| **Electrical charge** | positive | negative | no charge      |
| **DC motor**          | forward  | backward | no rotation    |
| **Comparison**        | larger   | smaller  | equal          |

In JavaScript conditionals, `undefined` is coerced to `false` and effectively ignored. In K3/Ł3 ternary logic, `undefined` _propagates_: a compound condition is `true` or `false` only when it is definitely `true` or definitely `false`; otherwise it is `undefined`.

A variable that is `boolean | undefined` is already ternary. This library merely formalizes that and provides functions for correct evaluation using ternary logic.

> Ternary – either you need it, you don't need it, or you don't know whether you need it.

## Truth tables

_A quick guide to ternary logic_

While more complex than boolean logic, ternary is not as difficult as it looks once you get the hang of it. It helps to think of `undefined` as an _unknown_ truth value that's neither `true` nor `false`.

- F = `false`
- U = `undefined` or _unknown_
- T = `true`

### not

Flips `true` and `false`, `undefined` remains the same.

| **A** | **NOT A** |
|-------|-----------|
| **F** | T         |
| **U** | U         |
| **T** | F         |

### and

The result is the _least true_ of the operands.

- If any operand is `false`, it returns `false`
- Otherwise, if any operand is `undefined`, it returns `undefined`
- Otherwise, both operands are `true`, so it returns `true`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | F     | F     | F     |
| **U**   | F     | U     | U     |
| **T**   | F     | U     | T     |

### or

Inverse of **and**. The result is the _most true_ of the operands.

- If any operand is `true`, it returns `true`
- Otherwise, if any operand is `undefined`, it returns `undefined`
- Otherwise, both operands are `false`, so it returns `false`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | F     | U     | T     |
| **U**   | U     | U     | T     |
| **T**   | T     | T     | T     |


The following are less common. You probably only need the above tables.

### xor

The result is `true` only when the operands are _different booleans_. It's just like boolean **xor**, except `undefined` always wins out.

- If one operand is `true` and the other is `false`, it returns `true`
- If both operands are `true` or both are `false`, it returns `false`
- If any operand is `undefined`, it returns `undefined`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | F     | U     | T     |
| **U**   | U     | U     | U     |
| **T**   | T     | U     | F     |

### xnor (eq)

Negation of **xor**. The result is `true` only when the operands are _the same boolean_. It's just like boolean XNOR, except `undefined` always wins out.

- If both operands are `true` or both are `false`, it returns `true`
- If one operand is `true` and the other is `false`, it returns `false`
- If any operand is `undefined`, it returns `undefined`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | T     | U     | F     |
| **U**   | U     | U     | U     |
| **T**   | F     | U     | T     |


## License

This work is dual-licensed under both MIT and XPL. You may choose either of the two.

`SPDX-License-Identifier: MIT OR XPL`
