# Ternary

Provides types and functions for [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic) (3VL),
specifically Kleene K3 / Łukasiewicz Ł3 logic, used by the SQL standard among others.

It uses strict equality, unlike JavaScript's [sloppy definition of truth](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), and works as expected with boolean values.

Nothing fancy, just:

```ts
type ternary = boolean | undefined
```

And functions for common logical operations:

- `not`
- `and`
- `or`

As well as:

- `xor`
- `xnor` / `eq`
- `cond`, a [conditional](https://en.wikipedia.org/wiki/Ternary_conditional_operator) that is actually ternary

Also included is `Ternary`, a function/class like `Boolean`, for coercing any value to a ternary value. Note that this will be sloppy, because JavaScript.

## What for?

> What do I need ternary for?

Well, sometimes you need a third value:

- Dealing with unknowns (true, false, unknown)
- Comparisons (larger, smaller, equal)
- User input (yes, no, not applicable)
- Access control (allow, deny, indeterminate)
- Motors (forward, backward, no rotation)
- Charges (positive, negative, no charge)
- …

A variable that is `boolean | undefined` is already ternary. This library merely formalizes it and provides functions for correct evaluation using ternary logic, where `undefined` is part of the equation.

> Ternary – you either need it, don't need it, or don't know whether you need it or not.

## Truth tables

_A quick guide to ternary logic_

While clearly more complex than boolean logic, ternary is not as difficult as it looks once you get the hang of it. It helps to think of `undefined` as an _unknown_ truth value.

- F = `false`
- U = `undefined` or _unknown_
- T = `true`

### NOT

Flips `true` and `false`, `undefined` remains the same.

| **A** | **NOT A** |
|-------|-----------|
| **F** | T         |
| **U** | U         |
| **T** | F         |

### AND

The result is the _least true_ of the operands.

- If any operand is `false`, it returns `false`
- Otherwise, if any operand is `undefined`, it returns `undefined`
- Otherwise, both operands are `true`, so it returns `true`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | F     | F     | F     |
| **U**   | F     | U     | U     |
| **T**   | F     | U     | T     |

### OR

The result is the _most true_ of the operands – the inverse of AND.

- If any operand is `true`, it returns `true`
- Otherwise, if any operand is `undefined`, it returns `undefined`
- Otherwise, both operands are `false`, so it returns `false`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | F     | U     | T     |
| **U**   | U     | U     | T     |
| **T**   | T     | T     | T     |

---

The following are rarely used. You probably only need the three above.

### XOR

The result is `true` only when the operands are _different booleans_. It's just like boolean XOR, except `undefined` wins out.

- If one operand is `true` and the other is `false`, it returns `true`
- If both operands are `true` or both are `false`, it returns `false`
- If any operand is `undefined`, it returns `undefined`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | F     | U     | T     |
| **U**   | U     | U     | U     |
| **T**   | T     | U     | F     |

### XNOR / EQ

XOR negated. The result is `true` only when the operands are _the same boolean_. It's just like boolean XNOR, except `undefined` wins out.

- If both operands are `true` or both are `false`, it returns `true`
- If one operand is `true` and the other is `false`, it returns `false`
- If any operand is `undefined`, it returns `undefined`

| **A/B** | **F** | **U** | **T** |
|---------|-------|-------|-------|
| **F**   | T     | U     | F     |
| **U**   | U     | U     | U     |
| **T**   | F     | U     | T     |


## License

This work is dual-licensed under both MIT and XPL. You can choose either of the two.

`SPDX-License-Identifier: MIT OR XPL`
