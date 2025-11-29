# Ternary

A lightweight, type-safe implementation of [three-valued logic][3VL] (3VL) that enables nuanced logical operations where truth can be indeterminate ([Łukasiewicz's Ł₃][L3]), unknown ([Kleene's K₃][K3]) or paradoxical ([Priest's LP][LP]).

Nothing fancy, just:

```ts
type ternary = boolean | undefined
```

With common logical connectives:

- [`not`][not]
- [`both`][both]/[`and`][and]
- [`either`][either]/[`or`][or]

As well as:

- [`same`][same]/[`xnor`][xnor]
- [`differ`][differ]/[`xor`][xor]

And conditional operations:

- [`resolve`][resolve], a [conditional][] that is actually ternary (Ł₃/K₃)
- [`collapse`][collapse], a [paraconsistent][] conditional (LP)

These functions enforce strict equality, unlike JavaScript's [sloppy definition of truth][truthy].

Also included is `Ternary`, a function/class like `Boolean`, for coercing any value to a ternary value. Note: the coercion is sloppy, because JavaScript.

## What for?

Sometimes things aren't quite so binary.

|                        | `true` | `false` | `undefined`    | Logic |
|------------------------|--------|---------|----------------|-------|
| **[Unknowability][]**  | true   | false   | unknown        | K₃    |
| **[Undecidability][]** | true   | false   | undecidable    | K₃    |
| **[Indeterminacy][]**  | true   | false   | indeterminate  | Ł₃    |
| **[Paradoxical][]**    | true   | false   | true and false | LP    |

For example:

|                       | `true`   | `false`  | `undefined`    |
|-----------------------|----------|----------|----------------|
| **Optional input**    | yes      | no       | blank          |
| **Ternary input**     | yes      | no       | not applicable |
| **Access control**    | allow    | deny     | not specified  |
| **Decision system**   | approve  | reject   | needs review   |
| **Electrical charge** | positive | negative | no charge      |

> Ternary – either you need it, you don't need it, or you don't know whether you need it.

A variable that is `true | false | undefined` is already ternary. This library merely formalizes that and provides useful functions for correct evaluation using ternary logic.

In JavaScript's own conditionals, `undefined` is coerced to `false` and effectively ignored.

In Kleene/Łukasiewicz's ternary logic, `undefined` _propagates_: a compound condition is `true` or `false` only if it is _definitely_ `true` or _definitely_ `false`; otherwise it is `undefined`.

In Priest's logic of paradox, a compound condition is `true` if it is either _definitely_ `true` or _simultaneously_ `true` and `false`, here represented by the value `undefined`.

## Installation

With your package manager of choice, install `@joakim/ternary` from either JSR or npm.

## Usage

See the [documentation][docs].

### Semantics

When working with ternary logic, one must choose the semantics of `undefined`, which will vary by use case.

That means deciding:

1. What the third value means
   - Kleene's K₃: not known
   - Łukasiewicz's Ł₃: not _yet_ known
   - Priest's LP: known to be _simultaneously_ true and false

2. How to handle the third value
   - [`resolve`][resolve] it, acknowledging the existence of the third value
   - [`collapse`][collapse] it to a boolean, with `undefined` evaluated as `true` (LP)
   - Let JavaScript collapse it, coercing `undefined` to `false` in conditionals

### Example

To illustrate, here's a naïve example of using ternary logic to determine loan eligibility:

```ts
import { type ternary, both, either, resolve } from '@joakim/ternary'

type LoanApplicantStatus = {
  income: ternary
  debt: ternary
  assets: ternary
  history: ternary
}

function check({ income, debt, assets, history }: LoanApplicantStatus) {
  let result = either(both(income, debt), both(assets, history))

  return resolve(result, "Approve", "Reject", "Needs review")
}

check({ income: true,  debt: false,     assets: true,  history: true  }) // "Approve"
check({ income: true,  debt: undefined, assets: false, history: false }) // "Needs review"
check({ income: false, debt: undefined, assets: true,  history: false }) // "Reject"
```

If one used `collapse` instead of `resolve`, `undefined` would evaluate as `true`, effectively approving any loan applications that would otherwise need review.

```ts
collapse(result, "Approve", "Reject")
```

If one used JavaScript's own conditionals instead, `undefined` would be coerced to `false`, effectively rejecting applications without review. When dealing with ternary logic, it often makes sense to acknowledge the third value.

If the arguments to `resolve` were functions, one could call the resolved function:

```ts
resolve(result, approve, reject, review)(application)
```

## Truth tables

_A quick guide to ternary logic_

While obviously more complex than boolean logic, ternary is not as difficult as it looks once you get the hang of it. It helps to think of `undefined` as an _unknown_ truth value that could potentially be `true` or `false`, we just don't know.

- F = `false`
- U = `undefined` or _unknown_
- T = `true`

### `not`

Flips `true` and `false`, `undefined` remains the same.

| **A** | **NOT A** |
|-------|-----------|
| **F** | T         |
| **U** | U         |
| **T** | F         |

### `both` / `and`

The result is the _least true_ of the operands.

- If any operand is `false`, it returns `false`
- Otherwise, if any operand is `undefined`, it returns `undefined`
- Otherwise, both operands are `true`, so it returns `true`

It's just like boolean **and**, except `undefined` wins out over `true`.

|       | **F** | **U** | **T** |
|-------|-------|-------|-------|
| **F** | F     | F     | F     |
| **U** | F     | U     | U     |
| **T** | F     | U     | T     |

### `either` / `or`

The result is the _most true_ of the operands.

- If any operand is `true`, it returns `true`
- Otherwise, if any operand is `undefined`, it returns `undefined`
- Otherwise, both operands are `false`, so it returns `false`

It's just like boolean **or**, except `undefined` wins out over `false`.

|       | **F** | **U** | **T** |
|-------|-------|-------|-------|
| **F** | F     | U     | T     |
| **U** | U     | U     | T     |
| **T** | T     | T     | T     |

### `same` / `xnor`

The result is `true` only when the operands are _the same_ boolean value.

- If both operands are `true` or both are `false`, it returns `true`
- If one operand is `true` and the other is `false`, it returns `false`
- If any operand is `undefined`, it returns `undefined`

It's just like boolean **xnor**, except `undefined` always wins out.

|       | **F** | **U** | **T** |
|-------|-------|-------|-------|
| **F** | T     | U     | F     |
| **U** | U     | U     | U     |
| **T** | F     | U     | T     |

### `differ` / `xor`

The result is `true` only when the operands are _different_ boolean values.

- If one operand is `true` and the other is `false`, it returns `true`
- If both operands are `true` or both are `false`, it returns `false`
- If any operand is `undefined`, it returns `undefined`

It's just like boolean **xor**, except `undefined` always wins out.

|       | **F** | **U** | **T** |
|-------|-------|-------|-------|
| **F** | F     | U     | T     |
| **U** | U     | U     | U     |
| **T** | T     | U     | F     |


## License

This work is dual-licensed under both [MIT](LICENSE.MIT) and [XPL](LICENSE.XPL). You may choose either of the two.

`SPDX-License-Identifier: MIT OR XPL`

[3VL]: https://en.wikipedia.org/wiki/Three-valued_logic
[K3]: https://en.wikipedia.org/wiki/Three-valued_logic#Kleene_and_Priest_logics
[L3]: https://en.wikipedia.org/wiki/%C5%81ukasiewicz_logic
[LP]: https://en.wikipedia.org/wiki/Paraconsistent_logic#Logic_of_Paradox

[truthy]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
[conditional]: https://en.wikipedia.org/wiki/Ternary_conditional_operator
[paraconsistent]: https://en.wikipedia.org/wiki/Paraconsistent_logic
[unknowability]: https://en.wikipedia.org/wiki/Unknowability
[undecidability]: https://en.wikipedia.org/wiki/Undecidable_problem
[indeterminacy]: https://en.wikipedia.org/wiki/Problem_of_future_contingents
[paradoxical]: https://en.wikipedia.org/wiki/Paradox

[not]: https://jsr.io/@joakim/ternary/doc/~/not
[and]: https://jsr.io/@joakim/ternary/doc/~/and
[both]: https://jsr.io/@joakim/ternary/doc/~/both
[or]: https://jsr.io/@joakim/ternary/doc/~/or
[either]: https://jsr.io/@joakim/ternary/doc/~/either
[xor]: https://jsr.io/@joakim/ternary/doc/~/xor
[differ]: https://jsr.io/@joakim/ternary/doc/~/differ
[xnor]: https://jsr.io/@joakim/ternary/doc/~/xnor
[same]: https://jsr.io/@joakim/ternary/doc/~/same
[resolve]: https://jsr.io/@joakim/ternary/doc/~/resolve
[collapse]: https://jsr.io/@joakim/ternary/doc/~/collapse

[docs]: https://jsr.io/@joakim/ternary/doc
