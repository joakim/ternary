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

Also included is [`Ternary`][ternary], a function/class like `Boolean`, for coercing any value to a ternary value (sloppy, because JavaScript), as well as [`toBoolean`][toBoolean] for collapsing a ternary value to a boolean using Priest's [Logic of Paradox][priest].

There's also [an alternative implementation](balanced.ts) with balanced ternary (`-1`, `0`, `+1`).

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

In Kleene/Łukasiewicz's ternary logic, `undefined` _propagates_: a compound condition is `true` or `false` only if it is definitely `true` or definitely `false`; otherwise it is `undefined`.

In Priest's [Logic of Paradox][priest], `undefined` also propagates, but it signifies _simultaneously_ `true` and `false`. This enables collapsing a ternary condition to a boolean, where it becomes `true` if it is definitely `true` or simultaneously `true` and `false` (`undefined`).

In JavaScript's own conditionals, `undefined` is coerced to `false`.

## Installation

With your package manager of choice, install `@joakim/ternary` from JSR.

## Usage

See the [documentation][docs].

### Semantics

When working with ternary logic, one must choose the semantics of `undefined`, which will vary by use case.

That means deciding:

1. What the third value means
   - Kleene's K₃: not known/knowable
   - Łukasiewicz's Ł₃: not _yet_ known
   - Priest's LP: known to be _simultaneously_ `true` and `false`

2. How to handle the truth
   - [`resolve`][resolve] it, acknowledging the existence of the third value
   - [`collapse`][collapse] it, with `undefined` evaluated as `true` (LP style)
   - Let JavaScript [handle it][truth], coercing `undefined` to `false` in conditionals

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

When working with ternary logic, it often makes most sense to acknowledge the third value with the `resolve` conditional.

If the example had used `collapse`, `undefined` would have been evaluated as `true`, effectively approving any loan application that would otherwise need review. Very generous, but not what you'd want.

```ts
collapse(result, "Approve", "Reject")
```

If the example had used JavaScript's own conditionals, `undefined` would have been coerced to `false`, effectively rejecting any application that would otherwise need review. Not what you'd want either.

If, however, it makes sense to interpret the value using Priest's [Logic of Paradox][priest], it can be safely collapsed to a boolean for use in JavaScript's conditionals.

```ts
if (toBoolean(result)) {
  // true, possibly paradoxical
}
```

### Tips

In general, the functions lend themselves to a functional programming style.

Arguments of `resolve` and `collapse` can be functions, allowing one to call the returned function directly. They are also generic, allowing one to specify a return type.

```ts
resolve<ApplicationHandler>(result, approve, reject, review)(application)
```

Only the condition (first argument) and the `true` case (second argument) are required. The remaining arguments are optional, defaulting to `undefined`.

The following logical connectives come in two variants, one for n-ary arguments and one for 2 arguments.

| Connective | n-ary          | 2 arguments        |
|------------|----------------|--------------------|
| AND        | [`and`][and]   | [`both`][both]     |
| OR         | [`or`][or]     | [`either`][either] |
| XNOR       | [`xnor`][xnor] | [`same`][same]     |
| XOR        | [`xor`][xor]   | [`differ`][differ] |

The 2 argument versions have more intuitive names, making logical expressions read almost like sentences, and should perform better.

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
[toBoolean]: https://jsr.io/@joakim/ternary/doc/~/toBoolean
[Ternary]: https://jsr.io/@joakim/ternary/doc/~/Ternary

[docs]: https://jsr.io/@joakim/ternary/doc

[priest]: https://grahampriest.net/?ddownload=793
[truth]: https://www.youtube.com/watch?v=MMzd40i8TfA
